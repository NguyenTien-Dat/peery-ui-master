import { NextResponse } from 'next/server'
import customFetch from './lib/customFetch';

const startsWithAnyPrefix = (str, prefixes) => prefixes.some(prefix => str.startsWith(prefix));

export async function middleware(request) {
	const path = request.nextUrl.pathname
	const base = request.nextUrl.origin
	const toHome = NextResponse.redirect(new URL(base))
	const response = NextResponse.next()

	console.log('Accessing:', path)

	const requireAuth = [
		'/requestList',
		'/requestDetails',
		'/createLoanRequest',
		'/contractList',
		'/contractDetails'
	]

	if (startsWithAnyPrefix(path, requireAuth)) {
		// Check if user is self-verified
		const loggedIn = request.cookies.has('user')

		if (loggedIn) {
			// const oldUserData = JSON.parse(request.cookies.get('user').value)
			// const userId = oldUserData.id

			// // Fetch latest user data
			// const user = await customFetch('/admin/userdetail', { userId })
			// response.cookies.set('user', JSON.stringify(user))

			const user = JSON.parse(request.cookies.get('user').value)

			if (user.status.id == 1) {
				return NextResponse.redirect(new URL('/verify', base))
			} else if (user.status.id == 4) {
				return NextResponse.redirect(new URL('/logout', base))
			}
		} else {
			return toHome
		}
	}

	return response
}

export const config = {
}