/* eslint-disable react/jsx-key */
import PageTitle from "@/components/PageTitle"
import SiteLayout from "@/layouts/PageLayout"
import customFetch from "@/lib/customFetch"
import { round, monthLabel, monetary } from "@/lib/utils"
import { Button, useDisclosure } from "@nextui-org/react"
import { getCookie } from "cookies-next"
import toast from "react-hot-toast"
import Link from "next/link"
import { useRouter } from "next/router"
import CreateContractConfirmationModal from "@/components/CreateContractConfirmationModal"
import { useState } from "react"

export async function getServerSideProps({ req, res, query }) {
	const user = JSON.parse(getCookie('user', { req, res }))

	const request = await customFetch('/request/requestdetail', { userId: user.id, requestId: query.requestId	})
	const calculated = await customFetch('/request/preparerequest', { userId: request.borrower.id, amount: request.amount, termId: request.term.id })

	return {
		props: {
			user,
			request,
			calculated
		}
	}
}

export default function PrepareContract({ user, request, calculated }) {
	const router = useRouter()
	const discl = useDisclosure();
	const [submitting, setSubmitting] = useState(false)

	const createContrHandler = async () => {
		setSubmitting(true)

		let contr = await customFetch('/request/settlerequest', {
			userId: user.id,
			requestId: request.id
		}, {
			method: 'POST',
		})

		discl.onClose()

		toast.success('A contract has been successfully created')
		router.push('/contractDetails/' + contr.id)
	}

	return (
		<SiteLayout>
			<div className="flex flex-col gap-10">
				<PageTitle title="Prepare to create a contract" />

				<div className="container bg-white shadow rounded-lg p-6 mx-auto">
					<div className="flex flex-col bg-gray-100 rounded-lg p-4 shadow-sm">
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
									</div>
								</div>
							</div>
						</div>
						{/* End Personal information */}
					</div>

					<div className="mt-4 flex flex-col bg-gray-100 rounded-lg p-4 shadow-sm">
						{/* Start Loan information */}
						<div>
							<h2 className="font-bold text-blue-900 text-lg">Details of the loan</h2>
						</div>
						<div className="flex flex-row space-x-2">
							<div className="w-full">
								<div className="mt-4 grid grid-cols-2 bg-gray-100 rounded-lg p-4 shadow-sm border-2">
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
									<div className="flex flex-col gap-4">
										<div className="flex flex-row gap-8">
											<div className="w-36">
												<span className="text-green-900">Monthly due</span>
											</div>
											<div className="w-36 bg-white rounded-md border-gray-300 text-black px-2 py-1">
												<span>{monetary(calculated.monthlyDue)}</span>
											</div>
										</div>
										<div className="flex flex-row gap-8">
											<div className="w-36">
												<span className="text-green-900">Total due</span>
											</div>
											<div className="w-36 bg-white rounded-md border-gray-300 text-black px-2 py-1">
												<span>{monetary(calculated.totalDue)}</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						{/* End Loan information */}
					</div>

					<div className="flex justify-center mt-4">
						<div className="m-2">
							<Link href={`/requestDetails/` + request.id}>
								<button className="relative py-2 px-12 text-black text-base rounded-[50px] overflow-hidden bg-slate-100 transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:shadow-lg active:scale-90 hover:before:left-0">
									Back
								</button>
							</Link>
						</div>

						<div className="m-2">
							<Button onClick={discl.onOpen} className="relative py-2 px-12 text-black text-base rounded-[50px] overflow-hidden bg-slate-100 transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-red-500 before:to-red-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-[50px] hover:before:left-0">Create a contract with this request</Button>
						</div>
					</div>
				</div>
			</div>

			<CreateContractConfirmationModal btnState={submitting} disclosure={discl} submit={createContrHandler} />
		</SiteLayout>
	)
}

