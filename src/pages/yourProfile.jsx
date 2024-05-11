import AssetsEditScreen from "@/components/AssetsEditScreen"
import IdEditScreen from "@/components/IdEditScreen"
import PageTitle from "@/components/PageTitle"
import SiteLayout from "@/layouts/PageLayout"
import customFetch from "@/lib/customFetch"
import { Avatar, Button, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react"
import { getCookie, setCookie } from "cookies-next"
import { useRouter } from "next/router"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

export async function getServerSideProps({ req, res }) {
	const user = JSON.parse(getCookie('user', { req, res }))

	// Write refreshed user data to cookies
	const resp = await customFetch('/admin/userdetail', { userId: user.id }, { cache: 'no-store' })
	setCookie('user', JSON.stringify(resp), { req, res })

	return {
		props: {
			user: resp
		}
	}
}

function sttColor(id) {
	switch (id) {
		case 3:		// Confirmed
			return 'success'
		case 2:		// Unconfirmed
			return 'warning'
	}
}

function ConfirmModal({ isOpen, onOpenChange, doSubmit }) {
	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
						</ModalHeader>
						<ModalBody>
							<p>Are you sure to update your profile? Your account will stay in <i>Unconfirmed</i> state until the new information is approved by us.</p>
						</ModalBody>
						<ModalFooter className="mx-auto">
							<Button color="success" onClick={doSubmit}>Yes</Button>
							<Button color="primary" onClick={onClose}>No</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}

const SCREENS = ['basicInfo', 'id', 'assets']

export default function YourProfile({ user }) {
	const { onOpen, isOpen, onOpenChange } = useDisclosure()
	const router = useRouter()
	const [screen, setScreen] = useState(router.query.screen ?? SCREENS[0])

	const { register, trigger, handleSubmit, formState: { errors }, control } = useForm({
		defaultValues: {
			fullName: user.fullName,
			phone: user.phone,
			address: user.address,
			email: user.email
		}
	})

	const update = async (data) => {
		await customFetch('/user/userprofile', { userId: user.id }, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		})

		toast.success('Your profile has been updated')
		router.reload()
	}

	const personalPhotoUuid = user.attachments.find(a => a.type.id == 1)?.uuid

	const uniqueCheck = async (field, value) => {
		if (user[field] != value) {
			let res = await customFetch('/regCheck', { field, value })
			return !res
		}

		return true
	}

	const clickHandler = async () => {
		await trigger()

		if (errors.email) {
			toast.error("Email has already been taken");
		}
		if (errors.phone) {
			toast.error("Phone number has already been taken");
		}

		if (Object.keys(errors) == 0)
			onOpen()
	}

	return (
		<SiteLayout>
			<div className="">
				<PageTitle title="Your profile" />
			</div>
			<div className="bg-gray-100 mt-10">
				<div className="container mx-auto py-8">
					<div className="grid grid-cols-4 sm:grid-cols-12 gap-8 px-8">
						<div className="col-span-4 sm:col-span-3">
							<div className="bg-white shadow rounded-lg p-8">
								<div className="flex flex-col gap-4 items-center">
									<Avatar radius="lg" isBordered src={`${process.env.NEXT_PUBLIC_API_PREFIX}/user/attachment/getattachment?${new URLSearchParams({ uuid: personalPhotoUuid })}`} className="w-36 h-36 text-large" />
									<div className="mt-2">
										<h1 className="text-xl font-bold">{user.fullName}</h1>
										<p className="text-gray-600 text-center">{user.phone}</p>
									</div>
									<div className="mt-2 flex flex-col gap-4">
										<div className="flex flex-row gap-6">
											<span className="block w-fit self-center bg-slate-100 px-4 py-2 active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#F44336,-0.5rem_-0.5rem_#00BCD4] transition">
												<span className="mt-2 text-base leading-normal">{user.role.name}</span>
											</span>
											<div className="rounded-full border-2 border-emerald-300 p-2 px-3 shadow-2xl">
												<span>{user.status.id == 3 ? user.creditScore : '—'}</span>
											</div>
										</div>
										<div className="flex w-full justify-center">
											<Button className="cursor-default" color={sttColor(user.status.id)} variant="bordered">{user.status.name}</Button>
										</div>
									</div>
								</div>

								<hr className="my-6 border-t border-gray-300"></hr>

								<div className="flex flex-col">
									<span className="text-gray-600 uppercase font-bold tracking-wider mb-2">Manage documents</span>
									<ul className="gap-2 flex flex-col">
										<li><Link isDisabled={(screen == 'basicInfo')} href="#" onClick={() => setScreen('basicInfo')}>Basic information</Link></li>
										{(user.role.id != 1) && <>
											<li><Link isDisabled={(screen == 'id')} href="#" onClick={() => setScreen('id')}>Personal ID</Link></li>
											<li><Link isDisabled={(screen == 'assets')} href="#" onClick={() => setScreen('assets')}>Assets</Link></li>
										</>}
									</ul>

									<span className="text-gray-600 uppercase font-bold tracking-wider mt-4 mb-2">Account</span>
									<ul className="gap-2 flex flex-col">
										<li><Link href="/changePassword">Change password</Link></li>
									</ul>
								</div>
							</div>
						</div>

						<div className="col-span-4 sm:col-span-9">
							<div className="bg-white shadow rounded-lg p-6">
								{screen == SCREENS[0] && <>
									<div className="flex flex-col bg-gray-100 rounded-lg p-4 gap-4 shadow-sm">
										<div className="flex flex-row gap-8">
											<div className="flex flex-col gap-2 w-full">
												<span className="text-blue-900">Full name</span>
												<input className="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1" {...register("fullName", { required: true })} type="text"></input>
											</div>
											<div className="flex flex-col gap-2 w-full">
												<span className="text-blue-900">Phone number</span>
												<input className="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1" {...register("phone", { required: true, validate: async val => (await uniqueCheck('phone', val)) || 'Phone number has already been registered!' })} type="text" />
											</div>
										</div>

										<div className="flex flex-row gap-8">
											<div className="flex flex-col gap-2 w-full">
												<span className="text-blue-900">CIC number</span>
												<input disabled value={user.cicNo} className="w-full bg-gray-300 rounded-md text-black px-2 py-1" />
											</div>
											<div className="flex flex-col gap-2 w-full">
												<span className="text-blue-900">Date of birth</span>
												<input type="date" value={user.dob.split('T')[0]} disabled className="w-full bg-gray-300 rounded-md text-black px-2 py-1" />
											</div>
										</div>

										<div className="flex flex-col gap-2 w-full">
											<span className="text-blue-900">Address</span>
											<textarea {...register('address', { required: true })} className="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1" id="address"></textarea>
										</div>

										<div className="flex flex-col gap-2 w-full">
											<span className="text-blue-900">Email</span>
											<input {...register('email', { required: true, validate: async val => (await uniqueCheck('email', val)) || 'This email has already been registered!' })} className="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1" type="email" />
										</div>
									</div>

									<div className="mt-4 flex justify-end">
										<Button onClick={clickHandler} className="relative py-2 px-12 text-black text-base rounded-[50px] overflow-hidden bg-white transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-blue-500 before:to-blue-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-[50px] hover:before:left-0">
											Save Changes
										</Button>
									</div>
								</>}

								{screen == SCREENS[1] && <IdEditScreen user={user} />}

								{screen == SCREENS[2] && <AssetsEditScreen user={user} />}
							</div>
						</div>
					</div>
				</div>
			</div>

			<ConfirmModal isOpen={isOpen} onOpenChange={onOpenChange} doSubmit={handleSubmit(update)} />
		</SiteLayout>
	)
}