/* eslint-disable react/jsx-key */
import SiteLayout from "@/layouts/PageLayout";
import Link from "next/link"

import PageTitle from "@/components/PageTitle";
import customFetch from "@/lib/customFetch";
import { getCookie } from "cookies-next";
import { Button, Image } from "@nextui-org/react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";


export async function getServerSideProps({ req, res, query }) {
	const userId = query.userId
	const user = await customFetch('/admin/userdetail', { userId })

	let loginUsr = JSON.parse(getCookie('user', { req, res }))

	return {
		props: {
			user,
			loginUsr
		}
	}
}

function sttColor(id) {
	switch (id) {
		case 1:
			return 'text-red-500'
		case 2:
			return 'text-yellow-500'
		case 3:
			return 'text-green-500'
	}
}

export default function UserDetails({ user, loginUsr }) {
	const router = useRouter()
	const { register, handleSubmit, control, watch, setValue, setError, trigger, getValues, clearErrors, formState: { errors }} = useForm()

	const acpHandler = async () => {
		const result = await trigger("creditScore", { shouldFocus: true })
		if (!result) {
			toast.error("Please enter a valid credit score for this user!")
			return
		}

		await customFetch('/admin/confirmaccount', { userId: user.id, creditScore: getValues('creditScore') }, {
			method: 'PATCH'
		})
		toast.success('This user has been approved')
		router.push('/userList')
	}

	const rejHandler = async () => {
		const result = await trigger("reason", { shouldFocus: true })
		if (!result) {
			toast.error("Please specify the reason of rejecting this user")
			return
		}

		await customFetch('/admin/rejectaccount', { userId: user.id, reason: getValues('reason') }, {
			method: 'PATCH'
		})
		toast.error('This account has been rejected')
		router.push('/userList')
	}

	return (
		<SiteLayout>
			<div>
				<PageTitle title={`Details of user ` + user.fullName} />
			</div>

			<div className="container mx-auto mt-10">
				<div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
					<div className="col-span-12 sm:col-span-12">
						<div className="bg-white shadow rounded-lg p-6">
							<h2 className="text-center text-lg font-bold">Personal information</h2>
							<div className="my-4 flex flex-col bg-gray-100 rounded-lg p-4 shadow-sm">
								<div className="mt-4 flex flex-row space-x-2">
									<div className="flex-1 px-5">
										<span className="text-blue-900">Full name</span>
										<div className="w-full bg-white rounded-md border-gray-300 text-black mt-2 px-2 py-1">
											<span>{user.fullName}</span>
										</div>
									</div>

									<div className="flex-1 px-5">
										<span className="text-blue-900">Date of birth</span>
										<div className="w-full bg-white rounded-md border-gray-300 text-black mt-2 px-2 py-1">
											<span>{(new Date(user.dob)).toLocaleDateString('vi-VN')}</span>
										</div>
									</div>
									<div className="flex-1 px-5">
										<span className="text-blue-900">Citizen Identity Card number</span>
										<div className="w-full bg-white rounded-md border-gray-300 text-black mt-2 px-2 py-1">
											<span>{user.cicNo}</span>
										</div>
									</div>
								</div>

								<div className="mt-4 flex flex-row space-x-2">
									<div className="flex-1 px-5">
										<span className="text-blue-900">Email address</span>
										<div className="w-full bg-white rounded-md border-gray-300 text-black mt-2 px-2 py-1">
											<span>{user.email}</span>
										</div>
									</div>

									<div className="flex-1 px-5">
										<span className="text-blue-900">Phone number</span>
										<div className="w-full bg-white rounded-md border-gray-300 text-black mt-2 px-2 py-1">
											<span>{user.phone}</span>
										</div>
									</div>

									<div className="flex-1 px-5">
										<span className="text-blue-900">Role</span>
										<div className="w-full bg-white rounded-md border-gray-300 text-black mt-2 px-2 py-1">
											<span>{user.role.name}</span>
										</div>
									</div>
								</div>

								<div className="mt-4 flex flex-row space-x-2">
									<div className="flex-1 px-5">
										<span className="text-blue-900">Address</span>
										<div className="w-full bg-white rounded-md border-gray-300 text-black mt-2 px-2 py-1">
											<span>{user.address}</span>
										</div>
									</div>
								</div>

								<div className="mt-4 flex space-x-2">
									<div className="flex flex-row gap-3 px-5 items-center">
										<span className="text-blue-900">Status:</span>
										<span className={`text-lg ${sttColor(user.status.id)}`}>{user.status.name}</span>
									</div>
								</div>
							</div>

							{user.role.id != 1 && <><h2 className="text-center text-lg font-bold">Owned assets</h2>
							<div className="my-4 flex flex-col bg-gray-100 rounded-lg p-4 shadow-sm">
								<div className="flex flex-row space-x-2">
									<div className="w-full">
										<div className="grid grid-cols-2 gap-4 bg-gray-100 rounded-lg p-4">
											{user.attachments.filter(v => v.type.id == 5).length == 0 && <p className="text-center col-span-2">This user has not declared any assets</p>}
											{user.attachments.filter(v => v.type.id == 5).map(a => (
												<div className="flex flex-row p-2 gap-4 justify-items-center bg-gray-300 rounded-lg w-full">
													<span className="flex-auto">{a.description}</span>
													<div className="self-end mr-5">
														<Link className="w-fit h-fit" title={`View this document`} href={`${process.env.NEXT_PUBLIC_API_PREFIX}/user/attachment/getattachment?${new URLSearchParams({ uuid: a.uuid })}`} target="_blank" onClick={null}><FontAwesomeIcon className="h-5" icon='fa-solid fa-eye' /></Link>
													</div>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>

							<h2 className="text-center text-lg font-bold">Identification images</h2>
							<div className="my-4 flex flex-row justify-center gap-10 bg-gray-100 rounded-lg p-4 shadow-sm">
								<div className="flex flex-col mt-4">
									<span className="text-center text-blue-900">Citizen Identity Card</span>

									<div className="w-full mt-4 grid grid-rows-2 gap-4">
										<div className="">
											<Image alt="CIC front" src={`${process.env.NEXT_PUBLIC_API_PREFIX}/user/attachment/getattachment?${new URLSearchParams({ uuid: user.attachments.find(v => v.type.id == 2)?.uuid })}`} className="max-w-full max-h-72 object-contain" />
										</div>

										<div className="">
											<Image alt="CIC back" src={`${process.env.NEXT_PUBLIC_API_PREFIX}/user/attachment/getattachment?${new URLSearchParams({ uuid: user.attachments.find(v => v.type.id == 3)?.uuid })}`} className="max-w-full max-h-72 object-contain" />
										</div>
									</div>
								</div>

								<div className="flex flex-col mt-4">
									<span className="text-blue-900 text-center">Personal photo</span>
									<div className="w-full mt-4">
										<Image alt="Personal photo" src={`${process.env.NEXT_PUBLIC_API_PREFIX}/user/attachment/getattachment?${new URLSearchParams({ uuid: user.attachments.find(v => v.type.id == 1)?.uuid })}`} className="max-w-full max-h-72 object-contain" />
									</div>
								</div>
							</div></>}

							<div className="mt-20 flex flex-col bg-gray-100 rounded-lg p-4 border-solid border-8 shadow-sm">
								<div className="flex px-5 flex-col">
									<span className="text-blue-900">Note</span>
									<textarea {...register('reason', { required: true })} placeholder="Admin can make notes about the reject reason here" className="w-full bg-white rounded-md border-gray-300 text-black mt-2 px-2 py-1" />
								</div>

								{user.role.id != 1 && <div className="flex flex-col px-5 mt-4">
									<span className="text-blue-900">Credit score (between 0 and 99)</span>
									<input {...register('creditScore', { required: true, min: 0, max: 99 })} type="number" min={0} max={99} className="w-24 bg-white rounded-md border-gray-300 text-black mt-2 px-2 py-1" />
									<p className="mt-3 italic text-red-400 text-base">Please consider relevant factors thoroughly before deciding user&apos;s credit score!<br />
										&bull; Credit score is the sole factor determining interest rate on loan contracts.<br />
										&bull; Review the user&apos;s financial information in depth to assess the risk of lending money to them.<br />
										&bull; The higher the credit score, the lower the interest rate and vice versa.
									</p>
								</div>}

								<div className="flex justify-center mt-4">
									<div className="m-2">
										<Button as={Link} href="/userList" className="relative py-2 px-12 text-black text-base rounded-[50px] overflow-hidden bg-slate-100 transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-blue-500 before:to-blue-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-[50px] hover:before:left-0">
											Back
										</Button>
									</div>

									{user.status.id != 4 && <>
										{user.role.id != 1 && <div className="m-2">
											<Button
												onClick={acpHandler}
												className="relative py-2 px-12 text-black text-base rounded-[50px] overflow-hidden bg-slate-100 transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-green-500 before:to-green-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-[50px] hover:before:left-0"
											>
												{user.status.id != 3 ? 'Approve' : 'Update'}
											</Button>
										</div>}

										{loginUsr.id != user.id && <div className="m-2">
											<Button
												onClick={rejHandler}
												className="relative py-2 px-12 text-black text-base rounded-[50px] overflow-hidden bg-slate-100 transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-red-500 before:to-red-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-[50px] hover:before:left-0"
											>
												{user.status.id != 3 ? 'Reject' : 'Terminate'}
											</Button>
										</div>}
									</>}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</SiteLayout>
	);
}