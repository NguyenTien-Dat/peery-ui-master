import React, { useState } from 'react';
import { Button, useDisclosure } from "@nextui-org/react";
import Link from 'next/link';
import { getCookie } from 'cookies-next';
import indicator from 'ordinal/indicator';

import PageTitle from '@/components/PageTitle';
import SiteLayout from '@/layouts/PageLayout';
import customFetch from '@/lib/customFetch';
import { fmtDate, monetary } from '@/lib/utils';
import UpdatePaymentModal from '@/components/UpdatePaymentModal';
import ConfirmPaymentModal from '@/components/ConfirmPaymentModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	useReactTable,
	getCoreRowModel,
	createColumnHelper,
	getPaginationRowModel,
	getSortedRowModel,
	flexRender,
} from '@tanstack/react-table'


export async function getServerSideProps({ req, res, query }) {
	const user = JSON.parse(getCookie('user', { req, res }))
	const resp = await customFetch('/contract/payment/paymentdetail', { userId: user.id, paymentId: query.paymentId })
	resp.amountRemaining = resp.totalDue - resp.amountPaid
	const contr = await customFetch('/contract/contractdetail', { userId: user.id, contractId: query.contractId })

	return {
		props: {
			payment: resp,
			user,
			contract: contr
		}
	}
}


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
		default:
			return ''
	}
}

function sttColor(insStt) {
	switch (insStt) {
		case 'PENDING':
			return 'text-yellow-500'
		case 'CONFIRMED':
			return 'text-green-500'
		default:
			return ''
	}
}


export default function PaymentDetails({ user, contract, payment }) {
	const discl = useDisclosure();
	const acpDiscl = useDisclosure();
	const [accept, setAccept] = useState();
	const [insId, setInsId] = useState();

	const [sorting, setSorting] = useState()
	const columnHelper = createColumnHelper()
	const cols = [
		columnHelper.accessor("id", {
			enableHiding: true
		}),
		columnHelper.accessor(i => (payment.installments.indexOf(i) + 1), {
			header: "No."
		}),
		columnHelper.accessor("date", {
			cell: info => fmtDate(info.getValue()),
			header: "Date"
		}),
		columnHelper.accessor("amount", {
			cell: info => monetary(info.getValue()),
			header: "Amount"
		}),
		columnHelper.accessor("paymentMethod.name", {
			header: "Payment method"
		}),
		columnHelper.accessor("status", {
			header: "Status",
			cell: info => info.getValue()
		}),
		columnHelper.display({
			id: 'actions',
			enableSorting: false,
			cell: ({ row }) => (
				<div className='flex gap-4'>
					{!((payment.type == 'DISBURSE' && user.role.id == 3) || (payment.type == 'REPAY' && user.role.id == 2)) && <>
						<Button isDisabled={row.getValue('status') != 'PENDING'} onClick={() => { setAccept(true); setInsId(row.getValue('id')); acpDiscl.onOpen() }} className="relative text-black text-base rounded-[50px] overflow-hidden bg-slate-100 transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-green-500 before:to-green-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-[50px] hover:before:left-0">Confirm</Button>
						<Button isDisabled={row.getValue('status') != 'PENDING'} onClick={() => { setAccept(false); setInsId(row.getValue('id')); acpDiscl.onOpen() }} className="relative text-black text-base rounded-[50px] overflow-hidden bg-slate-100 transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-red-500 before:to-red-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-[50px] hover:before:left-0">Reject</Button>
					</>}
				</div>
			)
		})
	]

	const table = useReactTable({
		data: payment.installments,
		state: {
			sorting,
		},
		columns: cols,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: { pageSize: 5 },
			columnVisibility: {
				id: false
			}
		}
	})

	return (
		<SiteLayout>
			<PageTitle title={`Contract no. ${contract.id}`} />

			<div>
				<h2 style={{ paddingLeft: '14px' }} className='text-left text-3xl mt-2 font-light tracking-tight text-gray-900'>
					{payment.type == 'REPAY' && <>{payment.paymentNum}<sup>{indicator(payment.paymentNum)}</sup> payment, due on {fmtDate(payment.dueDate)}</>}
					{payment.type == 'DISBURSE' && <>Disbursement</>}
				</h2>
			</div>

			<div className="container mx-auto py-8">
				<div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
					<div className="col-span-12 sm:col-span-12">
						<div className="bg-white shadow rounded-lg p-6">
							<div className="flex flex-col bg-gray-100 rounded-lg p-4 gap-4 shadow-sm">
								<div className="grid grid-cols-2 gap-4">
									{/* So tien can tra & trang thai */}
									<div className='grid grid-rows-2 gap-4 w-2/4'>
										<div className="flex flex-row items-center gap-8">
											<div className="w-36">
												<span className="text-green-900">Principal due</span>
											</div>
											<div className="w-36 text-black">
												<span className='text-2xl'>{monetary(payment.principalDue)}</span>
											</div>
										</div>

										<div className="flex flex-row items-center gap-8">
											<div className="w-36">
												<span className="text-green-900">Interest due</span>
											</div>
											<div className="w-36 text-black">
												<span className='text-2xl'>{(payment.type == 'REPAY') ? monetary(payment.interestDue) : '—'}</span>
											</div>
										</div>

										<div className="flex flex-row items-center gap-8 border-t-4 pt-4 border-gray-400">
											<div className="w-36">
												<span className="text-green-900">Total due</span>
											</div>
											<div className="w-36 text-black">
												<span className='text-2xl font-bold'>{monetary(payment.totalDue)}</span>
											</div>
										</div>
									</div>

									<div className='flex flex-row'>
										{/* So tien da tra */}
										<div className='grid grid-col-2 gap-4 w-2/4'>
											<div className="flex flex-col items-center gap-2">
												<div className="w-36">
													<span className="text-green-900">Amount paid</span>
												</div>
												<div className="w-36 text-black">
													<span className='text-2xl'>{monetary(payment.amountPaid)}</span>
												</div>
											</div>

											<div className="flex flex-col items-center gap-2">
												<div className="w-36">
													<span className="text-green-900">Amount remaining</span>
												</div>
												<div className="w-36 text-black">
													<span className={`text-2xl ${(payment.amountRemaining == payment.totalDue) ? 'text-red-500' : ((payment.amountRemaining <= 0) ? 'text-green-500' : 'text-yellow-500')}`}>{monetary(payment.amountRemaining)}</span>
												</div>
											</div>
										</div>

										{/* Trang thai */}
										<div className='grid grid-col-2 gap-4 w-2/4'>
											<div className="flex flex-col items-center gap-2">
												<div className="w-48">
													<span className="text-green-900">Status</span>
												</div>
												<div className="w-48 text-black">
													<span className={`text-2xl ${statusColor(payment.status.id)}`}>{payment.status.name}</span>
												</div>
											</div>

											<div className="flex flex-col items-center gap-2">
												<div className='w-48'>
													<span className="text-green-900">Last updated</span>
												</div>
												<div className="w-48 text-black">
													<span className='text-2xl'>{fmtDate(payment.updateDate)}</span>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div className="mt-4 flex justify-center">
									<div className="mx-3">
										<Button as={Link} href={`/contractDetails/${contract.id}`} className="relative py-2 px-12 text-black text-base rounded-[50px] overflow-hidden bg-slate-100 transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-[50px] hover:before:left-0">
											Back
										</Button>
									</div>

									{(contract.status.id != 5) && (payment.status.id != 4) && ((user.role.id == 2 && payment.type == 'REPAY') || (user.role.id == 3 && payment.type == 'DISBURSE')) && (<div className="mx-3">
										<button
												onClick={discl.onOpen}
												className="relative py-2 px-12 text-black text-base rounded-[50px] overflow-hidden bg-slate-100 transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-green-500 before:to-green-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-[50px] hover:before:left-0">
											Update payment status
										</button>
									</div>)}
								</div>

								<div className="relative mt-4 overflow-x-auto shadow-md sm:rounded-lg">
									<table className="w-full table-auto text-sm text-left text-gray-500 dark:text-gray-400">
										<thead className="text-sm text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
											{table.getHeaderGroups().map(headerGroup => (
												<tr key={headerGroup.id}>
													{headerGroup.headers.map(header => (
														<th key={header.id} className="px-6 py-3">
															{header.isPlaceholder ? null : (
																<div
																		{...{
																			className: `flex flex-row gap-2 items-center ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''}`,
																			onClick: header.column.getToggleSortingHandler(),
																		}}>
																	{flexRender(header.column.columnDef.header, header.getContext())}
																	{header.column.getCanSort() ? ({
																		asc: <FontAwesomeIcon className="h-3" icon="fa-solid fa-sort-up" />,
																		desc: <FontAwesomeIcon className="h-3" icon="fa-solid fa-sort-down" />,
																	}[header.column.getIsSorted()] ?? <FontAwesomeIcon className="h-3" icon="fa-solid fa-sort" />) : null}
																</div>
															)}
														</th>
													))}
												</tr>
											))}
										</thead>
										<tbody>
											{table.getRowModel().rows.length == 0 && <>
												<tr className='bg-white dark:bg-gray-800'>
													<td className='p-4 text-center' colSpan={table.getAllColumns().length}>
														There are currently no installments
													</td>
												</tr>
											</>}
											{table.getRowModel().rows.map(row => (
												<tr className="bg-white dark:bg-gray-800" key={row.id}>
													{row.getVisibleCells().map(cell => (
														<td key={cell.id} className={`px-6 py-4 ${(cell.column.id == 'status') ? sttColor(cell.getValue()) : ''}`}>
															{flexRender(cell.column.columnDef.cell, cell.getContext())}
														</td>
													))}
												</tr>
											))}
										</tbody>
									</table>

									<div className="flex justify-between py-2 px-10">
										<div className="w-80">
										</div>

										<div className="flex gap-1 w-80 justify-center items-center">
											<Button isIconOnly variant="light" onClick={() => table.setPageIndex(0)} isDisabled={!table.getCanPreviousPage()}>
												<FontAwesomeIcon className="h-4" icon="fa-solid fa-backward" />
											</Button>
											<Button isIconOnly variant="light" onClick={() => table.previousPage()} isDisabled={!table.getCanPreviousPage()}>
												<FontAwesomeIcon className="h-4" icon="fa-solid fa-caret-left" />
											</Button>

											<div>
												Page{' '}<span>{table.getState().pagination.pageIndex + 1} of{' '}{table.getPageCount()}</span>
											</div>

											<Button isIconOnly variant="light" onClick={() => table.nextPage()} isDisabled={!table.getCanNextPage()}>
												<FontAwesomeIcon className="h-4" icon="fa-solid fa-caret-right" />
											</Button>
											<Button isIconOnly variant="light" onClick={() => table.setPageIndex(table.getPageCount() - 1)} isDisabled={!table.getCanNextPage()}>
												<FontAwesomeIcon className="h-4" icon="fa-solid fa-forward" />
											</Button>
										</div>

										<div className="flex gap-2 w-80 items-center justify-end">
											<span>Rows per page:</span>
											<select
													className="p-1.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
													value={table.getState().pagination.pageSize}
													onChange={e => {
														table.setPageSize(Number(e.target.value))
													}}>
												{[5, 10, 25, 50, 100].map(pageSize => <option key={pageSize} value={pageSize}>{pageSize}</option>)}
											</select>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<UpdatePaymentModal user={user} disclosure={discl} payment={payment} />
			<ConfirmPaymentModal user={user} disclosure={acpDiscl} installment={insId} choice={accept} />
		</SiteLayout>
	);
}
