import React from "react";
import Head from "next/head";

export default function PageHead({ title }) {
	return (
		<Head>
			<title>{title ?? 'Peery'}</title>
			<meta key="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
			<link href="/favicon.ico" rel="icon" />
		</Head>
	);
};