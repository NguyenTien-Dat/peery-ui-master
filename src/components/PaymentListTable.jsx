import { monetary } from '@/lib/utils';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import React from 'react';

function statusColor(sttId) {
	switch (sttId) {
		case 1:
			return 'text-red-500'
		case 2:
			return 'text-yellow-500'
		case 3:
			return ''
		case 4:
			return 'text-green-500'
	}
}

const PaymentListTable = ({ contract }) => {
	const { payments } = contract

	return (
		<div className="shadow-md sm:rounded-lg">
			<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
				<thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
					<tr>
						<th scope="col" className="px-6 py-3">No.</th>
						<th scope="col" className="px-6 py-3">Payment type</th>
						<th scope="col" className="px-6 py-3">Payment date</th>
						<th scope="col" className="px-6 py-3">Principal due</th>
						<th scope="col" className="px-6 py-3">Interest due</th>
						<th scope="col" className="px-6 py-3">Total due</th>
						<th scope="col" className="px-6 py-3">Remaining</th>
						<th scope="col" className="px-6 py-3">Status</th>
						<th scope="col" className="px-6 py-3"></th>
					</tr>
				</thead>
				<tbody>
					{payments.sort((a, b) => a.paymentNum - b.paymentNum).map((payment, index) => (
						<tr className="bg-white dark:bg-gray-800" key={index}>
							<th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{(payment.paymentNum == 0) ? '—' : payment.paymentNum}</th>
							<td className="px-6 py-4">{(payment.type == 'REPAY') ? 'Repayment' : 'Disbursement'}</td>
							<td className="px-6 py-4">{new Date(payment.dueDate).toLocaleDateString('vi-VN')}</td>
							<td className="px-6 py-4">{monetary(payment.principalDue)}</td>
							<td className="px-6 py-4">{(payment.type == 'REPAY') ? monetary(payment.interestDue) : '—'}</td>
							<td className="px-6 py-4">{monetary(payment.totalDue)}</td>
							<td className="px-6 py-4">{monetary(payment.totalDue - payment.amountPaid)}</td>
							<td className={`px-6 py-4 ${statusColor(payment.status.id)}`}>{payment.status.name}</td>
							<td className="px-4 py-4 text-right">
								<Button as={Link} href={`/paymentDetails/` + payment.id + '?' + new URLSearchParams({ contractId: contract.id })} className="font-medium rounded-full text-sm px-5 py-2.5 text-black overflow-hidden bg-slate-100 transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-blue-500 before:to-blue-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] hover:before:left-0">Payment Details</Button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
};

export default PaymentListTable;