import React from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const transactions = [
  { id: 'TXN-001', date: '2024-09-25', amount: 49.99, status: 'Completed', method: 'Visa' },
  { id: 'TXN-002', date: '2024-09-24', amount: 12.50, status: 'Failed', method: 'Mastercard' },
  { id: 'TXN-003', date: '2024-09-23', amount: 99.00, status: 'Completed', method: 'PayPal' },
  { id: 'TXN-004', date: '2024-09-22', amount: 5.00, status: 'Pending', method: 'Stripe' },
];

function PaymentDetails() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Transaction History</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-gray-50 transition duration-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{txn.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{txn.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-lg font-semibold text-green-700">${txn.amount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {txn.status === 'Completed' ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircleIcon className="h-4 w-4 mr-1" /> Completed
                    </span>
                  ) : txn.status === 'Failed' ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <XCircleIcon className="h-4 w-4 mr-1" /> Failed
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      
                       Pending
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{txn.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PaymentDetails;