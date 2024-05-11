import PageTitle from "@/components/PageTitle";
import PageLayout from "@/layouts/PageLayout";
import customFetch from "@/lib/customFetch";
import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function ForgotPassword() {
	const { register, handleSubmit, formState: { errors } } = useForm()
	const [stage, setStage] = useState(1)
	const [loading, setLoading] = useState(false)

	const submit = async (data) => {
		setLoading(true)

		try {
			await customFetch('/user/forgotpassword', undefined, {
				method: 'POST',
				headers: { "Content-Type": 'application/json' },
				body: JSON.stringify(data)
			})

			setStage(2)
		} catch (e) {
			const err = JSON.parse(e.message)
			if (err.errorMessage == 'NX_USER') {
				toast.error('No user with such credentials exists!')
			}
		}

		setLoading(false)
	}

	return (
		<PageLayout>
			<div className='flex flex-col mx-auto gap-4 w-2/5 items-center'>
				<div className="w-fit mb-4">
					<PageTitle title={`Reset your password`} />
				</div>
				{stage == 1 && <>
					<p className="w-96" >Please enter the phone number and email address that you registered with us</p>
					<Input className="w-96" label="Phone number" labelPlacement="outside" placeholder=" " {...register('phone', { required: 'Please enter a valid phone number', pattern: /^\d+$/ })} type='text' isInvalid={errors.phone ? true : false} errorMessage={errors.phone?.message} />
					<Input className="w-96" label="Email address" labelPlacement="outside" placeholder=" " {...register('email', { required: 'Please enter a valid email address' })} type='email' isInvalid={errors.email ? true : false} errorMessage={errors.email?.message} />
					<Button className="w-fit" color="primary" isLoading={loading} onClick={handleSubmit(submit)}>Request password reset</Button>
				</>}
				{stage == 2 && <>
					<p>Your request has been sent.<br />
					Please check your inbox for password reset instructions.</p>
				</>}
			</div>
		</PageLayout>
	)
}