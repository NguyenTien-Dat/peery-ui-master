/* eslint-disable react-hooks/exhaustive-deps */
import { deleteCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Logout() {
	const router = useRouter()

	useEffect(() => {
		deleteCookie('user')
		router.push('/')
	}, [])

	return <p>Logging out…</p>
}