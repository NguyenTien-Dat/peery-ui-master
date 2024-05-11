/* eslint-disable react/jsx-key */
import PageTitle from "@/components/PageTitle"
import SiteLayout from "@/layouts/PageLayout"
import PaymentListTable from '@/components/PaymentListTable';

import Link from "next/link"
import { getCookie } from "cookies-next";
import customFetch from "@/lib/customFetch";
import { monetary, monthLabel, round } from "@/lib/utils";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export async function getServerSideProps({ req, res, query }) {
	// Đây là người dùng nào?
	let user = JSON.parse(getCookie('user', { req, res }))

	let params = new URLSearchParams({
		userId: user.id,
		contractId: query.contractId
	})

	let data = await customFetch("/contract/contractdetail", params)

	return {
		props: { contract: data, user }
	}
}

function sttColor(id) {
	switch (id) {
		case 1:
			return 'text-red-500'
		case 3:
			return 'text-yellow-500'
		case 5:
			return 'text-green-500'
	}
}

export default function ContractDetails({ contract, user }) {
	const { onOpen, onClose, onOpenChange, isOpen } = useDisclosure()
	const confirmDiscl = useDisclosure()
	const [confirmChoice, setCfChoice] = useState()
	const router = useRouter()

	const settle = async () => {
		await customFetch('/contract/requestSettle', {
			contractId: contract.id,
			userId: user.id,
		}, {
			method: 'PATCH'
		})

		toast.success('Request for early settlement has been sent')
		router.reload()
	}

	const decideSettle = async () => {
		await customFetch('/contract/settle', {
			contractId: contract.id,
			userId: user.id,
			choice: confirmChoice
		}, {
			method: 'PATCH'
		})

		if (confirmChoice)
			toast.success('This contract has been successfully settled')
		else
			toast.success('The request for early settlement has been declined')

		router.reload()
	}

	return (
		<SiteLayout>
			<PageTitle title={`Contract no. ${contract.id}`} />

			<div className="container mx-auto py-8">
				<div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
					<div className="col-span-12 sm:col-span-12">
						<div className="bg-white shadow rounded-lg p-6">
							{(contract.status.id == 6 && user.role.id == 3) && <div className="flex flex-col bg-gray-100 w-1/2 mx-auto border-4 border-indigo-950 shadow-sm mb-10">
								<div className="bg-red-400 text-white p-5 text-center">
									<h2 className="text-3xl font-bold">Early settlement</h2>
								</div>
								<div className="flex flex-col gap-3 p-5">
									<p>{contract.borrower.fullName}, the borrower, has requested to promptly settle this contract. You have the option to either agree to the settlement or reject the request. If you choose to reject the request, the contract will remain unchanged.</p>
									<p>If you opt for settling the contract at this time, please ensure that you have received the outstanding unpaid amount, which totals <b>{monetary(contract.amountRemaining)}</b>.</p>
								</div>
								<div className="p-4 pt-0 justify-center flex gap-4">
									<Button color="success" onClick={() => { setCfChoice(true); confirmDiscl.onOpen() }} size="lg">Accept</Button>
									<Button color="danger" onClick={() => { setCfChoice(false); confirmDiscl.onOpen() }} size="lg">Reject</Button>
								</div>
							</div>}

							<div className="flex flex-col bg-gray-100 rounded-lg gap-4 p-4 shadow-sm">
								{/* Start borrower information */}
								{(user.role.id == 3 || user.role.id == 1) && (<>
									<div>
										<h6 className="text-blue-900 text-lg">Borrower information</h6>
									</div>

									<div className="flex flex-row space-x-2">
										<div className="w-full flex flex-col bg-gray-100 rounded-lg p-4 shadow-sm border-2">
											<div className="grid grid-cols-3 gap-4">
												<div className="flex-1">
													<span className="text-green-900">Full name</span>
													<div className="mt-2 w-full bg-white rounded-md border-gray-300 text-black px-2 py-1">
														<p className="w-full">{contract.borrower.fullName}</p>
													</div>
												</div>
												<div className="flex-1">
													<span className="text-green-900">Phone number</span>
													<div className="mt-2 w-full bg-white rounded-md border-gray-300 text-black px-2 py-1">
														<p className="w-full"><Link href={`tel:${contract.borrower.phone}`}>{contract.borrower.phone}</Link></p>
													</div>
												</div>
												<div className="flex-1">
													<span className="text-green-900">Date of birth</span>
													<div className="mt-2 w-full bg-white rounded-md border-gray-300 text-black px-2 py-1">
														<p className="w-full">{(new Date(contract.borrower.dob)).toLocaleDateString('vi-VN')}</p>
													</div>
												</div>
												<div className="flex-1">
													<span className="text-green-900">CIC number</span>
													<div className="mt-2 w-full bg-white rounded-md border-gray-300 text-black px-2 py-1">
														<p className="w-full">{contract.borrower.cicNo}</p>
													</div>
												</div>

												<div className="flex-1">
													<span className="text-green-900">Credit score</span>
													<div className="mt-2 w-full bg-white rounded-md border-gray-300 text-black px-2 py-1">
														<p className="w-full">{contract.borrower.creditScore}</p>
													</div>
												</div>

												<div className="flex-1">
													<span className="text-green-900">Email address</span>
													<div className="mt-2 w-full bg-white rounded-md border-gray-300 text-black px-2 py-1">
														<p className="w-full"><Link href={`mailto:${contract.borrower.email}`}>{contract.borrower.email}</Link></p>
													</div>
												</div>
											</div>

											<div className="mt-4">
												<div className="flex-1">
													<span className="text-green-900">Address</span>
													<div className="mt-2 w-full bg-white rounded-md border-gray-300 text-black px-2 py-1">
														<p className="w-full">{contract.borrower.address}</p>
													</div>
												</div>
											</div>
										</div>
									</div>
								</>)}
								{/* End borrower information */}

								{/* Start lender information */}
								{(user.role.id == 2 || user.role.id == 1) && (<>
									<div className="">
										<h6 className="text-blue-900 text-lg">Lender information</h6>
									</div>

									<div className="flex flex-row space-x-2">
										<div className="w-full flex flex-col bg-gray-100 rounded-lg p-4 shadow-sm border-2">
											<div className="grid grid-cols-3 gap-4">
												<div className="flex-1">
													<span className="text-green-900">Full name</span>
													<div className="mt-2 w-full bg-white rounded-md border-gray-300 text-black px-2 py-1">
														<p className="w-full">{contract.lender.fullName}</p>
													</div>
												</div>
												<div className="flex-1">
													<span className="text-green-900">Phone number</span>
													<div className="mt-2 w-full bg-white rounded-md border-gray-300 text-black px-2 py-1">
														<p className="w-full"><Link href={`tel:${contract.lender.phone}`}>{contract.lender.phone}</Link></p>
													</div>
												</div>
												<div className="flex-1">
													<span className="text-green-900">Date of birth</span>
													<div className="mt-2 w-full bg-white rounded-md border-gray-300 text-black px-2 py-1">
														<p className="w-full">{(new Date(contract.lender.dob)).toLocaleDateString('vi-VN')}</p>
													</div>
												</div>
												<div className="flex-1">
													<span className="text-green-900">CIC number</span>
													<div className="mt-2 w-full bg-white rounded-md border-gray-300 text-black px-2 py-1">
														<p className="w-full">{contract.lender.cicNo}</p>
													</div>
												</div>

												<div className="flex-1">
													<span className="text-green-900">Credit score</span>
													<div className="mt-2 w-full bg-white rounded-md border-gray-300 text-black px-2 py-1">
														<p className="w-full">{contract.lender.creditScore}</p>
													</div>
												</div>

												<div className="flex-1">
													<span className="text-green-900">Email address</span>
													<div className="mt-2 w-full bg-white rounded-md border-gray-300 text-black px-2 py-1">
														<p className="w-full"><Link href={`mailto:${contract.lender.email}`}>{contract.lender.email}</Link></p>
													</div>
												</div>
											</div>

											<div className="mt-4">
												<div className="flex-1">
													<span className="text-green-900">Address</span>
													<div className="mt-2 w-full bg-white rounded-md border-gray-300 text-black px-2 py-1">
														<p className="w-full">{contract.lender.address}</p>
													</div>
												</div>
											</div>
										</div>
									</div>
								</>)}
								{/* End lender information */}

								{user.role.id != 1 && <div className="flex flex-col bg-gray-100 rounded-lg shadow-sm">
									{/* Start payment information */}
									<div>
										<h2 className="text-blue-900 text-lg">Payment information</h2>
									</div>
									<div className=" flex flex-row space-x-2">
										<div className="w-full">
											<div className="mt-4 flex flex-col bg-gray-100 rounded-lg p-4 gap-4 shadow-sm border-2">
												{contract[user.role.id == 2 ? 'lender' : 'borrower'].accounts.map(a => (
													<div className="grid grid-cols-3 gap-4 items-center">
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
														<Button as={Link} title="Show VietQR code" target="_blank" href={`https://img.vietqr.io/image/${a.bank.code}-${a.accountNo}-print.png`} variant="flat" color="secondary" isIconOnly><FontAwesomeIcon className="h-5" icon="fa-solid fa-qrcode" /></Button>
													</div>
												))}
											</div>
										</div>
									</div>
									{/* End payment information */}
								</div>}

								{/* Start loan information */}
								<div>
									<h6 className="text-blue-900 text-lg">Loan information</h6>
								</div>
								<div className="flex flex-col">
									<div className="flex flex-col bg-gray-100 rounded-lg p-4 shadow-sm border-2 w-full">
										<div className="grid grid-cols-2">
											<div className="flex flex-col gap-4">
												<div className="flex flex-row gap-8">
													<div className="w-44">
														<span className="text-green-900">Loan amount</span>
													</div>
													<div className="w-44 bg-white rounded-md border-gray-300 text-black px-2 py-1">
														<span>{contract.amountPrincipal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
													</div>
												</div>
												<div className="flex flex-row gap-8">
													<div className="w-44">
														<span className="text-green-900">Interest rate</span>
													</div>
													<div className="w-44 bg-white rounded-md border-gray-300 text-black px-2 py-1">
														<span>{round(contract.apr * 100, 2).toLocaleString('vi-VN') + '%'}</span>
													</div>
												</div>
												<div className="flex flex-row gap-8">
													<div className="w-44">
														<span className="text-green-900">Loan term</span>
													</div>
													<div className="w-44 bg-white rounded-md border-gray-300 text-black px-2 py-1">
														<span>{monthLabel(contract.term.numberOfMonth)}</span>
													</div>
												</div>

												<div className="flex-1 col-span-2">
													<span className="text-green-900">Borrower&apos;s note</span>
													<div className="mt-2 w-full bg-white rounded-md border-gray-300 text-black px-2 py-1">
														{(contract.request.note) ? <p className="w-full whitespace-pre-line">{contract.request.note}</p> : <p className='text-gray-500 italic'>No notes provided</p>}
													</div>
												</div>
											</div>
											<div className="flex flex-col gap-4 items-center">
												<div className="flex flex-row gap-8">
													<div className="w-44">
														<span className="text-green-900">Total due</span>
													</div>
													<div className="w-44 bg-white rounded-md border-gray-300 text-black px-2 py-1">
														<span>{monetary(contract.amountPrincipal + contract.amountInterest)}</span>
													</div>
												</div>
												<div className="flex flex-row gap-8">
													<div className="w-44">
														<span className="text-green-900">Total remaining</span>
													</div>
													<div className="w-44 bg-white rounded-md border-gray-300 text-black px-2 py-1">
														<span>{monetary(contract.amountRemaining)}</span>
													</div>
												</div>
												<div className="flex flex-row gap-8">
													<div className="w-44">
														<span className="text-green-900">Status</span>
													</div>
													<div className="w-44 bg-white rounded-md border-gray-300 px-2 py-1">
														<span className={`font-bold ${sttColor(contract.status.id)}`}>{contract.status.name}</span>
													</div>
												</div>
											</div>
										</div>
									</div>

									<div className="mt-4 w-full p-4">
										<h2 className='text-2xl font-bold text-center m-5'>Loan schedule</h2>
										<PaymentListTable contract={contract} />
									</div>
								</div>
								{/* End loan information */}

								<div className="mt-4 flex justify-center gap-4">
									<div className="m-2">
										<Button
												as={Link}
												href="/contractList"
												className="relative py-2 px-12 text-black text-base rounded-[50px] overflow-hidden bg-slate-100 transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-[50px] hover:before:left-0">
											Back
										</Button>
									</div>

									{![5, 6].includes(contract.status.id) && user.role.id == 2 && <div className="m-2">
										<Button
												onClick={onOpen}
												className="relative py-2 px-12 text-black text-base rounded-[50px] overflow-hidden bg-slate-100 transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-red-500 before:to-red-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-[50px] hover:before:left-0">
											Settle this contract
										</Button>
									</div>}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<Modal onOpenChange={onOpenChange} isOpen={isOpen}>
				<ModalContent>
					{(onClose => <>
						<ModalHeader className="flex">
							Confirm early settlement
						</ModalHeader>
						<ModalBody className="flex flex-col gap-5">
							<p>If you want to settle this contract early, make sure you have paid the remaining amount fully to the lender.</p>
							<p>The remaining amount for this contract is: <b>{monetary(contract.amountRemaining)}</b></p>
							<p>Once they verify that they have received the payment, the contract will be marked as <i>Paid in full</i> and no longer active.</p>
						</ModalBody>
						<ModalFooter>
							<Button color="success" onClick={settle}>I have paid the remaining amount</Button>
							<Button color="primary" variant="bordered" onClick={onClose}>Cancel</Button>
						</ModalFooter>
					</>)}
				</ModalContent>
			</Modal>

			<Modal onOpenChange={confirmDiscl.onOpenChange} isOpen={confirmDiscl.isOpen}>
				<ModalContent>
					{(onClose => <>
						<ModalHeader className="flex">
						</ModalHeader>
						<ModalBody className="flex flex-col gap-5">
							<p>Are you sure you want to {confirmChoice ? 'accept' : 'reject'} this early settlement request? The borrower will be informed.</p>
						</ModalBody>
						<ModalFooter>
							<Button color="primary" onClick={decideSettle}>Yes</Button>
							<Button color="primary" variant="bordered" onClick={onClose}>No</Button>
						</ModalFooter>
					</>)}
				</ModalContent>
			</Modal>
		</SiteLayout>
	)
}