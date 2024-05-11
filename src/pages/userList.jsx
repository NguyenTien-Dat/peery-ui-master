/* eslint-disable react/jsx-key */
import PageTitle from "@/components/PageTitle"
import SiteLayout from "@/layouts/PageLayout"
import customFetch from "@/lib/customFetch"
import { Button, Input, Select, SelectItem } from "@nextui-org/react"
import { getCookie } from "cookies-next"
import NextLink from 'next/link'
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import Link from "next/link"
import { valueInArr } from "@/lib/utils"


export async function getServerSideProps(ctx) {
	// Đây là người dùng nào?
	const user = JSON.parse(getCookie('user', { req: ctx.req, res: ctx.res }))

	const users = await customFetch(`/admin/userlist`, { userId: user.id })
	return {
		props: {
			users,
			loggedIn: user
		}
	}
}

function sttColor(id) {
	switch (id) {
		case 'Terminated':
			return 'text-red-500'
		case 'Unconfirmed':
			return 'text-yellow-500'
		case 'Confirmed':
			return 'text-green-500'
	}
}

function Filter({ col }) {
	let columnFilterValue
	let [roles, setRoles] = useState([])
	let [statuses, setStatuses] = useState([])

	useEffect(() => {
		switch (col.id) {
			case 'role':
				customFetch('/role/list').then(t => setRoles(t))
				break
			case 'status':
				customFetch('/accountStatus/list').then(s => setStatuses(s))
				break
		}
	}, [col])

	switch (col.id) {
		case 'role':
			columnFilterValue = col.getFilterValue()?.map(v => String(v))
			return (
				<Select
						label="Filter by role"
						className='w-48'
						placeholder="Select…"
						onSelectionChange={(selsSet) => {
							const sels = Array.from(selsSet)

							col.setFilterValue((old) => {
								if (sels.length == 0)
									return old
								if (sels.includes('all')) {
									return roles.map(v => v.name)
								} else {
									return sels
								}
							})
						}}
						selectedKeys={columnFilterValue}
						selectionMode='multiple'>
					<SelectItem key='all'>All roles</SelectItem>
					{roles.map(role => <SelectItem key={role.name}>{role.name}</SelectItem>)}
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
		case 'fullName':
			columnFilterValue = col.getFilterValue()
			return (
				<Input label="Filter by name" placeholder="Enter to search…" className="w-48" value={columnFilterValue} onValueChange={col.setFilterValue} />
			)
	}
}

export default function UserList({ users, loggedIn }) {
	const columnHelper = createColumnHelper()
	const [columnFilters, setFilter] = useState()
	const [sorting, setSorting] = useState([
		{
			id: 'id',
			desc: false
		}
	])

	const cols = [
		columnHelper.accessor("id", {
			header: "No."
		}),
		columnHelper.accessor("fullName", {
			header: 'Full name',
			filterFn: 'includesString'
		}),
		columnHelper.accessor("phone", {
			header: 'Phone number'
		}),
		columnHelper.accessor("cicNo", {
			header: "CIC"
		}),
		columnHelper.accessor(u => u.role.name, {
			header: 'Role',
			id: 'role',
			filterFn: valueInArr
		}),
		columnHelper.accessor(u => u.status.name, {
			header: 'Status',
			id: 'status',
			filterFn: valueInArr
		}),
		columnHelper.display({
			id: 'userDetails',
			enableSorting: false,
			cell: ({ row }) => (
				<Button as={NextLink} href={`/userDetails/${row.getValue("id")}`} className="relative py-2 px-6 text-black text-base rounded-[50px] overflow-hidden bg-slate-100 transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-green-500 before:to-green-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-[50px] hover:before:left-0">
					Details
				</Button>
			)
		})
	]

	const table = useReactTable({
		data: users,
		columns: cols,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onColumnFiltersChange: setFilter,
		getFilteredRowModel: getFilteredRowModel(),
		initialState: {
			pagination: {
				pageSize: 5
			}
		},
		state: {
			sorting,
			columnFilters
		}
	})

	return (
		<SiteLayout>
			<div className="flex flex-col gap-5">
				<div className="flex justify-between items-center gap-10">
					<PageTitle title="List of users" />
					{(loggedIn.role.id == 1) &&
						<Button as={Link} href="/createStaff" className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
							<svg className="w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
								<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
							</svg>
							Add a new staff
						</Button>
					}
				</div>

				<div className='flex gap-4 mt-5'>
					<Filter col={table.getColumn('fullName')} />
					<Filter col={table.getColumn('role')} />
					<Filter col={table.getColumn('status')} />
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