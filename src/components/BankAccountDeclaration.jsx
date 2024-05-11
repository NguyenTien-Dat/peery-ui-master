/* eslint-disable react/jsx-key */
import { useState, useEffect } from "react";
import customFetch from "@/lib/customFetch";
import { Button } from "@nextui-org/react";
import toast from "react-hot-toast";


export default function BankAccountDeclaration({ accounts, addAcc, delAcc }) {

	const [bankList, setBankList] = useState([]);   // List of banks to choose

	const [bankId, setBankId] = useState('undef');
	const [bankNumber, setBankNumber] = useState('');

	useEffect(() => {
		customFetch('/user/registration')
				.then((data) => {
					setBankList(data.bankList)
				})
	}, [])

	return (
		<>
			<div className="bg-gray-100 w-3/4">
				<div className="bg-gray-300 shadow rounded-lg p-6">
					<h2 className="text-xl flex font-bold mb-4 justify-center">Bank Account Declaration</h2>
					<div className="flex justify-center">
						<select id="bank" className="w-3/5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={bankId} onChange={(e) => setBankId(e.target.value)}>
							<option value='undef'>&lt;Choose a bank&gt;</option>
							{bankList && bankList.map(bank => <option value={bank.id}>{bank.name} ({bank.fullName})</option>)}
						</select>
						<input placeholder="Enter account number" id='acc-no-input' className="w-3/5 mx-4 bg-white rounded-md border-gray-300 text-emerald-600 px-2 py-1" value={bankNumber} type="text" onChange={(e) => setBankNumber(e.target.value)}></input>
						<Button
								onClick={
									() => {
										const bankValid = bankId != 'undef'
										const accNoValid = /^\d+$/.test(bankNumber)

										if (bankValid && accNoValid) {
											addAcc(bankList.find(v => bankId == v.id), bankNumber)
											setBankId('undef')
											setBankNumber('')
										} else {
											toast.error("Invalid bank or account number!")
										}
									}
								}
								type='button'
								className="relative px-12 text-black text-base rounded-[50px] overflow-hidden bg-slate-100 transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-blue-500 before:to-blue-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-[50px] hover:before:left-0"
							>
							Add
						</Button>
					</div>
				</div>
			</div>
			<div className="w-3/4">
				{accounts.map((acc) => (
					<div className="bg-gray-100">
						<div className="bg-white shadow rounded-lg p-6">
							<div className="flex justify-center w-full">
								<div className="w-3/5 mx-4 bg-gray-100 rounded-md border-gray-300 text-black px-2 py-1">
									<span className="w-full">{acc.bank.name}</span>
								</div>
								<div className="w-3/5 mx-4 bg-gray-100 rounded-md border-gray-300 text-black px-2 py-1">
									<span className="w-full">{acc.accountNo}</span>
								</div>
								<Button
										type='button'
										className="relative py-2 px-12 text-black text-base rounded-[50px] overflow-hidden bg-slate-100 transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-red-500 before:to-red-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-[50px] hover:before:left-0"
										onClick={() => delAcc(acc)}>
									Delete
								</Button>
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	)
}