import { Controller, useForm } from "react-hook-form"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Input, Progress, Radio, RadioGroup, input } from "@nextui-org/react"
import { useState } from "react"
import { useRouter } from "next/router"
import { getCookie, setCookie, deleteCookie, hasCookie } from 'cookies-next'
import toast from "react-hot-toast"

import PageTitle from "@/components/PageTitle"
import TheLayout from "@/layouts/PageLayout"
import customFetch from "@/lib/customFetch"
import BankAccountDeclaration from "@/components/BankAccountDeclaration"
import AssetsDeclaration from "@/components/AssetsDeclaration"
import Link from "next/link"


export default function Register() {
	const regForm = useForm()
	const { register, trigger, handleSubmit, formState: { errors }, control } = regForm

	const router = useRouter()

	const onSubmit = async (inputData) => {
		const formData = new FormData()

		formData.append('fullname', inputData.fullName)
		formData.append('cicNo', inputData.cicNumber)
		formData.append('email', inputData.email)
		formData.append('password', inputData.password)
		formData.append('phone', inputData.phone)
		formData.append('dob', inputData.dob)
		formData.append('address', inputData.address)
		formData.append('roleId', 1)

		await customFetch("/admin/addadmin", undefined, {
			method: "POST",
			body: formData
		})

		toast.success("A new staff has been added")
		router.push('/userList')
	}

	const uniqueCheck = async (field, value) => {
		let res = await customFetch('/regCheck', { field, value })
		return !res
	}

	const registerUi = (<>
		<div className="grid grid-cols-2 gap-5 w-2/4">
			<div className="flex flex-row gap-8 w-full">
				<div className="w-10">
					<FontAwesomeIcon icon={`fa-solid fa-user`} className="p-2" />
				</div>
				<Input 
					id='full-name-input' 
					{...register("fullName", {
						required: 'Please enter your name',
						pattern: { 
							value: /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/, 
							message: 'Please enter a valid name!'
						} 
					})} 
					isInvalid={typeof errors.fullName === 'object'} 
					errorMessage={errors.fullName?.message} 
					isClearable 
					variant="underlined" 
					placeholder="Full name" />
			</div>

			<div className="flex flex-row gap-8 w-full">
				<div className="w-10">
					<FontAwesomeIcon icon={`fa-solid fa-calendar-day`} className="p-2" />
				</div>
				<Input id='dob-input' type="date" {...register("dob", { required: true })} isClearable variant="underlined" />
			</div>

			<div className="flex flex-row gap-8 w-full">
				<div className="w-10">
					<FontAwesomeIcon icon={'fa-solid fa-id-card'} className="p-2" />
				</div>
				<Input
					id='cic-input'
					type="text"
					{...register("cicNumber", {
						required: 'Please enter your CIC number',
						maxLength: {
							value: 12,
							message: 'Must be no more than 12 digits!'
						},
						validate: async val => (await uniqueCheck('cicNo', val)) || 'This CIC has already been registered!'
					})}
					isInvalid={typeof errors.cicNumber === 'object'}
					errorMessage={errors.cicNumber?.message}
					isClearable
					variant="underlined"
					description="12 digits maximum"
					placeholder="Citizen Identity Card number" />
			</div>

			<div className="flex flex-row gap-8 w-full">
				<div className="w-10">
					<FontAwesomeIcon icon={`fa-solid fa-phone`} className="p-2" />
				</div>
				<Input
					id='phone-input'
					type="text"
					{...register("phone", {
						required: 'Please enter your phone number',
						pattern: {
							value: /^\d+$/,
							message: 'Please enter a valid phone number'
						},
						validate: async val => (await uniqueCheck('phone', val)) || 'Phone number has already been registered!'
					})}
					isInvalid={typeof errors.phone === 'object'}
					errorMessage={errors.phone?.message}
					isClearable
					variant="underlined"
					placeholder="Phone number" />
			</div>

			<div className="flex flex-row gap-8 w-full">
				<div className="w-10">
					<FontAwesomeIcon icon={`fa-solid fa-envelope`} className="p-2" />
				</div>
				<Input
					id='email-input'
					type="email"
					{...register("email", {
						required: 'Please enter your email address',
						pattern: {
							value: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
							message: 'Please enter a valid email!'
						},
						validate: async val => (await uniqueCheck('email', val)) || 'This email has already been registered!'
					})}
					isInvalid={typeof errors.email === 'object'}
					errorMessage={errors.email?.message}
					isClearable
					variant="underlined"
					placeholder="Email address" />
			</div>

			<div className="flex flex-row gap-8 w-full">
				<div className="w-10">
					<FontAwesomeIcon icon={`fa-solid fa-key`} className="p-2" />
				</div>
				<Input
					id='password-input'
					type="password"
					{...register("password", { minLength: 8, required: 'Please enter a password' })}
					isInvalid={typeof errors.password === 'object'}
					errorMessage={errors.password?.message}
					isClearable
					variant="underlined"
					placeholder="Password"
					description="8 characters minimum" />
			</div>

			<div className="flex flex-row gap-8 w-full">
				<div className="w-10">
					<FontAwesomeIcon icon="fa-solid fa-location-dot" className="p-2" />
				</div>
				<Input id='address-input' type="text" {...register("address", { required: true })} isClearable variant="underlined" placeholder="Address" />
			</div>

			<div className="flex flex-row gap-8 w-full">
				{/* empty placeholder */}
			</div>
		</div>

		<div className="flex gap-4">
			<Button color="primary" variant="bordered" type='button' as={Link} href='/userList' className="mt-8 max-w-fit">Back</Button>
			<Button color="success" variant="shadow" type='submit' className="mt-8 max-w-fit">Submit</Button>
		</div>
	</>)

	return (
		<TheLayout>
			<div className="flex flex-col gap-10 items-center">
				<PageTitle title="Add a new staff" />
				<form method="POST" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 items-center w-full">
					{registerUi}
				</form>
			</div>
		</TheLayout>
	)
}