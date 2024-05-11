import React from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import PageTitle from "@/components/PageTitle"
import SiteLayout from "@/layouts/PageLayout"


export default function Test() {
    return (
        <SiteLayout>
            <div className="">
                <PageTitle title={`Payment instructions`} />
            </div>
            <div>
                <div class="mt-4 flex bg-red-300 flex-col rounded-lg p-4 shadow-sm">
                    <a>
                        Please verify the account number and enter the correct account information before completing the payment. In the event of a payment to the wrong account, any incurred fees during the adjustment period must be borne by you.
                    </a>
                </div>
            </div>
            <div>
                <div class="mt-4 flex flex-col rounded-lg p-4 shadow-sm">
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <Accordion variant="shadow">
                            <AccordionItem key="1" aria-label="Accordion 1" title="Paying through the banking app.">
                                <div>
                                    1. Open and log in to your account on the bank&apos;s mobile app.
                                </div>
                                <div>
                                    2. Select the payment/transfer option for the account of the lending party (or provide the information to the representative for assistance).
                                </div>
                                <div>
                                    3. Press Transfer/Pay and receive the Transfer/Payment details.
                                </div>
                                <div>
                                    (*) Please carefully verify the account number. In case of incorrect information, the lending party will not approve your payment. You will be responsible for settling any incurred fees (if any) until we acknowledge the correct payment into your account.
                                </div>
                            </AccordionItem>
                            <AccordionItem key="2" aria-label="Accordion 2" title="Payment through ZaloPay/Viettel Money account.">
                                <div>
                                    1. On the main page, select &ldquo;Transfer money&rdquo;.
                                </div>
                                <div>
                                    2. Choose the payment/transfer option for the account of the lending party (or provide the information to the representative for assistance).
                                </div>
                                <div>
                                    3. Press Transfer/Pay and receive the Transfer/Payment details.
                                </div>
                            </AccordionItem>
                            <AccordionItem key="3" aria-label="Accordion 3" title="Payment at the bank branch/ATM">
                                <div>
                                    Payment in cash at the bank, ATM, post office, or any organization that accepts transfers to the payment account.
                                </div>
                                <div>
                                    1. Provide the cashier with the payment details and the account information of the lending party.
                                </div>
                                <div>
                                    2. Make the loan payment and receive the payment receipt.
                                </div>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </div>
        </SiteLayout>
    )
}