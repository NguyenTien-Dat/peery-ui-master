/* eslint-disable react-hooks/exhaustive-deps */

import customFetch from "@/lib/customFetch";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Tooltip } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";


export default function UpdatePaymentModal({ user, payment, disclosure }) {
	const router = useRouter()
	const [loading, setLoading] = useState(false)

	const { register, handleSubmit, control, watch, reset, setValue, setError, clearErrors, formState: { errors }} = useForm({
		defaultValues: {
			date: (new Date()).toISOString().split("T")[0],
			amount: String(payment.amountRemaining)
		}
	})
	const amountWatch = watch('amount')

	const { isOpen, onOpenChange, onClose } = disclosure;

	const [pms, setPms] = useState([])
	useEffect(() => {
		async function getPms() {
			const pms = await customFetch('/paymentMethods/list')
			setPms(pms)
		}
		getPms()
	}, [])

	const updatePayment = async (data) => {
		setLoading(true)
		
		let res = await customFetch('/installment/add', {
			userId: user.id,
		}, {
			method: 'POST',
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				amount: Number(data.amount.replace(/\D/g,'')),
				date: data.date,
				paymentMethod: {
					id: data.pmId
				},
				payment: {
					id: payment.id
				},
				status: 0
			})
		})

		disclosure.onClose()
		setLoading(false)
		toast.success('An installment has been created')
		router.reload()
	}

	useEffect(() => {
		if (! amountWatch) return

		var amount = Number(amountWatch.replace(/\D/g,''));
		setValue('amount', (amount > 0) ? amount.toLocaleString('vi-VN') : '')
	}, [amountWatch])

	return (
		<Modal isOpen={isOpen} isDismissable={false} onOpenChange={onOpenChange} onClose={() => { reset() }}>
			<ModalContent>
				{(onClose) => {
					const isPayer = (payment.status.id == 2 && ((payment.type == 'DISBURSE' && user.role.id == 3) || (payment.type == 'REPAY' && user.role.id == 2)))

					return (
						<>
							<ModalHeader className="">Update this payment</ModalHeader>
							<ModalBody className="flex flex-col gap-5">
								{isPayer && <p>Your changes to the payment is awaiting the other party&apos;s confirmation.</p>}
								{!isPayer && <>
									<div className="flex flex-col gap-2">
										<Input type="text" label="Amount (in Vietnamese Dong)" labelPlacement="outside" placeholder="Enter the amount you paid" isDisabled={payment.type == 'DISBURSE'} {...register('amount', { required: true })} />
										<span className={`text-red-500 italic text-sm ${payment.type == 'DISBURSE' ? '' : 'hidden'}`}>Please release the full amount to the borrower.</span>
									</div>
									<div className="flex flex-col gap-2">
										<Input label="Date of payment" labelPlacement="outside" placeholder="." type="date" {...register('date', { required: true })} />
									</div>
									<div className="flex flex-col gap-2">
										<Controller
											control={control}
											name="pmId"
											rules={{
												required: true
											}}
											render={({ field: { onChange, value } }) => (
												<Select label="Payment method" labelPlacement="outside" placeholder="Select one…" onChange={onChange} selectedKeys={value} items={pms}>
													{(pm) => <SelectItem key={pm.id}>{pm.name}</SelectItem>}
												</Select>
											)}
										/>
									</div>
									<span className={`${(errors.amount) ? '' : 'hidden'} text-red-500 text-sm`}>Please enter an amount!</span>
								</>}
							</ModalBody>
							<ModalFooter>
								{!isPayer && <Button color="success" isLoading={loading} className="mx-auto" onClick={handleSubmit(updatePayment)}>Update payment</Button>}
							</ModalFooter>
						</>
					)
				}}
			</ModalContent>
		</Modal>
	);
}