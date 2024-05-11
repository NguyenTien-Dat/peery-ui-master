import SiteLayout from "@/layouts/PageLayout"
import { Button, Select, Link, Input } from "@nextui-org/react";
import PageTitle from "@/components/PageTitle";



export default function CreatePayment() {
    return (
        <SiteLayout>
            <div className="">
					<PageTitle title="Create Payment" />
				</div>
            <div className="bg-gray-100 mt-10">
                <div className="container mx-auto py-8">
                    <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
                        <div className="col-span-4 sm:col-span-3">
                            <div className="bg-white shadow rounded-lg p-6">
                                <div className="flex flex-col items-center h-max">
                                    <div className="">
                                        <img src="https://vanav.ae/wp-content/uploads/2022/06/Step-5.webp" className="max-h-96 mb-4 shrink-0">
                                        </img>
                                    </div>
                                    <h1 className="text-xl font-bold">Proof of payment</h1>
                                    <p className="text-gray-600">Borrower</p>
                                    <div className="mt-6 flex flex-wrap gap-4 justify-center">
                                        <span className="cursor-pointer bg-slate-100 px-4 py-2 active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#F44336,-0.5rem_-0.5rem_#00BCD4] transition">
                                            <span className="mt-2 text-base leading-normal">Upload photo</span>
                                            <input type='file' className="hidden" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-4 sm:col-span-9">
                            <div className="bg-white shadow rounded-lg p-6">
                                {/* <h2 className="text-xl flex font-bold mb-4 justify-center">Create Payment</h2> */}
                                <div className="mt-4 flex flex-col bg-gray-100 rounded-lg p-4 shadow-sm">
                                    <div className="mt-4 flex flex-row space-x-2">
                                        <div className="flex-1 text-lg">
                                            <span className="text-blue-900">Payment amount</span>
                                            <input placeholder="Enter the amount to pay" className="w-full bg-white rounded-md border-gray-300 text-emerald-600 px-2 py-1" id="phone" type="text"></input>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <Link href="#">
                                            <Button className="relative py-2 px-12 text-black text-base rounded-[50px] overflow-hidden bg-slate-100 transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-blue-500 before:to-blue-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-[50px] hover:before:left-0">
                                                Submit
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
    )
}