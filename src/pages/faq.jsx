import React from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import PageTitle from "@/components/PageTitle"
import SiteLayout from "@/layouts/PageLayout"


export default function Test() {

    return (
        <SiteLayout>
            <div className="">
                <PageTitle title={`Frequently Asked Questions`} />
            </div>
            <div>
                <div class="mt-4 flex flex-col  rounded-lg p-4 shadow-sm">
                    <h2 class="font-bold text-blue-900 text-lg">Regarding the loan</h2>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <Accordion variant="shadow">
                            <AccordionItem key="1" aria-label="Accordion 1" title="How long does it take to receive the loan?">
                                {"Your loan application will be processed by the lending party, and then you will receive your borrowed funds."}
                            </AccordionItem>
                            <AccordionItem key="2" aria-label="Accordion 2" title="Who can use the Peery service">
                                {"Peery's services cater to the following customer demographic: Individuals aged between 22 and 60; possessing legally owned assets to be used as collateral for the loan, as stipulated by the lending institution during different periods."}
                            </AccordionItem>
                            <AccordionItem key="3" aria-label="Accordion 3" title="At what interest rate?">
                                {"The interest rate will be calculated based on your credit score; the higher the credit score, the lower the interest rate. Your credit score will depend on the information you provide."}
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
                <div class="mt-4 flex flex-col  rounded-lg p-4 shadow-sm">
                    <h2 class="font-bold text-blue-900 text-lg">Regarding the disbursement of funds</h2>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <Accordion variant="shadow">
                            <AccordionItem key="1" aria-label="Accordion 1" title="When can I expect to receive the borrowed funds?">
                                {"Once your loan request is approved by the lending party, you can expect to receive the borrowed funds approximately one hour later."}
                            </AccordionItem>
                            <AccordionItem key="2" aria-label="Accordion 2" title="If you do not receive the disbursed funds, what should you do?">
                                {"Please contact Peery's Customer Service department for assistance by: Sending feedback via email at hotro@gmail.com or contacting the hotline at 0987 654 321."}
                            </AccordionItem>
                            <AccordionItem key="3" aria-label="Accordion 3" title="What is the deadline for me to come and collect the disbursed funds?">
                                {"When your loan request is approved by the lending party, you can expect to receive the borrowed funds approximately one hour later."}
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
                <div class="mt-4 flex flex-col  rounded-lg p-4 shadow-sm">
                    <h2 class="font-bold text-blue-900 text-lg">Repayment of the loan</h2>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <Accordion variant="shadow">
                            <AccordionItem key="1" aria-label="Accordion 1" title="How is the loan repayment processed?">
                                {"Please transfer the payment to the lender's designated bank account. After completing the transfer, log into the system, select the loan you just repaid, and proceed to enter the amount you've just paid on the system for it to update your payment status."}
                            </AccordionItem>
                            <AccordionItem key="2" aria-label="Accordion 2" title="Is it possible to make a late payment or request an extension?">
                                {"You need to contact the debt processing department at the hotline: 0987 654 321 to request a review and approval for an extension of the loan repayment to avoid: Impact on your credit history; Influence on the approval of your future loan applications; Debt recovery measures and/or legal actions as per current regulations."}
                            </AccordionItem>
                            <AccordionItem key="3" aria-label="Accordion 3" title="Can I pay early?">
                                {"You are allowed to make an early repayment of the loan at any time after the loan has been disbursed. Please note: You need to contact our debt processing department at the hotline: 0987 654 321 to be informed of the amount for the early repayment of the loan"}
                            </AccordionItem>
                            <AccordionItem key="4" aria-label="Accordion 4" title="How do I know the payment amount and payment due date?">
                                {"Please log into the system, choose the contract management feature, where a clear breakdown of the repayment schedule and the amount you need to pay will be provided for you."}
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </div>
        </SiteLayout>
    )
}