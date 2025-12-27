import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { db } from '../../../lib/db';
import { useAuth } from '../../../contexts/AuthContext';
import { Transaction, ClinicExpense } from '../../../types';
import { Button } from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import TransactionForm from './TransactionForm';
import ExpenseForm from './ExpenseForm';
import Pagination from '../../../components/ui/Pagination';
import { Pencil, Trash2, Plus, TrendingUp, TrendingDown, Scale } from 'lucide-react';

const PAGE_SIZE = 10;

const formatCurrency = (value: number) => {
    const color = value >= 0 ? 'text-green-600' : 'text-red-600';
    return <span className={color}>{value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>;
};

const translateTransactionType = (type: 'income' | 'expense' | string) => {
    switch (type) {
        case 'income': return 'Gelir';
        case 'expense': return 'Gider';
        default: return 'Diğer';
    }
}

type CombinedEntry = (Transaction & { entryType: 'transaction' }) | (ClinicExpense & { entryType: 'expense' });

const StatCard = ({ title, value, icon, colorClass }: { title: string, value: string, icon: React.ReactNode, colorClass: string }) => (
    <div className="bg-white p-4 rounded-lg shadow border flex items-center">
      <div className={`p-3 rounded-full mr-4 ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
);


export default function FinancePage() {
  const { user: profile } = useAuth();
  const queryClient = useQueryClient();
  const [modalState, setModalState] = useState<{ type: 'transaction' | 'expense' | null; isOpen: boolean; initialData?: any }>({ type: null, isOpen: false });
  const [activeTab, setActiveTab] = useState<'all' | 'expenses'>('all');
  const [page, setPage] = useState(1);
  const [expensesPage, setExpensesPage] = useState(1);

  const { data: transactionsData, isLoading: loadingTrx } = useQuery({
    queryKey: ['transactions', profile?.clinic_id, page],
    queryFn: () => db.transactions.getAll(profile!.clinic_id!, page, PAGE_SIZE),
    enabled: !!profile?.clinic_id,
  });

  const { data: expensesData, isLoading: loadingExp } = useQuery({
    queryKey: ['clinicExpenses', profile?.clinic_id, expensesPage],
    queryFn: () => db.clinicExpenses.getAll(profile!.clinic_id!, expensesPage, PAGE_SIZE),
    enabled: !!profile?.clinic_id,
  });

  const transactions = transactionsData?.data;
  const transactionCount = transactionsData?.count ?? 0;
  
  const expenses = expensesData?.data;
  const expenseCount = expensesData?.count ?? 0;

  // Memoize total stats separately if they need to be non-paginated in the future.
  const { totalRevenue, totalExpenses, netProfit } = useMemo(() => {
    // For now, these stats reflect the data visible on the current pages.
    // A separate, non-paginated query would be needed for true totals.
    const revenue = transactionsData?.data?.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0) || 0;
    const patientExpenses = transactionsData?.data?.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0;
    const fixedExpenses = expensesData?.data?.reduce((sum, e) => sum + e.amount, 0) || 0;
    const totalExp = patientExpenses + fixedExpenses;
    
    return {
      totalRevenue: revenue,
      totalExpenses: totalExp,
      netProfit: revenue - totalExp
    };
  }, [transactionsData, expensesData]);

  const combinedData = useMemo(() => {
    if (!transactions) return [];
    
    const trxEntries: CombinedEntry[] = transactions.map(t => ({ ...t, entryType: 'transaction' }));
    
    if (activeTab === 'all' && expenses) {
      const expEntries: CombinedEntry[] = expenses.map(e => ({ ...e, entryType: 'expense' }));
      return [...trxEntries, ...expEntries].sort((a, b) => {
          const dateA = a.entryType === 'transaction' ? new Date(a.transaction_date) : new Date(a.expense_date);
          const dateB = b.entryType === 'transaction' ? new Date(b.transaction_date) : new Date(b.expense_date);
          return dateB.getTime() - dateA.getTime();
      });
    }
    return trxEntries;
  }, [transactions, expenses, activeTab]);


  const deleteMutation = useMutation({
    mutationFn: (item: CombinedEntry) => {
        if (item.entryType === 'transaction') {
            return db.transactions.remove(item.id);
        } else {
            return db.clinicExpenses.remove(item.id);
        }
    },
    onSuccess: (_, variables) => {
      toast.success('İşlem başarıyla silindi.');
      const queryKey = variables.entryType === 'transaction' ? ['transactions', page] : ['clinicExpenses', expensesPage];
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleDelete = (item: CombinedEntry) => {
    if (window.confirm('Bu işlemi silmek istediğinizden emin misiniz?')) {
      deleteMutation.mutate(item);
    }
  };

  const openModal = (type: 'transaction' | 'expense', initialData: any = null) => {
    setModalState({ type, isOpen: true, initialData });
  };

  const closeModal = () => {
    setModalState({ type: null, isOpen: false });
  };
  
  const isLoading = loadingTrx && activeTab === 'all';
  const isLoadingExpenses = loadingExp && activeTab === 'expenses';

  const renderAllTransactionsTable = () => (
    <div className="bg-white rounded-lg shadow border overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Açıklama / Hasta</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tip</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tutar</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">İşlemler</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading && <tr><td colSpan={5} className="p-8 text-center text-gray-500">Yükleniyor...</td></tr>}
          {!isLoading && combinedData.length === 0 && (
            <tr><td colSpan={5} className="p-8 text-center text-gray-500">Henüz finansal işlem eklenmemiş.</td></tr>
          )}
          {combinedData.map((entry) => (
            <tr key={`${entry.entryType}-${entry.id}`} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {entry.entryType === 'transaction' ? entry.patient?.full_name || 'Genel İşlem' : entry.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {new Date(entry.entryType === 'transaction' ? entry.transaction_date : entry.expense_date).toLocaleDateString('tr-TR')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {entry.entryType === 'transaction' ? translateTransactionType(entry.type) : 'Sabit Gider'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right font-semibold">{formatCurrency(entry.amount)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <button onClick={() => openModal(entry.entryType, entry)} className="text-blue-600 hover:text-blue-900 p-2" disabled={entry.entryType === 'expense'}>
                  <Pencil size={18} />
                </button>
                <button onClick={() => handleDelete(entry)} className="text-red-600 hover:text-red-900 p-2" disabled={deleteMutation.isPending && deleteMutation.variables?.id === entry.id}>
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination currentPage={page} totalCount={transactionCount} pageSize={PAGE_SIZE} onPageChange={setPage} />
    </div>
  );

  const renderExpensesTable = () => (
    <div className="bg-white rounded-lg shadow border overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Açıklama</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tutar</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">İşlemler</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoadingExpenses && <tr><td colSpan={5} className="p-8 text-center text-gray-500">Yükleniyor...</td></tr>}
          {!isLoadingExpenses && expenses?.length === 0 && (
            <tr><td colSpan={5} className="p-8 text-center text-gray-500">Henüz sabit gider eklenmemiş.</td></tr>
          )}
          {expenses?.map((expense) => (
            <tr key={expense.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{expense.description}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500">{expense.category}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(expense.expense_date).toLocaleDateString('tr-TR')}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right font-semibold">{formatCurrency(expense.amount)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <button onClick={() => openModal('expense', expense)} className="text-blue-600 hover:text-blue-900 p-2">
                  <Pencil size={18} />
                </button>
                <button onClick={() => handleDelete(expense as CombinedEntry)} className="text-red-600 hover:text-red-900 p-2" disabled={deleteMutation.isPending && deleteMutation.variables?.id === expense.id}>
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination currentPage={expensesPage} totalCount={expenseCount} pageSize={PAGE_SIZE} onPageChange={setExpensesPage} />
    </div>
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Finansal İşlemler</h1>
        <div className="flex gap-2">
            <Button onClick={() => openModal('expense')} variant="outline" className="w-full md:w-auto">
                <Plus size={18} className="mr-2"/>
                Sabit Gider Ekle
            </Button>
            <Button onClick={() => openModal('transaction')} className="w-full md:w-auto">
                <Plus size={18} className="mr-2"/>
                Yeni İşlem Ekle
            </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <StatCard title="Toplam Gelir" value={totalRevenue.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })} icon={<TrendingUp size={24} className="text-white"/>} colorClass="bg-green-500" />
        <StatCard title="Toplam Gider" value={totalExpenses.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })} icon={<TrendingDown size={24} className="text-white"/>} colorClass="bg-red-500" />
        <StatCard title="Net Kar" value={netProfit.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })} icon={<Scale size={24} className="text-white"/>} colorClass="bg-blue-500" />
      </div>

      {/* Tabs */}
      <div className="mb-4 border-b border-gray-200">
        <nav className="-mb-px flex gap-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('all')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'all' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Tüm İşlemler
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'expenses' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Sabit Giderler
          </button>
        </nav>
      </div>
      
      {/* Content */}
      {activeTab === 'all' && renderAllTransactionsTable()}
      {activeTab === 'expenses' && renderExpensesTable()}

      <Modal 
        isOpen={modalState.isOpen} 
        onClose={closeModal} 
        title={modalState.type === 'transaction' ? 'Finansal İşlem' : 'Sabit Gider'}
      >
        {modalState.type === 'transaction' && <TransactionForm initialData={modalState.initialData} onClose={closeModal} />}
        {modalState.type === 'expense' && <ExpenseForm initialData={modalState.initialData} onClose={closeModal} />}
      </Modal>
    </div>
  );
}
