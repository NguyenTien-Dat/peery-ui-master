/* eslint-disable react/jsx-key */
import PageTitle from "@/components/PageTitle"
import SiteLayout from "@/layouts/PageLayout"
import Link from "next/link"
import customFetch from "@/lib/customFetch"
import { getCookie, hasCookie } from "cookies-next"
import { monetary, monthLabel, round, valueInArr, AMOUNT_RANGES, fmtDate } from "@/lib/utils"
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
import {
	RankingInfo,
	rankItem,
	compareItems,
} from '@tanstack/match-sorter-utils'
import { Button, Select, SelectItem } from "@nextui-org/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"


export async function getServerSideProps({ req, res }) {
	// Đây là người dùng nào?
	let user = JSON.parse(getCookie('user', { req, res }))

	let params = {
		userId: user.id
	}
	let data = await customFetch("/contract/contractlist", params)

	return {
		props: { contracts: data, user }
	}
}

function sttColor(id) {
	switch (id) {
		case 'Undisbursed':
			return 'text-red-500'
		case 'Disbursed':
			return 'text-yellow-500'
		case 'Paid in full':
			return 'text-green-500'
	}
}

export default function ContractList({ contracts, user }) {
	const [sorting, setSorting] = useState([
		{
			id: 'id',
			desc: false
		}
	])
	const [columnFilters, setFilter] = useState()
	const columnHelper = createColumnHelper()
	const cols = [
		columnHelper.accessor("id", {
			header: "No."
		})
	]

	if ([1, 3].includes(user.role.id)) {
		cols.push(columnHelper.accessor(c => c.borrower.fullName, {
			id: 'borrowerName',
			header: 'Borrower'
		}))
	}

	if ([1, 2].includes(user.role.id)) {
		cols.push(columnHelper.accessor(c => c.lender.fullName, {
			id: 'lenderName',
			header: 'Lender'
		}))
	}

	cols.push(
		columnHelper.accessor('amountPrincipal', {
			cell: info => monetary(info.getValue()),
			header: 'Amount',
			id: 'amount',
			filterFn: (row, colId, fVal) => {
				return fVal.some(range => {
					let [floor, ceiling] = AMOUNT_RANGES[range]
					let amount = row.getValue(colId)
					return (floor <= amount && amount <= ceiling)
				})
			}
		}),
		columnHelper.accessor('amountRemaining', {
			cell: info => monetary(info.getValue()),
			header: 'Remaining'
		}),
		columnHelper.accessor('apr', {
			cell: info => `${round(info.getValue() * 100, 2).toLocaleString('vi-VN')}%`,
			header: 'Interest rate'
		}),
		columnHelper.accessor(c => c.term.numberOfMonth, {
			cell: info => monthLabel(info.getValue()),
			id: 'term',
			header: 'Term',
			filterFn: valueInArr
		}),
		columnHelper.accessor('createdDate', {
			cell: info => fmtDate(info.getValue()),
			header: 'Creation date'
		}),
		columnHelper.accessor(c => c.status.name, {
			id: 'status',
			header: 'Status',
			filterFn: valueInArr
		}),
		columnHelper.display({
			id: 'contractDetails',
			enableSorting: false,
			cell: ({ row }) => (
				<Button as={Link} href={`/contractDetails/${row.getValue("id")}`} className="relative py-2 px-8 text-black text-base rounded-[50px] overflow-hidden bg-slate-100 transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-green-500 before:to-green-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-[50px] hover:before:left-0">
					Details
				</Button>
			)
		})
	)

	const table = useReactTable({
		data: contracts,
		columns: cols,
		getCoreRowModel: getCoreRowModel(),
		onColumnFiltersChange: setFilter,
		getFilteredRowModel: getFilteredRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: {
				pageSize: 5
			}
		},
		state: {
			sorting,
			columnFilters
		},
	})

	return (
		<SiteLayout>
			<div className="flex flex-col gap-5">
				<PageTitle title="List of created contracts" />

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
										There are currently no contracts
									</td>
								</tr>
							</>}

							{table.getRowModel().rows.map(row => (
								<tr className="bg-white dark:bg-gray-800" key={row.id}>
									{row.getVisibleCells().map(cell => (
										<td key={cell.id} className={`px-6 py-4 ${(cell.column.id == 'status') && sttColor(cell.getValue())}`}>
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
	)
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
				customFetch('/contractStatus/list').then(s => setStatuses(s))
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
						className='w-60'
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