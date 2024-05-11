import PageTitle from "@/components/PageTitle";
import PageLayout from "@/layouts/PageLayout";
import customFetch from "@/lib/customFetch";
import { Button, Input } from "@nextui-org/react";
import { getCookie, hasCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";


export async function getServerSideProps({ req, res, query }) {
	let userId

	if (hasCookie('user', { req, res })) {
		const user = JSON.parse(getCookie('user', { req, res }))
		userId = user.id
	} else {
		const hashedPw = query.resetToken

		userId = await customFetch('/user/checkResetToken', { userId: query.userId, resetToken: hashedPw })
		if (userId == null) {
			return {
				redirect: {
					destination: '/',
					permanent: false
				}
			}
		}
	}

	return {
		props: {
			userId
		}
	}
}


export default function ChangePassword({ userId }) {
	const { register, handleSubmit, formState: { errors } } = useForm()
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	const submit = async (data) => {
		setLoading(true)

		if (data.pw1 != data.pw2) {
			toast.error("Passwords do not match!")
			setLoading(false)
		} else {
			await customFetch('/user/changepassword', undefined, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId, newPassword: data.pw1 })
			})
			toast.success('Your password has been changed!')
			router.push('/')
		}
	}

	return (
		<PageLayout>
			<div className='flex flex-col mx-auto gap-4 w-2/5 items-center'>
				<div className="w-fit mb-4">
					<PageTitle title={`Change your password`} />
				</div>

				<>
					<Input
						className="w-96"
						label="New password"
						labelPlacement="outside"
						placeholder=" "
						{...register('pw1', { required: 'Please enter a valid password', minLength: 8 })}
						type='password'
						isInvalid={errors.pw1 ? true : false}
						errorMessage={errors.pw1?.message} />

					<Input
						className="w-96"
						label="Repeat password"
						labelPlacement="outside"
						placeholder=" "
						{...register('pw2', { required: 'Please enter a valid password', minLength: 8 })}
						type='password'
						isInvalid={errors.pw2 ? true : false}
						errorMessage={errors.pw2?.message} />

					<Button className="w-fit" color="primary" isLoading={loading} onClick={handleSubmit(submit)}>Change password</Button>
				</>
			</div>
		</PageLayout>
	)
}