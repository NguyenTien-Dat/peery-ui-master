import Head from "./PageHead";
import Footer from "./PageFooter";

import { Toaster } from 'react-hot-toast';
import SiteNav from "@/components/SiteNav";


export default function PageLayout({ children }) {
	return (
		<main className="flex flex-col justify-start">
			<Head />
			<SiteNav />

			<Toaster />

			<div className="container mx-auto p-10">
				{children}
			</div>

			<Footer />
		</main>
	);
}