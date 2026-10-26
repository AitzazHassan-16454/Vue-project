<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Search,
  Download,
  Plus,
  CheckCircle2,
  Clock,
  RotateCcw,
  Copy,
  Trash2,
  Pencil,
  X,
} from '@lucide/vue'
import { useTransactionStore, type Transaction } from '@/stores/transactionStore'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

const txStore = useTransactionStore()

const searchQuery = ref('')
const selectedStatus = ref<'All' | 'Completed' | 'Pending' | 'Refunded'>('All')
const copiedId = ref<string | null>(null)

// Add Transaction Modal State
const isAddModalOpen = ref(false)
const newClient = ref('')
const newCategory = ref('Enterprise Annual Tier')
const newAmount = ref<number | ''>('')
const newStatus = ref<'Completed' | 'Pending'>('Completed')

// Edit Transaction Modal State
const isEditModalOpen = ref(false)
const txToEdit = ref<Transaction | null>(null)
const editClient = ref('')
const editCategory = ref('')
const editAmount = ref<number | ''>('')
const editStatus = ref<'Completed' | 'Pending' | 'Refunded'>('Completed')

// Delete Confirmation Modal State
const isDeleteConfirmOpen = ref(false)
const txToDelete = ref<Transaction | null>(null)

const filteredTransactions = computed(() => {
  return txStore.list.filter((tx) => {
    const matchesSearch =
      tx.client.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesStatus =
      selectedStatus.value === 'All' || tx.status === selectedStatus.value

    return matchesSearch && matchesStatus
  })
})

function copyId(id: string) {
  navigator.clipboard.writeText(id)
  copiedId.value = id
  setTimeout(() => {
    copiedId.value = null
  }, 2000)
}

function handleAddTransaction() {
  if (!newClient.value.trim() || !newAmount.value) return

  txStore.addTransaction({
    client: newClient.value.trim(),
    category: newCategory.value,
    amount: Number(newAmount.value),
    status: newStatus.value,
  })

  // Reset form
  newClient.value = ''
  newAmount.value = ''
  isAddModalOpen.value = false
}

// Edit Flow
function openEditModal(tx: Transaction) {
  txToEdit.value = tx
  editClient.value = tx.client
  editCategory.value = tx.category
  editAmount.value = tx.amount
  editStatus.value = tx.status
  isEditModalOpen.value = true
}

function handleSaveEdit() {
  if (!txToEdit.value || !editClient.value.trim() || !editAmount.value) return

  txStore.updateTransaction(txToEdit.value.id, {
    client: editClient.value.trim(),
    category: editCategory.value,
    amount: Number(editAmount.value),
    status: editStatus.value,
  })

  isEditModalOpen.value = false
  txToEdit.value = null
}

// Delete Confirmation Flow
function requestDelete(tx: Transaction) {
  txToDelete.value = tx
  isDeleteConfirmOpen.value = true
}

function handleConfirmDelete() {
  if (txToDelete.value) {
    txStore.deleteTransaction(txToDelete.value.id)
    txToDelete.value = null
  }
  isDeleteConfirmOpen.value = false
}

function exportCsv() {
  const headers = ['Transaction ID', 'Client', 'Category', 'Amount', 'Status', 'Date']
  const rows = filteredTransactions.value.map((t) => [
    t.id,
    `"${t.client}"`,
    `"${t.category}"`,
    t.amount,
    t.status,
    t.date,
  ])
  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', 'nexus_transactions.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <div class="depth-card rounded-2xl p-6 md:p-8">
    <!-- Header Controls -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
      <div>
        <h3 class="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Global Transaction Ledger</span>
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono font-bold">
            {{ filteredTransactions.length }} Total Records
          </span>
        </h3>
        <p class="text-xs text-slate-500 font-medium mt-0.5">Live settled payment operations across multi-currency gateways.</p>
      </div>

      <div class="flex items-center gap-2.5 flex-wrap">
        <!-- Status Filter Pills -->
        <div class="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
          <button
            v-for="st in (['All', 'Completed', 'Pending', 'Refunded'] as const)"
            :key="st"
            type="button"
            @click="selectedStatus = st"
            :class="[
              'px-2.5 py-1 text-xs font-bold rounded-lg transition-all',
              selectedStatus === st
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            {{ st }}
          </button>
        </div>

        <!-- Add Transaction Button -->
        <button
          type="button"
          @click="isAddModalOpen = true"
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>New Entry</span>
        </button>

        <!-- CSV Export Button -->
        <button
          type="button"
          @click="exportCsv"
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 transition shadow-xs"
        >
          <Download class="w-3.5 h-3.5 text-indigo-600" />
          <span>CSV</span>
        </button>
      </div>
    </div>

    <!-- Search Bar Filter -->
    <div class="py-4">
      <div class="relative w-full sm:w-80">
        <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Filter by client, ID, or tier..."
          class="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-2xs transition-all"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto -mx-6 md:-mx-8">
      <table class="w-full text-left text-xs text-slate-700">
        <thead class="text-[11px] uppercase tracking-wider text-slate-500 font-bold border-y border-slate-200 bg-slate-50/90">
          <tr>
            <th class="py-3 px-6 md:px-8">Identifier</th>
            <th class="py-3 px-4">Client Organization</th>
            <th class="py-3 px-4">Subscription Category</th>
            <th class="py-3 px-4">Amount</th>
            <th class="py-3 px-4">Status</th>
            <th class="py-3 px-4">Timestamp</th>
            <th class="py-3 px-6 md:px-8 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 font-sans">
          <tr
            v-for="tx in filteredTransactions"
            :key="tx.id"
            class="hover:bg-indigo-50/30 transition-colors group"
          >
            <!-- ID with Copy button -->
            <td class="py-3.5 px-6 md:px-8 font-mono font-semibold">
              <button
                type="button"
                @click="copyId(tx.id)"
                class="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 transition-colors"
                title="Copy ID"
              >
                <span>{{ tx.id }}</span>
                <Copy class="w-3 h-3 opacity-60 group-hover:opacity-100" />
                <span v-if="copiedId === tx.id" class="text-[10px] text-emerald-600 font-sans font-bold">Copied!</span>
              </button>
            </td>

            <!-- Client with Avatar -->
            <td class="py-3.5 px-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shadow-2xs">
                  {{ tx.avatar }}
                </div>
                <div class="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {{ tx.client }}
                </div>
              </div>
            </td>

            <!-- Category -->
            <td class="py-3.5 px-4 text-slate-500 font-medium">
              {{ tx.category }}
            </td>

            <!-- Amount -->
            <td class="py-4 px-4 font-mono font-bold text-slate-900 text-sm">
              ${{ tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
            </td>

            <!-- Status Badge -->
            <td class="py-3.5 px-4">
              <span
                :class="[
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border shadow-2xs',
                  tx.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  tx.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-rose-50 text-rose-700 border-rose-200'
                ]"
              >
                <CheckCircle2 v-if="tx.status === 'Completed'" class="w-3 h-3" />
                <Clock v-else-if="tx.status === 'Pending'" class="w-3 h-3" />
                <RotateCcw v-else class="w-3 h-3" />
                {{ tx.status }}
              </span>
            </td>

            <!-- Date -->
            <td class="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
              {{ tx.date }}
            </td>

            <!-- Actions: Edit & Delete -->
            <td class="py-3.5 px-6 md:px-8 text-right">
              <div class="flex items-center justify-end gap-1">
                <button
                  type="button"
                  @click="openEditModal(tx)"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                  title="Edit Entry"
                >
                  <Pencil class="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  @click="requestDelete(tx)"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Remove Entry"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="filteredTransactions.length === 0" class="py-12 text-center text-slate-500">
        <p class="text-sm font-medium">No transactions match your search criteria.</p>
        <button
          type="button"
          @click="searchQuery = ''; selectedStatus = 'All'"
          class="mt-2 text-xs text-indigo-600 hover:underline font-bold"
        >
          Reset Filters
        </button>
      </div>
    </div>

    <!-- Modal: Add New Transaction -->
    <div
      v-if="isAddModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
    >
      <div class="depth-modal bg-white rounded-2xl w-full max-w-md p-6 relative">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <h4 class="text-base font-bold text-slate-900">Record New Transaction</h4>
          <button
            type="button"
            @click="isAddModalOpen = false"
            class="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <form @submit.prevent="handleAddTransaction" class="space-y-4 mt-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Client Organization</label>
            <input
              v-model="newClient"
              type="text"
              required
              placeholder="e.g. Stripe Partners Ltd"
              class="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 font-medium"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Subscription Category</label>
            <select
              v-model="newCategory"
              class="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 font-medium"
            >
              <option value="Enterprise Annual Tier">Enterprise Annual Tier</option>
              <option value="GPU Cluster Lease">GPU Cluster Lease</option>
              <option value="Developer Pro Seats">Developer Pro Seats</option>
              <option value="Media Transcoding License">Media Transcoding License</option>
              <option value="POS Ingestion Stream">POS Ingestion Stream</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Amount ($ USD)</label>
            <input
              v-model.number="newAmount"
              type="number"
              step="0.01"
              required
              placeholder="e.g. 5400.00"
              class="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Settlement Status</label>
            <div class="flex items-center gap-4 text-xs font-semibold">
              <label class="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" value="Completed" v-model="newStatus" class="text-indigo-600" />
                <span>Completed</span>
              </label>
              <label class="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" value="Pending" v-model="newStatus" class="text-indigo-600" />
                <span>Pending</span>
              </label>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              @click="isAddModalOpen = false"
              class="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
            >
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal: Edit Existing Transaction -->
    <div
      v-if="isEditModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
    >
      <div class="depth-modal bg-white rounded-2xl w-full max-w-md p-6 relative">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h4 class="text-base font-bold text-slate-900">Edit Transaction</h4>
            <span class="text-xs font-mono font-medium text-indigo-600">{{ txToEdit?.id }}</span>
          </div>
          <button
            type="button"
            @click="isEditModalOpen = false"
            class="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <form @submit.prevent="handleSaveEdit" class="space-y-4 mt-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Client Organization</label>
            <input
              v-model="editClient"
              type="text"
              required
              class="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 font-medium"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Subscription Category</label>
            <select
              v-model="editCategory"
              class="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 font-medium"
            >
              <option value="Enterprise Annual Tier">Enterprise Annual Tier</option>
              <option value="GPU Cluster Lease">GPU Cluster Lease</option>
              <option value="Developer Pro Seats">Developer Pro Seats</option>
              <option value="Media Transcoding License">Media Transcoding License</option>
              <option value="POS Ingestion Stream">POS Ingestion Stream</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Amount ($ USD)</label>
            <input
              v-model.number="editAmount"
              type="number"
              step="0.01"
              required
              class="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Settlement Status</label>
            <select
              v-model="editStatus"
              class="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 font-medium"
            >
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          <div class="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              @click="isEditModalOpen = false"
              class="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
            >
              Apply Updates
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Reusable Confirmation Modal for Delete -->
    <ConfirmModal
      :is-open="isDeleteConfirmOpen"
      title="Delete Transaction Record"
      :message="`Are you sure you want to permanently remove transaction '${txToDelete?.id}' for ${txToDelete?.client}? This will recalculate all MRR metrics and cannot be undone.`"
      confirm-text="Delete Permanently"
      cancel-text="Keep Record"
      variant="danger"
      @confirm="handleConfirmDelete"
      @close="isDeleteConfirmOpen = false"
    />
  </div>
</template>
