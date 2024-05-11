import PageTitle from "@/components/PageTitle";
import PageLayout from "@/layouts/PageLayout";
import customFetch from "@/lib/customFetch";
import { Button, Input } from "@nextui-org/react";
import { getCookie } from "cookies-next";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export async function getServerSideProps({ req, res }) {
	const user = JSON.parse(getCookie('user', { req, res }))
	const settings = await customFetch('/setting/list', { userId: user.id })

	return {
		props: {
			user,
			settings
		}
	}
}

export default function Settings({ user, settings }) {
	let defVals = {}
	settings.forEach(s => defVals[s.key] = s.value)

	const settingsForm = useForm({
		defaultValues: {
			...defVals
		}
	})

	const { register, handleSubmit, formState: { errors }, reset } = settingsForm

	const submit = async (formData) => {
		let data = []
		Object.keys(formData).forEach(k => data.push({ key: k, value: formData[k] }))

		await customFetch('/setting/set', { userId: user.id }, {
			method: 'PUT',
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data)
		})

		toast.success("Settings have been updated");
	}

	return (
		<PageLayout>
			<PageTitle title={`Settings`} />

			<div className="container ms-4 w-2/5 py-8">
				<form onSubmit={handleSubmit(submit)}>
					<div className="grid grid-cols-2 gap-4 items-center">
						{settings.map(s => (
							<>
								<span>{s.description}</span>
								<input
										className="p-2 rounded-2xl"
										{...register(s.key, {
											required: true,
											min: 0
										})}
										type="text" />
							</>
						))}
					</div>
					<div className="flex gap-4">
						<Button variant="shadow" type='submit' className="mt-8 w-48" color="success">Save</Button>
						<Button variant="bordered" type='button' onClick={() => reset()} className="mt-8 w-24" color="primary">Reset</Button>
					</div>
				</form>
			</div>
		</PageLayout>
	)
}