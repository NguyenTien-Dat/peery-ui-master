import React, { useState } from 'react';
import PageTitle from '@/components/PageTitle';
import SiteLayout from '@/layouts/PageLayout';
import { Button, Link } from "@nextui-org/react";
import ImageViewerModal from '@/components/ImageViewerModal';

export default function BorrowerPaymentDetail() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const imageURL = 'https://vanav.ae/wp-content/uploads/2022/06/Step-5.webp';

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    return (
        <SiteLayout>
            <div className="">
                <PageTitle title="Payment Details" />
            </div>
            <div className="container mx-auto py-8">
                <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
                    <div className="col-span-12 sm:col-span-12">
                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="mt-4 flex flex-col bg-gray-100 rounded-lg p-4 shadow-sm">
                                <div className="mt-4 flex flex-row space-x-2">
                                    <div className="flex-1">
                                        <span className="text-blue-900">Borrower</span>
                                        <div className="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1">
                                            <p>Harry Maguire</p>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-blue-900">Lender</span>
                                        <div className="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1">
                                            <p>John Doe</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-row space-x-2">
                                    <div className="flex-1">
                                        <span className="text-blue-900">Term</span>
                                        <div className="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1">
                                            <p>1</p>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-blue-900">Repayment Date</span>
                                        <div className="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1">
                                            <p>30/3/2024</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-row space-x-2">
                                    <div className="flex-1">
                                        <span className="text-blue-900">Loan Amount</span>
                                        <div className="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1">
                                            <p>5,000,000</p>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-blue-900">Loan Amount Paid</span>
                                        <div className="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1">
                                            <p>5,000,000</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-row space-x-2">
                                    <div className="flex-1">
                                        <span className="text-blue-900">Proof Status</span>
                                        <div className="w-full bg-white rounded-md border-gray-300 text-black px-2 py-1">
                                            <p>Proven</p>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <span className="text-blue-900">Payment Proof</span>

                                        <div className="w-full">
                                            <button
                                                className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                                onClick={openModal}
                                            >
                                                View Proof
                                            </button>
                                        </div>
                                    </div>

                                    <ImageViewerModal
                                        isOpen={isModalOpen}
                                        closeModal={closeModal}
                                        imageURL={imageURL}
                                    />
                                </div>


                                <div className="mt-4 flex justify-center">
                                    <div className="m-2">
                                        <Link href="/paymentList">
                                            <Button className="relative py-2 px-12 text-black text-base rounded-[50px] overflow-hidden bg-slate-100 transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-red-500 before:to-red-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-[50px] hover:before:left-0">
                                                Back
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
