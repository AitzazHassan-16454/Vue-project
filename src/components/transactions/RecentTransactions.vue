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
  AlertCircle,
} from '@lucide/vue'
import { useTransactionStore, type Transaction } from '@/stores/transactionStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { formatCurrency } from '@/utils/currency'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

const txStore = useTransactionStore()
const settingsStore = useSettingsStore()

const searchQuery = ref('')
const selectedStatus = ref<'All' | 'Completed' | 'Pending' | 'Refunded'>('All')
const copiedId = ref<string | null>(null)
const toastMessage = ref<string | null>(null)

// Add Transaction Modal State
const isAddModalOpen = ref(false)
const newClient = ref('')
const newCategory = ref('Enterprise Annual Tier')
const newAmount = ref<number | ''>('')
const newStatus = ref<'Completed' | 'Pending'>('Completed')
const addError = ref('')

// Edit Transaction Modal State
const isEditModalOpen = ref(false)
const txToEdit = ref<Transaction | null>(null)
const editClient = ref('')
const editCategory = ref('')
const editAmount = ref<number | ''>('')
const editStatus = ref<'Completed' | 'Pending' | 'Refunded'>('Completed')
const editError = ref('')

// Delete Confirmation Modal State
const isDeleteConfirmOpen = ref(false)
const txToDelete = ref<Transaction | null>(null)

const filteredTransactions = computed(() => {
  return txStore.list.filter((tx) => {
    const q = searchQuery.value.trim().toLowerCase()
    const matchesSearch =
      !q ||
      tx.client.toLowerCase().includes(q) ||
      tx.id.toLowerCase().includes(q) ||
      tx.category.toLowerCase().includes(q)

    const matchesStatus =
      selectedStatus.value === 'All' || tx.status === selectedStatus.value

    return matchesSearch && matchesStatus
  })
})

function showToast(msg: string) {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = null
  }, 2500)
}

function copyId(id: string) {
  if (navigator?.clipboard) {
    navigator.clipboard.writeText(id).catch(() => {})
  }
  copiedId.value = id
  showToast(`Copied ${id} to clipboard!`)
  setTimeout(() => {
    copiedId.value = null
  }, 2000)
}

function handleAddTransaction() {
  addError.value = ''
  if (!newClient.value.trim()) {
    addError.value = 'Client name is required.'
    return
  }
  if (!newAmount.value || Number(newAmount.value) <= 0) {
    addError.value = 'Please enter a valid amount greater than 0.'
    return
  }

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
  showToast('Transaction added to ledger successfully!')
}

// Edit Flow
function openEditModal(tx: Transaction) {
  txToEdit.value = tx
  editClient.value = tx.client
  editCategory.value = tx.category
  editAmount.value = tx.amount
  editStatus.value = tx.status
  editError.value = ''
  isEditModalOpen.value = true
}

function handleSaveEdit() {
  editError.value = ''
  if (!txToEdit.value || !editClient.value.trim()) {
    editError.value = 'Client name cannot be empty.'
    return
  }
  if (!editAmount.value || Number(editAmount.value) <= 0) {
    editError.value = 'Please enter an amount greater than 0.'
    return
  }

  txStore.updateTransaction(txToEdit.value.id, {
    client: editClient.value.trim(),
    category: editCategory.value,
    amount: Number(editAmount.value),
    status: editStatus.value,
  })

  isEditModalOpen.value = false
  txToEdit.value = null
  showToast('Transaction updated successfully!')
}

// Delete Confirmation Flow
function requestDelete(tx: Transaction) {
  txToDelete.value = tx
  isDeleteConfirmOpen.value = true
}

function handleConfirmDelete() {
  if (txToDelete.value) {
    const id = txToDelete.value.id
    txStore.deleteTransaction(id)
    txToDelete.value = null
    showToast(`Transaction ${id} removed.`)
  }
  isDeleteConfirmOpen.value = false
}

function exportCsv() {
  if (filteredTransactions.value.length === 0) {
    showToast('No records available to export.')
    return
  }

  const headers = ['Transaction ID', 'Client Organization', 'Subscription Category', 'Amount', 'Currency', 'Status', 'Date']
  const rows = filteredTransactions.value.map((t) => [
    t.id,
    `"${t.client.replace(/"/g, '""')}"`,
    `"${t.category.replace(/"/g, '""')}"`,
    t.amount.toFixed(2),
    settingsStore.currency,
    t.status,
    `"${t.date}"`,
  ])

  const csvContent =
    'data:text/csv;charset=utf-8,\uFEFF' +
    [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n')

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  const dateStr = new Date().toISOString().split('T')[0]
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `nexus_ledger_${dateStr}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showToast(`Exported ${filteredTransactions.value.length} transactions as CSV!`)
}

defineExpose({
  openAddModal: () => { isAddModalOpen.value = true },
  exportCsv,
})
</script>

<template>
  <div class="depth-card rounded-2xl p-4 sm:p-6 md:p-8 relative">
    <!-- Toast notification -->
    <transition name="fade">
      <div
        v-if="toastMessage"
        class="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold shadow-xl flex items-center gap-2 border border-slate-700 dark:border-slate-300"
      >
        <CheckCircle2 class="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
        <span>{{ toastMessage }}</span>
      </div>
    </transition>

    <!-- Header Controls -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
      <div>
        <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <span>Global Transaction Ledger</span>
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 font-mono font-bold">
            {{ filteredTransactions.length }} Records
          </span>
        </h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Live settled payment operations across multi-currency gateways.</p>
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <!-- Status Filter Pills -->
        <div class="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-x-auto">
          <button
            v-for="st in (['All', 'Completed', 'Pending', 'Refunded'] as const)"
            :key="st"
            type="button"
            @click="selectedStatus = st"
            :class="[
              'px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-bold rounded-lg transition-all cursor-pointer shrink-0',
              selectedStatus === st
                ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-2xs border border-slate-200 dark:border-slate-600'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            ]"
          >
            {{ st }}
          </button>
        </div>

        <!-- Add Transaction Button -->
        <button
          type="button"
          @click="isAddModalOpen = true"
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition cursor-pointer shrink-0"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>New Entry</span>
        </button>

        <!-- CSV Export Button -->
        <button
          type="button"
          @click="exportCsv"
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 transition shadow-xs cursor-pointer shrink-0"
        >
          <Download class="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>CSV</span>
        </button>
      </div>
    </div>

    <!-- Search Bar Filter -->
    <div class="py-4">
      <div class="relative w-full sm:w-80">
        <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Filter by client, ID, or tier..."
          class="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 shadow-2xs transition-all"
        />
      </div>
    </div>

    <!-- Table Container with Horizontal Scroll & Min-Width for Small Devices -->
    <div class="overflow-x-auto -mx-4 sm:-mx-6 md:-mx-8">
      <table class="w-full text-left text-xs text-slate-700 dark:text-slate-300 min-w-[700px]">
        <thead class="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold border-y border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-850/90">
          <tr>
            <th class="py-3 px-4 sm:px-6 md:px-8">Identifier</th>
            <th class="py-3 px-4">Client Organization</th>
            <th class="py-3 px-4">Subscription Category</th>
            <th class="py-3 px-4">Amount</th>
            <th class="py-3 px-4">Status</th>
            <th class="py-3 px-4">Timestamp</th>
            <th class="py-3 px-4 sm:px-6 md:px-8 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80 font-sans">
          <tr
            v-for="tx in filteredTransactions"
            :key="tx.id"
            class="hover:bg-indigo-50/30 dark:hover:bg-slate-800/40 transition-colors group"
          >
            <!-- ID with Copy button -->
            <td class="py-3.5 px-4 sm:px-6 md:px-8 font-mono font-semibold">
              <button
                type="button"
                @click="copyId(tx.id)"
                class="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors cursor-pointer"
                title="Copy ID"
              >
                <span>{{ tx.id }}</span>
                <Copy class="w-3 h-3 opacity-60 group-hover:opacity-100" />
                <span v-if="copiedId === tx.id" class="text-[10px] text-emerald-600 dark:text-emerald-400 font-sans font-bold">Copied!</span>
              </button>
            </td>

            <!-- Client with Avatar -->
            <td class="py-3.5 px-4">
              <div class="flex items-center gap-2.5 sm:gap-3">
                <div class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300 shadow-2xs shrink-0">
                  {{ tx.avatar }}
                </div>
                <div class="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {{ tx.client }}
                </div>
              </div>
            </td>

            <!-- Category -->
            <td class="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-medium">
              {{ tx.category }}
            </td>

            <!-- Amount -->
            <td class="py-4 px-4 font-mono font-bold text-slate-900 dark:text-white text-sm">
              {{ formatCurrency(tx.amount, settingsStore.currency) }}
            </td>

            <!-- Status Badge -->
            <td class="py-3.5 px-4">
              <span
                :class="[
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border shadow-2xs whitespace-nowrap',
                  tx.status === 'Completed' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60' :
                  tx.status === 'Pending' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60' :
                  'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60'
                ]"
              >
                <CheckCircle2 v-if="tx.status === 'Completed'" class="w-3 h-3" />
                <Clock v-else-if="tx.status === 'Pending'" class="w-3 h-3" />
                <RotateCcw v-else class="w-3 h-3" />
                {{ tx.status }}
              </span>
            </td>

            <!-- Date -->
            <td class="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px] whitespace-nowrap">
              {{ tx.date }}
            </td>

            <!-- Actions: Edit & Delete -->
            <td class="py-3.5 px-4 sm:px-6 md:px-8 text-right whitespace-nowrap">
              <div class="flex items-center justify-end gap-1">
                <button
                  type="button"
                  @click="openEditModal(tx)"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Edit Entry"
                >
                  <Pencil class="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  @click="requestDelete(tx)"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 transition cursor-pointer"
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
      <div v-if="filteredTransactions.length === 0" class="py-12 text-center text-slate-500 dark:text-slate-400">
        <p class="text-sm font-medium">No transactions match your search criteria.</p>
        <button
          type="button"
          @click="searchQuery = ''; selectedStatus = 'All'"
          class="mt-2 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold cursor-pointer"
        >
          Reset Filters
        </button>
      </div>
    </div>

    <!-- Modal: Add New Transaction -->
    <div
      v-if="isAddModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-xs overflow-y-auto"
    >
      <div class="depth-modal bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-5 sm:p-6 relative max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h4 class="text-base font-bold text-slate-900 dark:text-white">Record New Transaction</h4>
          <button
            type="button"
            @click="isAddModalOpen = false"
            class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <div v-if="addError" class="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle class="w-4 h-4 shrink-0" />
          <span>{{ addError }}</span>
        </div>

        <form @submit.prevent="handleAddTransaction" class="space-y-4 mt-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Client Organization</label>
            <input
              v-model="newClient"
              type="text"
              required
              placeholder="e.g. Stripe Partners Ltd"
              class="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:bg-white dark:focus:bg-slate-750 focus:border-indigo-500 font-medium"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subscription Category</label>
            <select
              v-model="newCategory"
              class="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:bg-white dark:focus:bg-slate-750 focus:border-indigo-500 font-medium cursor-pointer"
            >
              <option value="Enterprise Annual Tier">Enterprise Annual Tier</option>
              <option value="GPU Cluster Lease">GPU Cluster Lease</option>
              <option value="Developer Pro Seats">Developer Pro Seats</option>
              <option value="Media Transcoding License">Media Transcoding License</option>
              <option value="POS Ingestion Stream">POS Ingestion Stream</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Amount ({{ settingsStore.currency }})
            </label>
            <input
              v-model.number="newAmount"
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="e.g. 5400.00"
              class="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:bg-white dark:focus:bg-slate-750 focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Settlement Status</label>
            <div class="flex items-center gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
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

          <div class="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              @click="isAddModalOpen = false"
              class="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition cursor-pointer"
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
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-xs overflow-y-auto"
    >
      <div class="depth-modal bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-5 sm:p-6 relative max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h4 class="text-base font-bold text-slate-900 dark:text-white">Edit Transaction</h4>
            <span class="text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400">{{ txToEdit?.id }}</span>
          </div>
          <button
            type="button"
            @click="isEditModalOpen = false"
            class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <div v-if="editError" class="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle class="w-4 h-4 shrink-0" />
          <span>{{ editError }}</span>
        </div>

        <form @submit.prevent="handleSaveEdit" class="space-y-4 mt-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Client Organization</label>
            <input
              v-model="editClient"
              type="text"
              required
              class="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:bg-white dark:focus:bg-slate-750 focus:border-indigo-500 font-medium"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subscription Category</label>
            <select
              v-model="editCategory"
              class="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:bg-white dark:focus:bg-slate-750 focus:border-indigo-500 font-medium cursor-pointer"
            >
              <option value="Enterprise Annual Tier">Enterprise Annual Tier</option>
              <option value="GPU Cluster Lease">GPU Cluster Lease</option>
              <option value="Developer Pro Seats">Developer Pro Seats</option>
              <option value="Media Transcoding License">Media Transcoding License</option>
              <option value="POS Ingestion Stream">POS Ingestion Stream</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Amount ({{ settingsStore.currency }})
            </label>
            <input
              v-model.number="editAmount"
              type="number"
              step="0.01"
              min="0.01"
              required
              class="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:bg-white dark:focus:bg-slate-750 focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Settlement Status</label>
            <select
              v-model="editStatus"
              class="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:bg-white dark:focus:bg-slate-750 focus:border-indigo-500 font-medium cursor-pointer"
            >
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          <div class="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              @click="isEditModalOpen = false"
              class="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition cursor-pointer"
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
