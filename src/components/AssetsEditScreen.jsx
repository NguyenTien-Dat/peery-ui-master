/* eslint-disable react-hooks/exhaustive-deps */
import customFetch from "@/lib/customFetch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Input, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

/* eslint-disable react/jsx-key */
export default function AssetsEditScreen({ user }) {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const discl2 = useDisclosure();
	const router = useRouter()
	const { register, trigger, handleSubmit, formState: { errors }, control, reset } = useForm()


	const refreshAtchs = async () => {
		let fetchedUser = await customFetch('/admin/userdetail', { userId: user.id })
		let atchs = fetchedUser.attachments.filter(v => v.type.id == 5)
		setAtchs(atchs)
	}

	useEffect(() => {
		refreshAtchs()
	}, [])

	const [atchs, setAtchs] = useState([])
	const [uuidToDel, setUuidDel] = useState()

	const removeAtch = async () => {
		let resp = await customFetch('/user/attachment/deleteattachment', { uuid: uuidToDel, userId: user.id }, {
			method: 'DELETE',
		})

		toast.success('The document has been deleted')
		onClose()

		router.replace('/yourProfile?screen=assets')
		router.reload()
	}

	const addAtch = async (newAtch) => {
		const formData = new FormData()
		formData.append('attachment', newAtch.file[0])
		formData.append('description', newAtch.desc)

		let resp = await customFetch('/user/attachment/addAsset', { userId: user.id }, {
			method: 'POST',
			body: formData
		})

		toast.success('A new document has been submitted')
		reset({
			file: null,
			desc: ''
		})
		discl2.onClose()

		router.replace('/yourProfile?screen=assets')
		router.reload()
	}

	return (
		<div className="flex flex-col gap-4 items-center">
			<h2 className="font-bold text-2xl">Assets declaration</h2>

			{atchs.map(a => (
				<div className="flex flex-row p-2 gap-4 justify-items-center bg-gray-300 rounded-lg w-3/5">
					<span className="flex-auto">{a.description}</span>
					<div className="self-end">
						<Link className="w-fit h-fit" title={`View this document`} href={`${process.env.NEXT_PUBLIC_API_PREFIX}/user/attachment/getattachment?${new URLSearchParams({ uuid: a.uuid })}`} target="_blank" onClick={null}><FontAwesomeIcon className="h-5" icon='fa-solid fa-eye' /></Link>
					</div>
					<div className="self-end">
						<Link className="w-fit h-fit" href="#" title="Delete this document" onClick={() => { setUuidDel(a.uuid); onOpen() }}><FontAwesomeIcon className="h-5" color="red" icon='fa-solid fa-trash' /></Link>
					</div>
				</div>
			))}

			{atchs.length == 0 && <p className="italic">No assets declared yet. Please add some below.</p>}

			<div className="flex flex-col p-3 gap-3 bg-gray-300 rounded-lg w-2/5">
				<Input type="file" {...register('file', { required: true })} accept="image/jpeg,image/png,image/webp" size="sm" multiple={false} />
				<Input type="text" {...register('desc', { required: true })} id='asset-desc-input' size="sm" placeholder="Enter a description for this document" />
				<Button type='button' onClick={handleSubmit(discl2.onOpen)} className="w-fit self-end" color="primary">Add</Button>
			</div>

			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1"></ModalHeader>
							<ModalBody>
								<p>Are you sure you want to delete the selected document? This may affect your credit profile.</p>
							</ModalBody>
							<ModalFooter className="mx-auto">
								<Button color="danger" onClick={removeAtch}>Yes</Button>
								<Button color="primary" onClick={onClose}>No</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>

			<Modal isOpen={discl2.isOpen} onOpenChange={discl2.onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1"></ModalHeader>
							<ModalBody>
								<p>Do you want to add this attachment? It will be reviewed by us to assess your credit profile.</p>
								<p>In the mean time, your account will stay in <i>Unconfirmed</i> state.</p>
							</ModalBody>
							<ModalFooter className="mx-auto">
								<Button color="primary" onClick={handleSubmit(addAtch)}>Yes</Button>
								<Button color="primary" variant="bordered" onClick={onClose}>No</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	)
}