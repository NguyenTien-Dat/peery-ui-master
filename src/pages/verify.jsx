/* eslint-disable react-hooks/exhaustive-deps */
import SiteLayout from "@/layouts/PageLayout"
import customFetch from "@/lib/customFetch";
import { Button, Link } from "@nextui-org/react";
import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export async function getServerSideProps({ req, res, query }) {
	const user = JSON.parse(getCookie('user', { req, res }))
	customFetch('/user/doVerify', { userId: user.id }, { method: 'POST' }).catch(e => { console.log('A code was already sent.') })

	return {
		props: {
			user
		}
	}
}

export default function Verify({ user }) {
	const { register, handleSubmit, reset } = useForm()
	const [wait, setWait] = useState(false)
	const router = useRouter()

	const lenNaoAeOi = async (form) => {
		setWait(true)

		try {
			await customFetch('/user/verify', undefined, {
				method: 'POST',
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userId: user.id,
					confirmToken: form.code
				})
			})

			const refreshedUser = await customFetch('/admin/userdetail', { userId: user.id }, { cache: 'no-store' })
			setCookie('user', JSON.stringify(refreshedUser))

			toast.success('Your account is now active')
			router.push('/')

		} catch (err) {
			const e = JSON.parse(err.message)

			if (e.errorCode == 403) {
				toast.error('The entered code is invalid')
			} else {
				toast.error('An unknown error has occurred')
			}

			reset()
			setWait(false)
		}
	}

	const resend = async () => {
		setWait(true)

		try {
			await customFetch('/user/doVerify', { userId: user.id }, { method: 'POST' })
		} catch (e) {
			const err = JSON.parse(e.message)
			if (err.errorMessage == 'TOO_MANY_REQUESTS') {
				toast.error('Please wait at least 1 minute!')
			}
		}

		reset()
		setWait(false)
	}

	return (
		<SiteLayout>
			<div className="mx-auto">
				<div className="relative flex min-h-full flex-col justify-center overflow-hidden py-12">
					<div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
						<div className="mx-auto flex w-full max-w-md flex-col space-y-16">
							<div className="flex flex-col items-center justify-center text-center space-y-2">
								<div className="font-semibold text-3xl">
									<p>Verify your account</p>
								</div>
								<div className="flex flex-row text-sm px-6 font-medium text-gray-400">
									<p>Enter the code sent to the email address that you registered with us</p>
								</div>
							</div>
							<div>
								<form onSubmit={handleSubmit(lenNaoAeOi)}>
									<div className="flex flex-col space-y-16">
										<div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
											<div className="w-full h-16">
												<input {...register('code', { required: true })} className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-4xl bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700" type="text" id="verify-code-input" />
											</div>
										</div>
										<div className="flex flex-col space-y-5">
											<div className="flex flex-row items-center justify-center text-center">
												<Button isDisabled={wait} type='submit' className="w-5/6 hover:brightness-110 hover:animate-pulse font-bold py-6 px-6 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50 text-white">Verify</Button>
											</div>
											<div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
												<p>Didn&apos;t recieve code? <Link href='#' isDisabled={wait} className="text-blue-600" onClick={resend}>Resend</Link></p>
											</div>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</SiteLayout>
	)
}