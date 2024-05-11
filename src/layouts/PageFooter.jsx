import { Link } from "@nextui-org/react";

export default function PageFooter() {
	return (
		<footer className="w-full bg-slate-400 flex flex-col items-center justify-center py-5">
			<p className="flex items-center gap-1 text-white">A project by SEP490-G10</p>
			<p className="flex items-center gap-1 text-white">Need support? Please <Link target="_blank" className='text-white font-semibold' href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">contact us</Link>!</p>
		</footer>
	)
};