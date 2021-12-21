import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import axios from "axios"
import { useSnackbar } from "react-simple-snackbar"
import ReactLoading from "react-loading"
import Footer from "../components/Footer"
import loginLogo from "../../public/assets/login-logo.svg"
import styles from "../styles/pages/login.module.css"

const { NEXT_PUBLIC_API_URL } = process.env
export default function Login() {
	const router = useRouter()
	const [openSnackbar] = useSnackbar()
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [failLoginMsg, setFailLoginMsg] = useState(false)

	useEffect(async () => {
		const { error } = router.query
		if (error) openSnackbar("Error when try to access server, verify your network and contact your administrator.")
		router.replace("/")
	}, [router.isReady])

	const handleSubmit = async (event) => {
		event.preventDefault()
		try {
			setFailLoginMsg(false)
			setIsLoading(true)
			const body = { email, password, clientKey: 1 }
			const config = { headers: { "Content-Type": "application/json" } }
			const response = await axios.post(`${NEXT_PUBLIC_API_URL}/authentication/login`, body, config)
			localStorage.setItem("userData", JSON.stringify(response.data))
			if (response.data.hasInProgressProject) return router.push("projects/current-tile")
			router.push("/projects")
		} catch (error) {
			const { data, status } = error.response || {}
			if (data?.responseCode == -3017) return openSnackbar(error.response.data.message)
			if ([400, 401, 404].includes(status)) return setFailLoginMsg(true)
			openSnackbar("Error when try to access server, verify your network and contact your administrator.")
			setFailLoginMsg(false)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="page-container">
			<div className="form-container">

				<div style={{margin: "0 auto 50px"}}>
					<Image className="logo" src={loginLogo} alt="Logo login" />
				</div>

				<form className="form" onSubmit={handleSubmit}>

					<div className="input-container">
						<input
							className="form-input"
							type="text"
							placeholder="Email"
							value={email}
							onChange={(event) => { setEmail(event.target.value) }}
						/>
					</div>

					<div className="input-container">
						<input
							className="form-input"
							type="password"
							placeholder="Password"
							value={password}
							onChange={(event) => { setPassword(event.target.value) }}
						/>

						<div className={styles["forgot-password"]}>
							<Link href="/forgot-password" >
								<a>Forgot password?</a>
							</Link>
						</div>
					</div>

					<button className="form-btn" type="submit" data-tip="Submit tile to project">
						{isLoading ? <ReactLoading className="loading" type="bubbles" color="#FFF" /> : "Log In"}
					</button>

					{failLoginMsg && <p className={`forms-error-msg ${styles["login-error-msg"]}`}>Invalid Email/Username or password!</p>}
				</form>
			</div>

			<Footer />
		</div>
	)
}
