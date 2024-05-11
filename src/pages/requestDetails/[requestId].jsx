/* eslint-disable react/jsx-key */
import PageTitle from "@/components/PageTitle";
import SiteLayout from "@/layouts/PageLayout"
import { getCookie, hasCookie } from "cookies-next";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import NextLink from "next/link";
import { Link } from "@nextui-org/react";
import customFetch from "@/lib/customFetch";
import { monthLabel, round } from "@/lib/utils";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactModal from "react-modal";


export async function getServerSideProps({ req, res, query }) {
	// Đây là người dùng nào?
	let user = JSON.parse(getCookie('user', { req, res }))
	user = await customFetch('/admin/userdetail', { userId: user.id })

	// Lấy danh sách request
	let params = {
		userId: user.id,
		requestId: query.requestId
	}
	let data = await customFetch("/request/requestdetail", params)

	return {
		props: { request: data, user }
	}
}


function ConfirmDeleteModal({ discl, handler }) {
	const { isOpen, onOpen, onOpenChange } = discl

	return (
		<Modal isOpen={isOpen} isDismissable={false} onOpenChange={onOpenChange}>
			<ModalContent>
				{(onClose) => {
					return (
						<>
							<ModalHeader className="flex flex-col gap-1"></ModalHeader>
							<ModalBody className="flex flex-col gap-3">
								<p>Are you sure to cancel this request?</p>
							</ModalBody>
							<ModalFooter>
								<div className="mx-auto flex flex-row gap-4">
									<Button color="success" onClick={handler}>Yes</Button>
									<Button color="danger" onClick={onClose}>No</Button>
								</div>
							</ModalFooter>
						</>
					)
				}}
			</ModalContent>
		</Modal>
	)
}


export default function RequestDetails({ request, user }) {
	const [modalIsOpen, setModalIsOpen] = useState(false)
	const router = useRouter()
	const discl = useDisclosure()

	const acpReqHandler = async () => {
		await customFetch('/request/approverequest', { requestId: request.id, userId: user.id }, { method: 'PATCH' })
		toast.success('This loan request has been approved')
		router.push('/requestList')
	}

	const dclReqHandler = async () => {
		await customFetch('/request/rejectrequest', { requestId: request.id, userId: user.id }, { method: 'PATCH' })
		toast.success('This loan request has been declined')
		router.push('/requestList')
	}

	const delReqHandler = async () => {
		await customFetch('/request/cancelrequest', { requestId: request.id, userId: user.id }, { method: 'PATCH' })
		toast.success('This loan request has been cancelled')
		router.push('/requestList')
	}

	return (
		<SiteLayout>
			<div className="">
				<PageTitle title={`Loan Request by ${request.borrower.fullName}`} />
			</div>

			<div className="container mx-auto mt-10">
				<div className="grid grid-cols-4 sm:grid-cols-12 gap-8 px-4">
					<div className="col-span-12 sm:col-span-12">
						<div className="bg-white shadow rounded-lg p-6">
							{user.role.id != 2 && <div className="mt-4 flex flex-col bg-gray-100 rounded-lg p-4 shadow-sm">
								{/* Borrower information */}
									<div>
										<h2 className="font-bold text-blue-900 text-lg">Borrower information</h2>
									</div>
									<div className="flex flex-row space-x-2">
										<div className="w-full">
											<div className="mt-4 flex flex-col bg-gray-100 rounded-lg p-4 shadow-sm border-2">
												<div className="grid grid-cols-3 gap-4">
													<div className="flex-1">
														<span className="text-green-900">Full name</span>
														<div className="mt-2 w-full bg-white rounded-md border-gray-300 text-black px-2 py-1">
															<p className="w-full">{request.borrower.fullName}</p>
														</div>
													</div>
													<div className="flex-1">
														<span className="text-green-900">Phone number</span>
														<div className="mt-2 w-full bg-white rounded-md border-gray-300 text-black px-2 py-1">
															<p className="w-full"><Link href={`tel:${request.borrower.phone}`}>{request.borrower.phone}</Link></p>
														</div>
													</div>
													<div className="flex-1">
														<span className="text-green-900">Date of birth</span>
														<div className="mt-2 w-full bg-white rounded-md border-gray-300 text-black px-2 py-1">
															<p className="w-full">{(new Date(request.borrower.dob)).toLocaleDateString('vi-VN')}</p>
														</div>
													</div>
													<div className="flex-1">
														<span className="text-green-900">CIC number</span>
														<div className="mt-2 w-full bg-white rounded-md border-gray-300 text-black px-2 py-1">
															<p className="w-full">{request.borrower.cicNo}</p>
														</div>
													</div>

													<div className="flex-1">
														<span className="text-green-900">Credit score</span>
														<div className="mt-2 w-full bg-white rounded-md border-gray-300 text-black px-2 py-1">
															<p className="w-full">{request.borrower.creditScore}</p>
														</div>
													</div>

													<div className="flex-1">
														<span className="text-green-900">Email address</span>
														<div className="mt-2 w-full bg-white rounded-md border-gray-300 text-black px-2 py-1">
															<p className="w-full"><Link href={`mailto:${request.borrower.email}`}>{request.borrower.email}</Link></p>
														</div>
													</div>
												</div>

												<div className="mt-4">
													<div className="flex-1">
														<span className="text-green-900">Address</span>
														<div className="mt-2 w-full bg-white rounded-md border-gray-300 text-black px-2 py-1">
															<p className="w-full">{request.borrower.address}</p>
														</div>
													</div>

													<div className="flex-1">
														<div className="mt-5">
															<button onClick={() => setModalIsOpen(true)} className="relative py-2 px-12 text-black text-base rounded-[50px] overflow-hidden bg-slate-100 transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-blue-500 before:to-blue-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-[50px] hover:before:left-0 js-more-information">
																Assets of {request.borrower.fullName}
															</button>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								{/* End Personal information */}
							</div>}

							<div className="mt-4 flex flex-col bg-gray-100 rounded-lg p-4 shadow-sm">
								{/* Start Loan information */}
								<div>
									<h2 className="font-bold text-blue-900 text-lg">Details of the loan</h2>
								</div>
								<div className="flex flex-row space-x-2">
									<div className="w-full">
										<div className="mt-4 flex flex-col bg-gray-100 rounded-lg p-4 shadow-sm border-2">
											<div className="flex flex-col gap-4">
												<div className="flex flex-row gap-8">
													<div className="w-36">
														<span className="text-green-900">Loan amount</span>
													</div>
													<div className="w-36 bg-white rounded-md border-gray-300 text-black px-2 py-1">
														<span>{request.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
													</div>
												</div>
												<div className="flex flex-row gap-8">
													<div className="w-36">
														<span className="text-green-900">Interest rate</span>
													</div>
													<div className="w-36 bg-white rounded-md border-gray-300 text-black px-2 py-1">
														<span>{round(request.apr * 100, 2).toLocaleString('vi-VN') + '%'}</span>
													</div>
												</div>
												<div className="flex flex-row gap-8">
													<div className="w-36">
														<span className="text-green-900">Loan term</span>
													</div>
													<div className="w-36 bg-white rounded-md border-gray-300 text-black px-2 py-1">
														<span>{monthLabel(request.term.numberOfMonth)}</span>
													</div>
												</div>

												<div className="flex-1 col-span-2">
													<span className="text-green-900">Borrower&apos;s note</span>
													<div className="mt-2 w-full bg-white rounded-md border-gray-300 text-black px-2 py-1">
														{(request.note) ? <p className="w-full whitespace-pre-line">{request.note}</p> : <p className='text-gray-500 italic'>No notes provided</p>}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								{/* End Loan information */}
							</div>

							<div className="mt-4 flex flex-col bg-gray-100 rounded-lg p-4 shadow-sm">
								{/* Start payment information */}
								<div>
									<h2 className="font-bold text-blue-900 text-lg">Payment information</h2>
								</div>
								<div className=" flex flex-row space-x-2">
									<div className="w-full">
										<div className="mt-4 flex flex-col bg-gray-100 rounded-lg p-4 gap-4 shadow-sm border-2">
											{request.borrower.accounts.map(a => (
												<div className="grid grid-cols-3 gap-4">
													<div className="flex-1">
														<span className="text-green-900">Bank name</span>
														<div className="w-full mt-2 bg-white rounded-md border-gray-300 text-black px-2 py-1">
															<p className="w-full">{a.bank.name}</p>
														</div>
													</div>
													<div className="flex-1">
														<span className="text-green-900">Account number</span>
														<div className="w-full mt-2 bg-white rounded-md border-gray-300 text-black px-2 py-1">
															<p className="w-full">{a.accountNo}</p>
														</div>
													</div>
												</div>
											))}
										</div>
									</div>
								</div>
								{/* End payment information */}
							</div>

							<div className="flex flex-col p-4">
								{/* Start Buttons */}
								<div className="mt-4 flex justify-center">
									<div className="m-2">
										<Button as={NextLink} href="/requestList" className="relative py-2 px-12 text-black text-base rounded-[50px] overflow-hidden bg-slate-100 transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-[50px] hover:before:left-0">
											Back
										</Button>
									</div>

									{
										/* Nút chỉ dành cho admin và nếu y/c mới được tạo*/
										(user.role.id == 1 && request.status.id == 1) &&
										<>
											<div className="m-2">
												<Button onClick={acpReqHandler} className="relative py-2 px-12 text-black text-base rounded-[50px] overflow-hidden bg-slate-100 transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-green-500 before:to-green-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-[50px] hover:before:left-0">
													Approve
												</Button>
											</div>

											<div className="m-2">
												<Button onClick={dclReqHandler} className="relative py-2 px-12 text-black text-base rounded-[50px] overflow-hidden bg-slate-100 transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-red-500 before:to-red-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-[50px] hover:before:left-0">
													Decline
												</Button>
											</div>
										</>
									}

									{
										/* Nút dành cho người cho vay */
										(user.role.id == 3) &&
										<>
											<div className="m-2">
												<Button isDisabled={user.status.id != 3} as={NextLink} href={'/reviewContract?' + new URLSearchParams({ requestId: request.id, userId: user.id })} className="relative py-2 px-12 text-black text-base rounded-[50px] overflow-hidden bg-slate-100 transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-green-500 before:to-green-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-[50px] hover:before:left-0">
													Accept this request
												</Button>
											</div>
										</>
									}

									{
										/* Nút dành cho người đi vay (người tạo request) */
										(user.id == request.borrower.id && request.status.id != 3) &&
										<>
											<div className="m-2">
												<Button
													onClick={discl.onOpen}
													className="relative py-2 px-12 text-black text-base rounded-[50px] overflow-hidden bg-slate-100 transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-red-500 before:to-red-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-[50px] hover:before:left-0"
												>
													Delete this request
												</Button>
											</div>
										</>
									}
								</div>
								{/* End Buttons */}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Start Modal*/}
			<ReactModal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className="fixed inset-0 flex items-center justify-center">
				<div class=" bg-gray-100 w-2/6 h-fit pb-10 rounded-lg shadow-2xl">
					<div className="m-4">
						<div class="flex p-2 gap-1">
							<div class="">
								<span class="bg-blue-500 inline-block center w-3 h-3 rounded-full"></span>
							</div>
							<div class="circle">
								<span class="bg-purple-500 inline-block center w-3 h-3 rounded-full"></span>
							</div>
							<div class="circle">
								<span class="bg-pink-500 box inline-block center w-3 h-3 rounded-full"></span>
							</div>
						</div>

						<div class="card__content">
							<h2 className="text-2xl text-center font-bold">Assets of {request.borrower.fullName}</h2>
							<div className="flex flex-row space-x-2">
								<div className="w-full">
									<div className="mt-4 flex flex-col bg-gray-100 rounded-lg p-4 gap-4 shadow-sm border-2">
										{request.borrower.attachments.filter(v => v.type.id == 5).length == 0 && <p className="text-center">This user has not declared any assets</p>}
										{request.borrower.attachments.filter(v => v.type.id == 5).map(a => (
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
					</div>

					<div className="mt-8 flex justify-center">
						<Button onClick={() => setModalIsOpen(false)} className="relative py-2 px-12 text-black text-base rounded-[50px] overflow-hidden bg-slate-100 transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-red-500 before:to-red-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-[50px] hover:before:left-0">
							Back
						</Button>
					</div>
				</div>
			</ReactModal>
			{/* End Modal*/}

			<ConfirmDeleteModal discl={discl} handler={delReqHandler} />
		</SiteLayout>
	)
}