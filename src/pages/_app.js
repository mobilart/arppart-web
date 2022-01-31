import SnackbarProvider from "react-simple-snackbar"
import "../styles/globals.css"
import "../styles/normalize.css"

function MyApp({ Component, pageProps }) {
	return (
		<SnackbarProvider>
			<link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'></link>
			<Component {...pageProps} />
		</SnackbarProvider>
	)
}

export default MyApp
