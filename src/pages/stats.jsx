import PageTitle from "@/components/PageTitle";
import PageLayout from "@/layouts/PageLayout";
import customFetch from "@/lib/customFetch";
import { monetary } from "@/lib/utils";
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";

export async function getServerSideProps({ req, res, query }) {
	let stats = await customFetch('/stats')
	return {
		props: {
			stats
		}
	}
}

function StatCard({ desc, data }) {
	return (<Card className="">
		<CardHeader>
			<span className="mx-auto font-bold">{desc}</span>
		</CardHeader>
		<Divider />
		<CardBody>
			<span className="text-2xl text-center">{data}</span>
		</CardBody>
	</Card>)
}

export default function Stats({ stats }) {
	return (
		<PageLayout>
			<PageTitle title={`Statistics`} />

			<div className="grid grid-cols-2 gap-10 w-2/4 mt-10">
				<StatCard desc="Number of borrowers" data={stats.totalBorrowers} />
				<StatCard desc="Number of lenders" data={stats.totalLenders} />

				<StatCard desc="Total contracts" data={stats.totalContracts} />
				<StatCard desc="Settled contracts" data={stats.totalContractsSettled} />

				<StatCard desc="Total loan requests" data={stats.totalLoanRequests} />
				<StatCard desc="Unsettled loan requests" data={stats.unsettledLoanRequests} />

				<StatCard desc="Total lent" data={monetary(stats.totalAmountLent)} />
				<StatCard desc="Total repaid" data={monetary(stats.totalAmountRepaid)} />
			</div>
		</PageLayout>
	)
}