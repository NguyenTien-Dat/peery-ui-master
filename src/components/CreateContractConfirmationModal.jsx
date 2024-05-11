/* eslint-disable react-hooks/exhaustive-deps */

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

export default function CreateContractConfirmationModal({ btnState, submit, disclosure }) {
	const {isOpen, onOpenChange} = disclosure;

	return (
		<Modal size="2xl" isOpen={isOpen} isDismissable={false} onOpenChange={onOpenChange}>
			<ModalContent>
				{(onClose) => {
					return (
						<>
							<ModalHeader className="flex flex-col gap-1">Notice on contract creation</ModalHeader>
							<ModalBody>
								<p className="text-red-500">
									By clicking the <i>Create contract</i> button below, you hereby agree to the following:
								</p>

								<p className="leading-relaxed text-red-500 mt-2 ml-8">
									<ul className="list-disc">
										<li>You have assessed thoroughly the profile of this borrower.</li>
										<li>Your personal and financial information, provided at the time of the registration phase, will be visible to administrators and the borrower.</li>
										<li>This loan contract will be legally binding for both parties. It is <b>not cancellable</b>.</li>
										<li>You will bear the responsibility to pay the borrower the specified loan amount, immediately after the creation of the contract.</li>
									</ul>
								</p>

								<p className="mt-2">
									Should problems arise, please contact our staff for support.
								</p>
							</ModalBody>
							<ModalFooter>
								<Button color="success" isLoading={btnState} className="mx-auto" onClick={submit}>Create contract</Button>
							</ModalFooter>
						</>
					)
				}}
			</ModalContent>
		</Modal>
	);
}