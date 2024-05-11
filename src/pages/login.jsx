import PageTitle from "@/components/PageTitle"
import SiteLayout from "@/layouts/PageLayout"
import customFetch from "@/lib/customFetch"

import toast from 'react-hot-toast';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { Button, Input, Link } from "@nextui-org/react"
import { useForm } from "react-hook-form"
import { getCookie, setCookie, deleteCookie, hasCookie } from 'cookies-next'
import { useRouter } from "next/router";
import Lynk from "next/link";


export default function Login() {
	const { register, handleSubmit, formState: { errors } } = useForm()
	const router = useRouter()

	const onFormSubmit = async (data) => {
		const loginData = await customFetch("/user/login", undefined, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				phone: data.phone,
				password: data.password
			})
		})

		if (loginData.hasOwnProperty('errorCode')) {
			switch (loginData.errorCode) {
				case 401:
					return toast.error("Invalid credentials!")
				default:
					return toast.error("Unknown error")
			}
		}

		setCookie('user', JSON.stringify(loginData))
		router.push('/')

		toast.success("Login successful!");
	}

	return (
		<SiteLayout>
			<div className="flex flex-col gap-10 items-center">
				<PageTitle title="Welcome back!" />
				<form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-5 items-center w-96">
					<div className="flex flex-row gap-5 max-h-14 w-full">
						<div className="w-10">
							<FontAwesomeIcon icon="fa-solid fa-mobile" className="p-2" />
						</div>
						<Input
							type="text"
							{...register("phone", { required: true })}
							isInvalid={errors.hasOwnProperty('phone')}
							label="Phone number" />
					</div>
					<div className="flex flex-row gap-5 max-h-14 w-full">
						<div className="w-10">
							<FontAwesomeIcon icon="fa-solid fa-key" className="p-2" />
						</div>
						<Input
							type="password"
							{...register("password", { required: true })}
							isInvalid={errors.hasOwnProperty('password')}
							label="Password" />
					</div>
					<Button color="success" type="submit" variant="shadow" className="max-w-fit">Login</Button>
					<Link as={Lynk} href="/forgotPassword">Forgot your password?</Link>
				</form>
			</div>
		</SiteLayout>
	)
}