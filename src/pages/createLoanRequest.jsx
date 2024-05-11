/* eslint-disable react/jsx-key */
import LoanRequestConfirmation from "@/components/LoanRequestConfirmation"
import PageTitle from "@/components/PageTitle"
import SiteLayout from "@/layouts/PageLayout"
import customFetch from "@/lib/customFetch"
import { monetary } from "@/lib/utils"
import { Button, useDisclosure } from "@nextui-org/react"

import { getCookie } from "cookies-next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import toast from "react-hot-toast"


export async function getServerSideProps(ctx) {
	const user = JSON.parse(getCookie('user', { req: ctx.req, res: ctx.res }))

	let params = {
		// userId: user.id
	}

	let data = await customFetch("/request/terms", params)

	return {
		props: { terms: data, user: user }
	}
}


export default function CreateLoanRequest({ terms, user }) {
	const router = useRouter()
	const discl = useDisclosure()

	const [calApr, setCalApr] = useState('—')
	const [amtDue, setAmtDue] = useState('—')
	const [repayTotal, setRepayTotal] = useState('—')

	const { register, handleSubmit, control, watch, setValue, setError, trigger, clearErrors, formState: { errors }} = useForm()
	const watchFields = watch(['amount', 'termId'])

	useEffect(() => {
		async function prepareRequest() {
			try {
				if (watchFields[0]) {
					let amount = Number(watchFields[0].replace(/\D/g,''));
					setValue('amount', amount.toLocaleString('vi-VN'))		// Aesthetics

					if (amount < 1000000 || amount > 20000000) {
						// setError('amount', {
						// 	type: "value",
						// })
						throw new Error()
					} else {
						// clearErrors('amount')
						let loanData = await customFetch('/request/preparerequest', {
							userId: user.id,
							termId: watchFields[1],
							amount: Number(watchFields[0].replace(/\D/g,''))
						})

						setCalApr((Math.round(loanData.apr * 100 * 100) / 100).toLocaleString('vi-VN') + '%')
						setAmtDue(monetary(loanData.monthlyDue))
						setRepayTotal(monetary(loanData.totalDue))
					}
				} else {
					throw new Error()
				}
			} catch (e) {
				setCalApr('—')
				setAmtDue('—')
				setRepayTotal('—')
			}
		}

		prepareRequest()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, watchFields)

	const onClickHandler = async () => {
		await trigger()

		if (Object.keys(errors).length > 0) {
			toast.error("Please check your loan information!")
			return
		}

		discl.onOpen()
	}

	const submitLoanReq = async (data) => {
		data.amount = Number(data.amount.replace(/\D/g,''))
		data.userId = user.id

		try {
			let req = await customFetch('/request/createrequest', undefined, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data)
			})

			discl.onClose()

			toast.success('Your loan request has been submitted and is waiting approval')
			router.push('/requestList')
		} catch (e) {
			throw (e)
		}
	}

	return (
		<SiteLayout>
			<div className="flex flex-col gap-10">
				<PageTitle title="Create Loan Request" />
				<div className="container p-4 mx-auto">
					<div className="flex flex-col w-full px-0 mx-auto md:flex-row">
						<div className="flex flex-col md:w-full">
							<form className="justify-center w-full mx-auto">
								<div className="">
									<div className="space-x-0 lg:flex lg:space-x-4">
										<div className="w-full">
											<div className="BL" style={{ textAlign: 'left' }}>
												<h1>How would you like to borrow?</h1>
											</div>
											<div className="relative pt-3 xl:pt-6">
												<label className="block mb-3 text-sm font-semibold text-gray-500">Amount (in Vietnamese Dong)</label>
												<input
													id='amount-input'
													{...register('amount', {
														required: true,
														validate: v => {
															let amount = Number(v.replace(/\D/g,''));
															return !(amount < 1000000 || amount > 20000000)
														}
													})}
													placeholder="Min. 1.000.000 ₫, max. 20.000.000 ₫"
													className="w-2/4 px-4 py-3 text-sm border border-gray-300 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600" type="text" />
												<span className={`${(errors.amount) ? '' : 'hidden'} block mt-2 text-red-500 text-sm`}>Loan amount must be between 1.000.000 ₫ and 20.000.000 ₫!</span>
											</div>

											<div className="relative pt-3 xl:pt-6">
												<label className="block mb-3 text-sm font-semibold text-gray-500">Term</label>
												<Controller
														control={control}
														name="termId"
														rules={{
															required: true,
															validate: (value, formValues) => value != 'undef'
														}}
														render={({ field: { onChange, value } }) => (
															<select id='term-select' value={value} onChange={onChange} className="w-fit px-4 py-3 text-sm border border-gray-300 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600">
																<option value='undef'>Select a term…</option>
																{terms.map(t => <option value={t.id}>{t.numberOfMonth + ((t.numberOfMonth == 1) ? ' month' : ` months`)}</option>)}
															</select>
														)}
												/>
											</div>
											<div className="relative pt-3 xl:pt-6">
												<label className="block mb-3 text-sm font-semibold text-gray-500">Reason for requesting a loan</label>
												<textarea
														id='note-ta'
														{...register('note', { required: true })}
														className="flex items-center w-full px-4 py-3 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
														rows={4}
														placeholder={`You can explain here why you need the loan, how you are going to pay it back…
This information will be visible to lenders.`} />
											</div>
										</div>
										<div className="w-1/2">
											<div className="BL">
												<h1>Overview of your loan</h1>
											</div>
											<div className="BL1">
												<div className="flex flex-col">
													<div className="LS">
														<h1>Interest rate</h1>
													</div>
													<div>
														<span>{calApr}</span>
													</div>
												</div>
												<label className="text-red-500 italic">Interest rate is calculated using your credit information.</label>

												<div className="flex flex-col mt-5">
													<div className="LS">
														<h1>Amount due monthly</h1>
													</div>
													<div>
														<span>{amtDue}</span>
													</div>
												</div>

												<div className="flex flex-col mt-5">
													<h1 className="LS">Total amount to be repaid</h1>
													<div>
														<span>{repayTotal}</span>
													</div>
												</div>
											</div>
										</div>
									</div>

									<div className="mt-10 flex flex-row gap-4 items-center justify-center">
										<Button as={Link} type="button" className="px-6 py-2" href="/requestList">Back</Button>
										<Button type="button" onClick={onClickHandler} color="success" className="px-6 py-2">Send loan request for approval</Button>
									</div>

									<LoanRequestConfirmation disclosure={discl} submit={handleSubmit(submitLoanReq)} />
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</SiteLayout>
	)
}