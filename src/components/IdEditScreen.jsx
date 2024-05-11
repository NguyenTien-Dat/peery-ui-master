import customFetch from "@/lib/customFetch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Input, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

/* eslint-disable react/jsx-key */
export default function IdEditScreen({ user }) {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const router = useRouter()
	const { register, trigger, handleSubmit, formState: { errors }, control, reset } = useForm()

	const updateCic = async (newAtch) => {
		const formData = new FormData()
		formData.append('frontImage', newAtch.frontFile[0])
		formData.append('backImage', newAtch.backFile[0])
		formData.append('personalImage', newAtch.personFile[0])

		let resp = await customFetch('/user/attachment/updateCic', { userId: user.id }, {
			method: 'POST',
			body: formData
		})

		toast.success('Your documents have been submitted for review')
		reset({
			frontFile: null,
			backFile: null,
			personFile: null
		})
		onClose()

		router.replace('/yourProfile?screen=id')
		router.reload()
	}

	const onFormError = () => {
		toast.error('All photos are required!')
	}

	return (
		<div className="flex flex-col gap-4 items-center">
			<h2 className="font-bold text-2xl">Citizen Identity Card</h2>

			<p>Update photos of your CIC here</p>

			<div className="flex flex-col p-3 gap-2 bg-gray-300 rounded-lg w-2/5">
				<span>Front</span>
				<Input type="file" {...register('frontFile', { required: true })} accept="image/jpeg,image/png,image/webp" size="sm" multiple={false} />

				<span>Back</span>
				<Input type="file" {...register('backFile', { required: true })} accept="image/jpeg,image/png,image/webp" size="sm" multiple={false} />

				<span>Photo of you holding your CIC</span>
				<Input type="file" {...register('personFile', { required: true })} accept="image/jpeg,image/png,image/webp" size="sm" multiple={false} />

				<Button type='button' onClick={handleSubmit(onOpen, onFormError)} className="mt-2 w-fit self-end" color="primary">Submit</Button>
			</div>

			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1"></ModalHeader>
							<ModalBody>
								<p>Are you sure to update your CIC photos?</p>
							</ModalBody>
							<ModalFooter className="mx-auto">
								<Button color="danger" onClick={handleSubmit(updateCic)}>Yes</Button>
								<Button color="primary" onClick={onClose}>No</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	)
}