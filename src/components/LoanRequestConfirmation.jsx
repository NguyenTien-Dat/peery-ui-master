/* eslint-disable react-hooks/exhaustive-deps */

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

export default function LoanRequestConfirmation({ disclosure, submit }) {
	const {isOpen, onOpenChange} = disclosure;

	return (
		<Modal size="2xl" isOpen={isOpen} isDismissable={false} onOpenChange={onOpenChange}>
			<ModalContent>
				{(onClose) => {
					return (
						<>
							<ModalHeader className="flex flex-col gap-1">Notice on submitting loan request</ModalHeader>
							<ModalBody>
								<p className="text-red-500">
									By clicking the <i>Submit loan request</i> button below, you have agreed that:
								</p>

								<p className="leading-relaxed text-red-500 mt-2 ml-8">
									<ul className="list-disc">
										<li>You are seeking a loan that aligns precisely with the information you are submitting to us.</li>
										<li>Your personal and financial information, provided at the time of the registration phase, will be visible to administrators and lenders.</li>
										<li>Any financially capable lender will be able to accept your loan request. Subsequently, a loan contract will be established between you and the lender in question.</li>
										<li>Once a contract is created, you will bear the responsibility to <b>pay back the required amount every month</b>. Detailed requirement of payments will be shown in <i>Payments</i> section of the contract.</li>
									</ul>
								</p>

								<p className="mt-2">
									Should problems arise, please contact our staff for support.
								</p>
							</ModalBody>
							<ModalFooter>
								<Button color="success" className="mx-auto" onClick={submit}>Submit loan request</Button>
							</ModalFooter>
						</>
					)
				}}
			</ModalContent>
		</Modal>
	);
}