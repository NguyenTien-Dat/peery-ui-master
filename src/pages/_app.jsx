import '@/styles/globals.css'
import { NextUIProvider } from '@nextui-org/react'

import { fas } from '@fortawesome/free-solid-svg-icons'
// import { fab } from '@fortawesome/free-brands-svg-icons'
// import { far } from '@fortawesome/free-regular-svg-icons'
const { library } = require('@fortawesome/fontawesome-svg-core')

library.add(fas)

export default function App({ Component, pageProps }) {
	return (
		<NextUIProvider>
			<Component {...pageProps} />
		</NextUIProvider>
	)
}
