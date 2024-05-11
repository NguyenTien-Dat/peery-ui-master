import React from 'react';
import PageTitle from '@/components/PageTitle';
import SiteLayout from '@/layouts/PageLayout';
import { Button, Link } from "@nextui-org/react"

export default function BorrowerDetail() {
    return (
        <SiteLayout>
            {/* <div className="flex w-3/4 -mt-16 mb-7">
                <a href="/requestList">
                    <button className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-full text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover-bg-blue-700">
                        Back to Request List
                    </button>
                </a>
            </div> */}

            <div className="bg-gray-100">
                <div className="container mx-auto py-8">
                    <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
                        <div className="col-span-12 sm:col-span-12">
                            <div className="bg-white shadow rounded-lg p-6">
                                <h2 className="text-2xl flex font-bold mb-4 justify-center">Borrower Details</h2>
                                <div className="mt-4 flex flex-col bg-gray-100 rounded-lg p-4 shadow-sm">
                                    <div className="mt-4 flex flex-row space-x-2">
                                        <div className="flex-1">
                                            <span className="text-blue-900">Full Name</span>
                                            <div className="w-full bg-white rounded-md border-gray-300 text-black px-4 py-2">
                                                Harry Maguire
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-blue-900">Credit Score</span>
                                            <div className="w-full bg-white rounded-md border-gray-300 text-black px-4 py-2">
                                                678
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-blue-900">Rank</span>
                                            <div className="w-full bg-white rounded-md border-gray-300 text-black px-4 py-2">
                                                B
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-row space-x-2">
                                        <div className="flex-1">
                                            <span className="text-blue-900">Job</span>
                                            <div className="w-full bg-white rounded-md border-gray-300 text-black px-4 py-2">
                                                Student
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-blue-900">Workplace</span>
                                            <div className="w-full bg-white rounded-md border-gray-300 text-black px-4 py-2">
                                                FPT University
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-blue-900">Income</span>
                                            <div className="w-full bg-white rounded-md border-gray-300 text-black px-4 py-2">
                                                2,000,000
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 space-x-0 lg:flex lg:space-x-4">
                                        <div className="w-full lg-w-1/4">
                                            <span className="text-blue-900">Citizen Identity Card</span>
                                            <div className="w-full bg-white rounded-md border-gray-300 text-black px-4 py-2">
                                                122345678
                                            </div>
                                        </div>
                                        <div className="w-full lg-w-1/4">
                                            <span className="text-blue-900">Date of issue</span>
                                            <div className="w-full bg-white rounded-md border-gray-300 text-black px-4 py-2">
                                                29/09/2018
                                            </div>
                                        </div>
                                        <div className="w-full lg-w-1/4">
                                            <span className="text-blue-900">Place of issue</span>
                                            <div className="w-full bg-white rounded-md border-gray-300 text-black px-4 py-2">
                                                Hanoi
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 space-x-0 lg:flex lg:space-x-4">
                                        <div className="w-full lg-w-1/4">
                                            <span className="text-blue-900">Date of Birth</span>
                                            <div className="w-full bg-white rounded-md border-gray-300 text-black px-4 py-2">
                                                01/02/2003
                                            </div>
                                        </div>
                                        <div className="w-full lg-w-2/4">
                                            <span className="text-blue-900">Place of Birth</span>
                                            <div className="w-full bg-white rounded-md border-gray-300 text-black px-4 py-2">
                                                Bắc Giang
                                            </div>
                                        </div>
                                        <div className="w-full lg-w-1/4">
                                            <span className="text-blue-900">Gender</span>
                                            <div className="w-full bg-white rounded-md border-gray-300 text-black px-4 py-2">
                                                Female
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 space-x-0 lg:flex lg:space-x-4">
                                        <div className="w-full lg-w-2/4">
                                            <span className="text-blue-900">Email Address</span>
                                            <div className="w-full bg-white rounded-md border-gray-300 text-black px-4 py-2">
                                                abc@gmail.com
                                            </div>
                                        </div>
                                        <div className="w-full lg-w-2/4">
                                            <span className="text-blue-900">Phone Number</span>
                                            <div className="w-full bg-white rounded-md border-gray-300 text-black px-4 py-2">
                                                0912345678
                                            </div>
                                        </div>
                                        <div className="w-full lg-w-1/4">
                                            <span className="text-blue-900">Emergency Contact Number</span>
                                            <div className="w-full bg-white rounded-md border-gray-300 text-black px-4 py-2">
                                                0679234567
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 space-x-0 lg:flex lg:space-x-4">
                                        <div className="w-full lg-w-1/4">
                                            <span className="text-blue-900">Province/City</span>
                                            <div className="w-full bg-white rounded-md border-gray-300 text-black px-4 py-2">
                                                Hà Nội
                                            </div>
                                        </div>
                                        <div className="w-full lg-w-2/4">
                                            <span className="text-blue-900">District</span>
                                            <div className="w-full bg-white rounded-md border-gray-300 text-black px-4 py-2">
                                                Thạch Thất
                                            </div>
                                        </div>
                                        <div className="w-full lg-w-1/4">
                                            <span className="text-blue-900">Ward/Commune</span>
                                            <div className="w-full bg-white rounded-md border-gray-300 text-black px-4 py-2">
                                                Thạch Hoà
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full mt-4">
                                        <span className="text-blue-900">Address</span>
                                        <div className="w-full bg-white rounded-md border-gray-300 text-black px-4 py-2">
                                            Đại học FPT
                                        </div>
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
