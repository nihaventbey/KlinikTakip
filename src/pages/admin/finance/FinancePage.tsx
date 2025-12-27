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
import { Pencil, Trash2, Plus, TrendingUp, TrendingDown, Scale, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

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

const EntryCard = ({ entry, onEdit, onDelete, isDeleting }: { entry: any, onEdit: (item: any) => void, onDelete: (item: any) => void, isDeleting: boolean }) => {
    const isTransaction = 'patient_id' in entry;
    const isPayment = isTransaction && entry.amount > 0;
    
    const title = isTransaction ? entry.patient?.full_name || 'Genel İşlem' : entry.description;
    const date = isTransaction ? entry.transaction_date : entry.expense_date;
    const typeLabel = isTransaction ? translateTransactionType(entry.type) : 'Sabit Gider';
    const category = isTransaction ? null : entry.category;

    return (
        <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-gray-800">{title}</p>
                    {category && <p className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full inline-block mt-1">{category}</p>}
                    <p className="text-sm text-gray-500 mt-1">{new Date(date).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => onEdit(entry)} className="text-gray-400 hover:text-blue-600 p-2">
                        <Pencil size={16} />
                    </button>
                    <button onClick={() => onDelete(entry)} className="text-gray-400 hover:text-red-600 p-2" disabled={isDeleting}>
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <div className='flex items-center gap-2'>
                    {isPayment ? <ArrowDownCircle size={18} className="text-green-500" /> : <ArrowUpCircle size={18} className="text-red-500" />}
                    <span className="text-sm font-medium text-gray-700">{typeLabel}</span>
                </div>
                <p className="text-lg font-bold">{formatCurrency(entry.amount)}</p>
            </div>
        </div>
    );
};


export default function FinancePage() {
  const { user: profile } = useAuth();
  const queryClient = useQueryClient();
  const [modalState, setModalState] = useState<{ type: 'transaction' | 'expense' | null; isOpen: boolean; initialData?: any }>({ type: null, isOpen: false });
  const [activeTab, setActiveTab] = useState<'patient' | 'expenses'>('patient');
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

  const { data: allTransactions, } = useQuery({
    queryKey: ['transactions', profile?.clinic_id],
    queryFn: () => db.transactions.getAll(profile!.clinic_id!, 1, 1000), // Note: for stats, we should get all data
    enabled: !!profile?.clinic_id,
  });
  
  const { data: allExpenses } = useQuery({
    queryKey: ['clinicExpenses', profile?.clinic_id],
    queryFn: () => db.clinicExpenses.getAll(profile!.clinic_id!, 1, 1000),
    enabled: !!profile?.clinic_id,
  });


  const { totalRevenue, totalExpenses, netProfit } = useMemo(() => {
    const revenue = allTransactions?.data?.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0) || 0;
    const patientExpenses = allTransactions?.data?.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0;
    const fixedExpenses = allExpenses?.data?.reduce((sum, e) => sum + e.amount, 0) || 0;
    const totalExp = patientExpenses + fixedExpenses;
    
    return {
      totalRevenue: revenue,
      totalExpenses: totalExp,
      netProfit: revenue - totalExp
    };
  }, [allTransactions, allExpenses]);


  const deleteMutation = useMutation({
    mutationFn: (item: any) => {
        if (item.patient_id) {
            return db.transactions.remove(item.id);
        } else {
            return db.clinicExpenses.remove(item.id);
        }
    },
    onSuccess: (_, variables) => {
      toast.success('İşlem başarıyla silindi.');
      const queryKey = variables.patient_id ? ['transactions', page] : ['clinicExpenses', expensesPage];
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleDelete = (item: any) => {
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

  const renderPatientTransactions = () => (
    <>
      <div className="md:hidden grid grid-cols-1 gap-4">
        {loadingTrx ? <p>Yükleniyor...</p> : transactionsData?.data?.map(tx => (
          <EntryCard key={tx.id} entry={tx} onEdit={openModal.bind(null, 'transaction')} onDelete={handleDelete} isDeleting={deleteMutation.isPending && deleteMutation.variables?.id === tx.id} />
        ))}
      </div>
      <div className="hidden md:block bg-white rounded-lg shadow border overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hasta</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Açıklama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tip</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tutar</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loadingTrx && <tr><td colSpan={6} className="p-8 text-center text-gray-500">Yükleniyor...</td></tr>}
            {!loadingTrx && transactionsData?.data?.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-gray-500">Henüz hasta işlemi eklenmemiş.</td></tr>
            )}
            {transactionsData?.data?.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{tx.patient?.full_name || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{tx.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(tx.transaction_date).toLocaleDateString('tr-TR')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{translateTransactionType(tx.type)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-semibold">{formatCurrency(tx.amount)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button onClick={() => openModal('transaction', tx)} className="text-blue-600 hover:text-blue-900 p-2">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(tx)} className="text-red-600 hover:text-red-900 p-2" disabled={deleteMutation.isPending && deleteMutation.variables?.id === tx.id}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination currentPage={page} totalCount={transactionsData?.count || 0} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>
    </>
  );

  const renderExpensesTable = () => (
    <>
      <div className="md:hidden grid grid-cols-1 gap-4">
        {loadingExp ? <p>Yükleniyor...</p> : expensesData?.data?.map(exp => (
          <EntryCard key={exp.id} entry={exp} onEdit={openModal.bind(null, 'expense')} onDelete={handleDelete} isDeleting={deleteMutation.isPending && deleteMutation.variables?.id === exp.id} />
        ))}
      </div>
      <div className="hidden md:block bg-white rounded-lg shadow border overflow-x-auto">
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
            {loadingExp && <tr><td colSpan={5} className="p-8 text-center text-gray-500">Yükleniyor...</td></tr>}
            {!loadingExp && expensesData?.data?.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">Henüz sabit gider eklenmemiş.</td></tr>
            )}
            {expensesData?.data?.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{expense.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{expense.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(expense.expense_date).toLocaleDateString('tr-TR')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-semibold">{formatCurrency(expense.amount)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button onClick={() => openModal('expense', expense)} className="text-blue-600 hover:text-blue-900 p-2">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(expense)} className="text-red-600 hover:text-red-900 p-2" disabled={deleteMutation.isPending && deleteMutation.variables?.id === expense.id}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination currentPage={expensesPage} totalCount={expensesData?.count || 0} pageSize={PAGE_SIZE} onPageChange={setExpensesPage} />
      </div>
    </>
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
                Hasta İşlemi Ekle
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <StatCard title="Toplam Gelir" value={totalRevenue.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })} icon={<TrendingUp size={24} className="text-white"/>} colorClass="bg-green-500" />
        <StatCard title="Toplam Gider" value={totalExpenses.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })} icon={<TrendingDown size={24} className="text-white"/>} colorClass="bg-red-500" />
        <StatCard title="Net Kar" value={netProfit.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })} icon={<Scale size={24} className="text-white"/>} colorClass="bg-blue-500" />
      </div>

      <div className="mb-4 border-b border-gray-200">
        <nav className="-mb-px flex gap-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('patient')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'patient' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Hasta İşlemleri
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'expenses' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Sabit Giderler
          </button>
        </nav>
      </div>
      
      {activeTab === 'patient' && renderPatientTransactions()}
      {activeTab === 'expenses' && renderExpensesTable()}

      <Modal 
        isOpen={modalState.isOpen} 
        onClose={closeModal} 
        title={modalState.type === 'transaction' ? 'Hasta İşlemi' : 'Sabit Gider'}
      >
        {modalState.type === 'transaction' && <TransactionForm initialData={modalState.initialData} onClose={closeModal} />}
        {modalState.type === 'expense' && <ExpenseForm initialData={modalState.initialData} onClose={closeModal} />}
      </Modal>
    </div>
  );
}
