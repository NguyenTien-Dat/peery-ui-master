/* eslint-disable @next/next/no-img-element */
import SiteLayout from "@/layouts/PageLayout"


export default function Home() {
	return (
		<SiteLayout>
			<div className="bg-smoke">

				<section>
					<div className="relative isolate overflow-hidden max-w-7xl mx-auto">
						<img src="https://c4.wallpaperflare.com/wallpaper/698/479/758/money-cash-bills-wallpaper-preview.jpg" alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30" />
						<div className="py-32 lg:pt-32 bg-gradient-to-r from-smoke via-smoke/80 h-full px-8 md:px-12 lg:px-32">
							<div className="text-left">
								<p className="mt-8 text-4xl font-semibold lg:text-6xl tracking-tighter text-zinc-900">
									Flexible <span className="md:block text-orange-500">installment loan</span>
								</p>

								<div className="flex flex-col items-center gap-3 mt-10 md:flex-row">
									{/* <Button as={NextLink} href="/register" className="relative py-2 px-8 text-black text-base rounded-[50px] overflow-hidden bg-slate-100 transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-green-500 before:to-green-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-[50px] hover:before:left-0">
										Sign up now
									</Button> */}
								</div>
							</div>
						</div>
					</div>
				</section>

				<section>
					<div className="px-8 mx-auto md:px-12 lg:px-32 max-w-7xl mb-32">
						{/* <div className="max-w-3xl">
							<p className="mt-8 text-6xl font-semibold tracking-tight text-zinc-900">
								Flexible installment loan
								<span className="md:block md:text-zinc-500">at Peery</span>
							</p>
							<p className="mt-4 text-base text-zinc-500">Long term, high loan limit and reasonable interest rate
							</p>
						</div> */}
						<ol role="list" className="grid mt-12 lg:mt-14 grid-cols-1 lg:grid-cols-3 justify-evenly gap-10">
							<li>
								<div className="sm:flex border-2 border-slate-300 bg-white rounded-lg p-4">
									<div className='h-36 m-2'>
										<h4 className="text-4xl font-semibold text-zinc-900">Loan term</h4>
										<p className="mt-2 text-xl text-zinc-600">Terms are available from 1 to 12 months</p>
									</div>
								</div>
							</li>
							<li>
								<div className="sm:flex border-2 border-slate-300 bg-white rounded-lg p-4">
									<div className='h-36 m-2'>
										<h4 className="text-4xl font-semibold text-zinc-900">Loan amount</h4>
										<p className="mt-2 text-xl text-zinc-600">From 1.000.000 VND to 20.000.000 VND</p>
									</div>
								</div>
							</li>
							<li>
								<div className="sm:flex border-2 border-slate-300 bg-white rounded-lg p-4">
									<div className='h-36 m-2'>
										<h4 className="text-4xl font-semibold text-zinc-900">Interest rate</h4>
										<p className="mt-2 text-xl text-zinc-600">Determined by your credit profile, usually between 5% and 10%</p>
									</div>
								</div>
							</li>
						</ol>
					</div>
				</section>
				<section>
					<div className="px-8 py-12 mx-auto md:px-12 lg:px-32 max-w-7xl l">
						<div className="relative overflow-hidden bg-smoke ring-1 ring-zinc-300 px-6 py-20 rounded-3xl sm:px-10 sm:py-24 md:px-12 lg:px-20">
							<img className="absolute inset-0 h-full w-full object-cover brightness-150 opacity-90" src="https://c1.wallpaperflare.com/preview/814/885/124/business-idea-investment-bulb-idea-business-finance.jpg" alt="" />
							<div className="absolute inset-0 bg-smoke/90">

							</div>
							<div className="relative mx-auto max-w-2xl lg:mx-0">
								<figure>
									<blockquote className="text-lg bg-opacity-80 p-10 rounded-lg font-medium text-slate-950 sm:text-2xl sm:leading-8 bg-gray-300">
										<p>Peery is our solution to the P2P lending problem in Vietnam. It focuses on simplicity and flexibility, with the goal of connecting potential lenders to borrowers.</p>
									</blockquote>
								</figure>
							</div>
						</div>
					</div>
				</section>
				<section>
					<div className="px-8 py-12 mx-auto md:px-12 lg:px-32 max-w-7xl lg:py-24">
						<div className="max-w-3xl lg:text-center lg:mx-auto">
							<p className="mt-8 text-6xl font-semibold tracking-tight text-zinc-900">Am I suitable for a loan at Peery?
							</p>
							<p className="mt-4 text-base text-zinc-500">Probably yes! Find out more in details below…</p>
						</div>
						<div className="grid max-w-2xl grid-cols-1 gap-y-10 sm:mx-auto lg:max-w-none lg:grid-cols-4 xl:gap-x-2 mt-12 lg:mt-24">
							<section className="flex flex-col px-6 sm:px-8 lg:py-8 bg-white rounded-3xl">
								<h3 className="text-3xl text-black">Age</h3>
								<p className="mt-4 text-2xl text-gray-500">18 years old or above</p>
							</section>
							<section className="flex flex-col order-first px-6 py-8 bg-zinc-500 rounded-3xl sm:px-8 lg:order-none">
								<h3 className="text-3xl text-white">Province</h3>
								<p className="mt-4 text-2xl text-gray-100">Every!</p>

							</section>
							<section className="flex flex-col px-6 sm:px-8 lg:py-8 bg-white rounded-3xl">
								<h3 className="text-3xl text-black">Conditions</h3>
								<p className="mt-4 text-2xl text-gray-500">Income statement and declaration of owned assets</p>
							</section>
							<section className="flex flex-col order-first px-6 py-8 bg-zinc-500 rounded-3xl sm:px-8 lg:order-none">
								<h3 className="text-3xl text-white">Loans at Peery</h3>
								<p className="mt-4 text-2xl text-gray-100">Fixed interest rate based on your credit profile, terms available from 1 to 12 months</p>
							</section>
						</div>
					</div>
				</section>

				<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
			</div>
		</SiteLayout >
	)
}