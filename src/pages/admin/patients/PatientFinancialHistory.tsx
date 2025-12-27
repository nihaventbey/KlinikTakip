import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Patient, Transaction } from '../../../types';

interface PatientFinancialHistoryProps {
    patient: Patient;
}

const formatCurrency = (value: number, type: 'payment' | 'charge' | 'refund') => {
    const isCredit = type === 'payment';
    const color = isCredit ? 'text-green-600' : 'text-red-600';
    const prefix = isCredit ? '' : '-';
    return <span className={color}>{prefix}{Math.abs(value).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>;
};

const translateTransactionType = (type: 'income' | 'expense' | string) => {
    switch (type) {
        case 'income': return 'Gelir';
        case 'expense': return 'Gider';
        default: return type;
    }
}

export default function PatientFinancialHistory({ patient }: PatientFinancialHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!patient) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('patient_id', patient.id)
        .is('deleted_at', null)
        .order('transaction_date', { ascending: false });

      if (error) {
        console.error("Hastanın finansal geçmişi alınırken hata: ", error);
      } else if (data) {
        setTransactions(data as Transaction[]);
      }
      setLoading(false);
    };

    fetchTransactions();
  }, [patient]);

  return (
    <div className="space-y-6">
        {/* Bakiye Özeti */}
        <div className="p-4 bg-white rounded-lg border grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <p className="text-sm font-medium text-gray-500">Güncel Bakiye</p>
                <p className={`text-3xl font-bold ${patient.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {patient.balance.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                </p>
                <p className="text-xs text-gray-400">
                    {patient.balance > 0 ? 'Hastanın alacağı bulunmamaktadır.' : (patient.balance < 0 ? 'Hastanın borcu var.' : 'Hastanın borcu/alacağı bulunmamaktadır.')}
                </p>
            </div>
        </div>

        {/* İşlem Listesi */}
        <div className="bg-white rounded-lg border overflow-hidden">
            <h3 className="p-4 font-semibold text-lg border-b">İşlem Geçmişi</h3>
            {loading ? (
                <p className="p-8 text-center text-gray-500">İşlemler yükleniyor...</p>
            ) : transactions.length === 0 ? (
                <p className="p-8 text-center text-gray-500">Kayıtlı finansal işlem bulunamadı.</p>
            ) : (
                <div className="divide-y divide-gray-200">
                    {transactions.map(tx => {
                        const isPayment = tx.amount > 0;
                        const Icon = isPayment ? ArrowDownCircle : ArrowUpCircle;
                        const color = isPayment ? 'text-green-500' : 'text-red-500';
                        return (
                            <div key={tx.id} className="flex items-center p-4">
                                <div className="w-12">
                                    <Icon className={`w-6 h-6 ${color}`} />
                                </div>
                                <div className="flex-grow">
                                    <p className="font-medium">{translateTransactionType(tx.type)}</p>
                                    <p className="text-sm text-gray-500">{tx.description || 'Açıklama yok'}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-semibold ${color}`}>
                                        {tx.amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(tx.transaction_date).toLocaleDateString('tr-TR')}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    </div>
  );
}
