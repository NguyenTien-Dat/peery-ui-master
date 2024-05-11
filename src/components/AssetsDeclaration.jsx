/* eslint-disable react/jsx-key */
import { Button, Input } from "@nextui-org/react";
import { useFieldArray } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function AssetsDeclaration({ regForm }) {
	const { register, trigger, handleSubmit, formState: { errors }, control } = regForm
	const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
		control,
		name: "assets",
		rules: {
			required: true,
		}
	})

	return (
		<>
			<div className="bg-gray-200 w-3/4">
				<div className="bg-gray-300 shadow rounded-lg p-6">
					<h2 className="text-xl flex font-bold mb-4 justify-center">Declaration of your assets</h2>
					<div className="flex flex-col items-center gap-2">
						{fields.length == 0 && <p>Please click <i>Add</i> below to add a new document.</p>}
						{fields.map((field, index) => (<div className="flex justify-center w-full gap-4" key={field.id}>
							<Input type="file" {...register(`assets.${index}.attachment`, { required: true })} className="w-2/5" accept="image/jpeg,image/png,image/webp" multiple={false} />
							<Input type='text' {...register(`assets.${index}.description`, { required: true })} className="w-3/5" placeholder="Enter the description of this document" />
							<Button type="button" isIconOnly variant="flat" color="danger" onClick={() => remove(index)}><FontAwesomeIcon className="h-5" icon='fa-solid fa-trash' /></Button>
						</div>))}
					</div>
				</div>

				<div className="flex my-5 justify-center">
					<Button
							onClick={() => append({ attachment: null, description: '' })}
							type='button'
							className="relative px-12 text-black text-base rounded-[50px] overflow-hidden bg-slate-100 transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-blue-500 before:to-blue-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-[50px] hover:before:left-0">
						Add another asset
					</Button>
				</div>
			</div>
		</>
	)
}