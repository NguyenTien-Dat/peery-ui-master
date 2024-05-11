/* eslint-disable react-hooks/exhaustive-deps */

import customFetch from "@/lib/customFetch";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function ConfirmPaymentModal({ user, installment, disclosure, choice }) {
	const router = useRouter()
	const { isOpen, onOpenChange, onClose } = disclosure;

	const updatePayment = async (accept) => {
		let res = await customFetch('/installment/updateStatus', {
			userId: user.id,
			installmentId: installment,
			confirm: accept
		}, {
			method: 'PATCH'
		})

		disclosure.onClose()
		if (accept == false) {
			toast.success('You have declined this installment')
		} else {
			toast.success('You have confirmed this installment')
		}

		router.reload()
	}

	return (
		<Modal isOpen={isOpen} isDismissable={false} onOpenChange={onOpenChange} size="lg">
			<ModalContent>
				{(onClose) => {
					return (
						<>
							<ModalHeader className="flex flex-col gap-1">Verify payment status</ModalHeader>
							<ModalBody>
								{choice == true && <div className="flex flex-col gap-3">
									<p>Please make sure that you have received exactly the amount that has been declared by the other party.</p>
									<p>If that is not the case, please close this dialog and choose <i>Reject</i> instead.</p>
									<p>Do you want to continue?</p>
								</div>}

								{choice == false && <div className="flex flex-col gap-3">
									<p>If you believe there has been a mistake with this installment, or you have not received any fund after a few days, you can choose to reject this installment.</p>
									<p>When an installment is declined, it will be deleted and the other party will be informed.</p>
									<p>Do you want to continue?</p>
								</div>}
							</ModalBody>
							<ModalFooter>
								<div className="mx-auto flex flex-row gap-4">
									<Button color="success" onClick={() => updatePayment(choice)}>Yes</Button>
									<Button color="danger" onClick={onClose}>No</Button>
								</div>
							</ModalFooter>
						</>
					)
				}}
			</ModalContent>
		</Modal>
	);
}