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


export default function Register() {
	const regForm = useForm()
	const { register, trigger, handleSubmit, formState: { errors }, control } = regForm

	const [stage, setStage] = useState(1);
    const [accounts, setAccounts] = useState([])

	const addAcc = (bank, bankNumber) => {
		const newBank = { bank: bank, accountNo: bankNumber }
		setAccounts([...accounts, newBank])
	}

	const deleteAcc = (acc) => {
		setAccounts(accounts.filter((v) => acc != v))
	}

	const router = useRouter()

	const onSubmit = async (inputData) => {
		setStage(5)

		const formData = new FormData()

		formData.append('fullname', inputData.fullName)
		formData.append('cicNo', inputData.cicNumber)
		formData.append('email', inputData.email)
		formData.append('password', inputData.password)
		formData.append('phone', inputData.phone)
		formData.append('dob', inputData.dob)
		formData.append('address', inputData.address)
		formData.append('roleId', inputData.role)

		formData.append('frontImage', inputData.cicFrontImage[0])
		formData.append('backImage', inputData.cicBackImage[0])
		formData.append('personalImage', inputData.personImage[0])

		for (let i = 0; i < inputData.assets.length; ++i) {
			formData.append(`assets[${i}].attachment`, inputData.assets[i].attachment[0])
			formData.append(`assets[${i}].description`, inputData.assets[i].description)
		}

		formData.append('accounts', JSON.stringify(accounts.map(a => { return { bankId: a.bank.id, ...a } })))

		const regResult = await customFetch("/user/registration", undefined, {
			method: "POST",
			body: formData
		})

		if (! regResult.errorCode) {
			// Dang ky xong
			setCookie('user', JSON.stringify(regResult))
			router.push('/requestList')

			toast.success("Registered!")
		} else {
			setStage(4)
			toast.error(regResult.errorMessage)
		}
	}

	const onError = (errors) => {
		if (errors.assets) {
			toast.error("Please declare at least one document!")
		}
	}

	const stageOneOnClick = async () => {
		const fields = ['fullName', 'email', 'password', 'phone', 'address', 'role', 'dob', 'cicNumber']
		const validateResult = await trigger(fields)

		if (validateResult) {
			setStage(2)
		}
	}

	const uniqueCheck = async (field, value) => {
		let res = await customFetch('/regCheck', { field, value })
		return !res
	}

	const stageTwoOnClick = async () => {
		const fields = ['cicFrontImage', 'cicBackImage', 'personImage']
		const validateResult = await trigger(fields)

		if (validateResult) {
			setStage(3)
		} else {
			for (const k of Object.keys(errors)) {
				if (errors[k].type == 'required') {
					toast.error('One or more photos are missing. Please attach them.')
					break
				}
			}
		}
	}

	const stageThreeOnClick = async () => {
		if (accounts.length == 0) {
			toast.error("Please declare your bank accounts!")
			return
		}

		setStage(4)
	}

	const stageOneUI = (stage == 1 && <>
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
				<Input id='dob-input' type="date" {...register("dob", { required: 'Please enter your date of birth' })} isInvalid={typeof errors.dob === 'object'} errorMessage={errors.dob?.message} isClearable variant="underlined" />
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
							message: 'Must be no more than 12 digits!',
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
					placeholder="Phone number"
					description="We will use this number to contact you" />
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
				<Input
					id='address-input'
					type="text"
					{...register("address", { required: 'Please enter your place of residence' })}
					isInvalid={typeof errors.address === 'object'}
					errorMessage={errors.address?.message}
					isClearable
					variant="underlined"
					placeholder="Address"
					description="Your residential address" />
			</div>

			<div className="flex flex-row gap-8 w-full">
				{/* empty placeholder */}
			</div>

			<div className="flex flex-row gap-8 w-full">
				<div className="w-10">
				</div>
				<div className="flex gap-8 w-full">
					<Controller
						control={control}
						name="role"
						rules={{
							required: true
						}}
						render={({ field: { onChange, value } }) => (
							<RadioGroup value={value} onValueChange={onChange} label="I want to register as a:" isInvalid={errors.hasOwnProperty('role')} orientation="horizontal">
								<Radio id='borrower-radio' value='2'>Borrower</Radio>
								<Radio id='lender-radio' value='3'>Lender</Radio>
							</RadioGroup>
						)}
					/>
				</div>
			</div>
		</div>

		<Button color="primary" variant="shadow" type='button' onClick={stageOneOnClick} className="max-w-fit">Next</Button>
	</>)

	const imageRegOps = {
		required: true,
		validate: {
			notTooBig: v => {
				return v[0].size <= 10485760
			}
		}
	}
	const imgSizeError = <span className="text-red-500 italic font-light block mt-2">Image must not be larger than 10 MB!</span>
	const stageTwoUI = (stage == 2 && <>
		<div className="justify-center max-w-2xl rounded-lg shadow-xl bg-gray-50 ">
			<div>
				<div className="flex flex-col w-full">
					<div className="m-4">
						<p>You are required to submit photos of your documents for verification.</p>
						<p className="text-red-500">Your photos must be clear. All information and your face must not be obscured.</p>
					</div>

					<div className="m-4 grid grid-cols-2 gap-4">
						<div>
							<p className="inline-block mb-2 text-gray-500">Citizen Identity Card, front</p>
							<Input type="file" multiple={false} className="w-full" id="cic-front-image" accept="image/jpeg,image/png,image/webp"{...register('cicFrontImage', imageRegOps)} />
							{errors.cicFrontImage?.type == "notTooBig" && imgSizeError}
						</div>

						<div>
							<p className="inline-block mb-2 text-gray-500">Citizen Identity Card, back</p>
							<Input type="file" multiple={false} accept="image/jpeg,image/png,image/webp" className="w-full" id='cic-back-image' {...register('cicBackImage', imageRegOps)} />
							{errors.cicBackImage?.type == "notTooBig" && imgSizeError}
						</div>
					</div>

					<div className="m-4">
						<p className='text-gray-500 inline-block mb-2'>Photo of you holding your CIC</p>
						<Input type="file" multiple={false} accept="image/jpeg,image/png,image/webp" className="w-2/4" id='person-image' {...register('personImage', imageRegOps)} />
						{errors.personImage?.type == "notTooBig" && imgSizeError}
					</div>
				</div>
			</div>
		</div>

		<div className="flex flex-row gap-3 mt-8">
			<Button variant="shadow" type='button' onClick={() => setStage(1)} className="max-w-fit">Back</Button>
			<Button color="primary" type='button' variant="shadow" onClick={stageTwoOnClick} className="max-w-fit">Next</Button>
		</div>
	</>)

	const stageThreeUI = (stage == 3 && <>
		<BankAccountDeclaration accounts={accounts} addAcc={addAcc} delAcc={deleteAcc} />

		<div className="flex flex-row gap-3">
			<Button variant="shadow" type='button' onClick={() => setStage(2)} className="max-w-fit">Back</Button>
			<Button color="primary" type='button' variant="shadow" onClick={stageThreeOnClick} className="max-w-fit">Next</Button>
		</div>
	</>)

	const stageFourUI = (stage == 4 && <>
		<AssetsDeclaration regForm={regForm} />

		<div className="flex flex-row gap-3">
			<Button variant="shadow" type='button' onClick={() => setStage(3)} className="max-w-fit">Back</Button>
			<Button color="success" variant="shadow" type='submit' className="max-w-fit">Register</Button>
		</div>
	</>)

	const pleaseWaitUI = (stage == 5 && <>
		<p>Please wait. Registering your account…</p>
		<div className="w-96">
			<Progress isIndeterminate />
		</div>
	</>)

	return (
		<TheLayout>
			<div className="flex flex-col gap-10 items-center">
				<PageTitle title="Join our platform now" />
				<form method="POST" onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col gap-5 items-center w-full">
					{stageOneUI}
					{stageTwoUI}
					{stageThreeUI}
					{stageFourUI}
					{pleaseWaitUI}
				</form>
			</div>
		</TheLayout>
	)
}