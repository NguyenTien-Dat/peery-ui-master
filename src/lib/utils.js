import { getCookie, getCookies, hasCookie, setCookie } from 'cookies-next'
import customFetch from './customFetch'

export function monetary(amount) {
	return Number(amount).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}

export function monthLabel(monthNum) {
	return `${monthNum} month${(monthNum == 1) ? '' : 's'}`
}

export function round(num, places) {
	return Math.round(Number(num) * Math.pow(10, places)) / Math.pow(10, places)
}

export function fmtDate(dateStr) {
	const date = new Date(dateStr)
	return date.toLocaleDateString('vi-VN')
}

export const valueInArr = (row, columnId, filterValue) => {
	return filterValue.includes(row.getValue(columnId))
}

export const AMOUNT_RANGES = {
	'under5m': [1e6, 5e6],
	'5mTo10m': [5e6, 10e6],
	'over10m': [10e6, 20e6]
}

export async function refreshUser(ctx) {
	const user = JSON.parse(getCookie('user', ctx))
	const resp = await customFetch('/admin/userdetail', { userId: user.id }, { cache: 'no-store' })
	// Write refreshed user data to cookies
	setCookie('user', JSON.stringify(resp), ctx)

	return resp
}