//////////////////////////////////////////////
// TRANG NÀY CHỈ DÙNG CHO NGƯỜI CHO VAY VÀ QTV
//////////////////////////////////////////////

import { getCookie, getCookies, hasCookie } from 'cookies-next'

import PageTitle from "@/components/PageTitle";
import SiteLayout from "@/layouts/PageLayout";
import customFetch from '@/lib/customFetch';
import { monthLabel, monetary, fmtDate, valueInArr, AMOUNT_RANGES, refreshUser } from '@/lib/utils';
import Link from 'next/link';
import { Button, Chip, Input, Select, SelectItem, Tooltip } from '@nextui-org/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	Column,
	Table,
	useReactTable,
	ColumnFiltersState,
	getCoreRowModel,
	createColumnHelper,
	getFilteredRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFacetedMinMaxValues,
	getPaginationRowModel,
	sortingFns,
	getSortedRowModel,
	FilterFn,
	SortingFn,
	ColumnDef,
	flexRender,
	FilterFns,
} from '@tanstack/react-table'
import { Suspense, useEffect, useState } from 'react';


export async function getServerSideProps({ req, res }) {
	let user = await refreshUser({ req, res })

	// Lấy danh sách request
	let params = {
		userId: user.id
	}
	let requests = await customFetch("/request/requestlist", params)
	requests.sort((a, b) => a.id - b.id)

	return {
		props: { requests, user }
	}
}

function Filter({ col }) {
	let columnFilterValue
	let [terms, setTerms] = useState([])
	let [statuses, setStatuses] = useState([])

	useEffect(() => {
		switch (col.id) {
			case 'term':
				customFetch('/request/terms').then(t => setTerms(t))
				break
			case 'status':
				customFetch('/requestStatus/list').then(s => setStatuses(s))
				break
		}
	}, [col])

	switch (col.id) {
		case 'term':
			columnFilterValue = col.getFilterValue()?.map(v => String(v))
			return (
				<Select
						label="Filter by term"
						className='w-48'
						placeholder="Select…"
						onSelectionChange={(selsSet) => {
							const sels = Array.from(selsSet)

							col.setFilterValue((old) => {
								if (sels.length == 0)
									return old
								if (sels.includes('all')) {
									return terms.map(v => Number(v.numberOfMonth))
								} else {
									return sels.map(v => Number(v))
								}
							})
						}}
						selectedKeys={columnFilterValue}
						selectionMode='multiple'>
					<SelectItem key='all'>All terms</SelectItem>
					{terms.map(term => <SelectItem key={term.numberOfMonth}>{monthLabel(term.numberOfMonth)}</SelectItem>)}
				</Select>
			)
		case 'status':
			columnFilterValue = col.getFilterValue()
			return (
				<Select
						label="Filter by status"
						className='w-48'
						placeholder="Select…"
						onSelectionChange={(selsSet) => {
							const sels = Array.from(selsSet)

							col.setFilterValue((old) => {
								if (sels.length == 0)
									return old
								if (sels.includes('all')) {
									return statuses.map(s => s.name)
								} else {
									return sels
								}
							})
						}}
						selectedKeys={columnFilterValue}
						selectionMode='multiple'>
					<SelectItem key='all'>All</SelectItem>
					{statuses.map(x => <SelectItem key={x.name}>{x.name}</SelectItem>)}
				</Select>
			)
		case 'amount':
			columnFilterValue = col.getFilterValue()
			return (
				<Select
						label="Filter by loan amount"
						className='w-60'
						placeholder="Select…"
						onSelectionChange={(selsSet) => {
							const sels = Array.from(selsSet)

							col.setFilterValue((old) => {
								if (sels.length == 0)
									return old
								if (sels.includes('all')) {
									return Object.keys(AMOUNT_RANGES)
								} else {
									return sels
								}
							})
						}}
						selectedKeys={columnFilterValue}
						selectionMode='multiple'>
					<SelectItem key='all'>All</SelectItem>
					<SelectItem key='under5m'>1.000.000 đ – 5.000.000 đ</SelectItem>
					<SelectItem key='5mTo10m'>5.000.000 đ – 10.000.000 đ</SelectItem>
					<SelectItem key='over10m'>10.000.000 đ – 20.000.000 đ</SelectItem>
				</Select>
			)
	}
}

export default function RequestList({ requests, user }) {
	const columnHelper = createColumnHelper()
	const [sorting, setSorting] = useState([
		{
			id: 'id',
			desc: false
		}
	])
	const [filter, setFilter] = useState([])
	const cols = [
		columnHelper.accessor("createdDate", {
			header: 'Date created',
			cell: info => fmtDate(info.getValue())
		}),
		columnHelper.accessor("id", {
			header: "No.",
		}),
		columnHelper.accessor(r => r.borrower.fullName, {
			header: 'Borrower',
			id: 'borrower'
		}),
		columnHelper.accessor(r => r.borrower.phone, {
			header: 'Phone number',
			id: 'phone'
		}),
		columnHelper.accessor(r => r.borrower.creditScore, {
			header: 'Credit score',
			id: 'creditScore'
		}),
		columnHelper.accessor("amount", {
			header: "Loan amount",
			cell: info => monetary(info.getValue()),
			filterFn: (row, colId, fVal) => {
				return fVal.some(range => {
					let [floor, ceiling] = AMOUNT_RANGES[range]
					let amount = row.getValue(colId)
					return (floor <= amount && amount <= ceiling)
				})
			}
		}),
		columnHelper.accessor(r => r.term.numberOfMonth, {
			header: "Term",
			id: 'term',
			cell: info => monthLabel(info.getValue()),
			filterFn: valueInArr
		}),
		columnHelper.accessor(u => u.status.name, {
			header: 'Status',
			id: 'status',
			filterFn: valueInArr
		}),
		columnHelper.display({
			id: 'requestDetails',
			enableSorting: false,
			cell: ({ row }) => (
				<Button as={Link} href={`/requestDetails/${row.getValue("id")}`} className="font-medium rounded-full text-sm px-5 py-2.5 text-black overflow-hidden bg-slate-100 transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-blue-500 before:to-blue-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] hover:before:left-0">
					Request Details
				</Button>
			)
		})
	]

	const table = useReactTable({
		data: requests,
		columns: cols,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		onColumnFiltersChange: setFilter,
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: {
				pageSize: 5
			},
			columnVisibility: {
				id: false,
				borrower: user.role.id != 2,
				phone: user.role.id != 2,
				creditScore: user.role.id != 2
			},
		},
		state: {
			sorting,
			columnFilters: filter
		}
	})

	// console.log(JSON.stringify(table.getState(), null, 2))

	return (
		<SiteLayout>
			<div className="flex flex-col gap-5">
				<div className="flex justify-between items-center gap-10">
					<PageTitle title={(user.role.id == 2) ? 'Your Loan Requests' : 'Browse Loan Requests'} />

					{(user.role.id == 2) &&
						<Button
							as={Link}
							href='/createLoanRequest'
							isDisabled={user.status.id != 3}
							className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
							startContent={<FontAwesomeIcon className='h-full w-full' icon='fa-solid fa-plus' />}
						>
							Create Loan Request
						</Button>
					}
				</div>

				{user.status.id == 2 && <div className='flex'>
					<p className='text-red-500'>You cannot ${user.role.id == 2 ? 'create' : 'accept'} loan requests until your profile is confirmed by our staff.</p>
				</div>}

				<div className='flex gap-4 mt-5'>
					<Filter col={table.getColumn('term')} />
					<Filter col={table.getColumn('status')} />
					<Filter col={table.getColumn('amount')} />
				</div>

				<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
					<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
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
										There are currently no loan requests
									</td>
								</tr>
							</>}

							{table.getRowModel().rows.map(row => (
								<tr className="bg-white dark:bg-gray-800" key={row.id}>
									{row.getVisibleCells().map(cell => (
										<td key={cell.id} className="px-6 py-4">
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
								Page{' '}
								<span>
									{table.getState().pagination.pageIndex + 1} of{' '}
									{table.getPageCount()}
								</span>
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
		</SiteLayout>
	);
}