import React, { useState } from "react"
import Image from "next/image"
import axios from "axios"
import { useRouter } from "next/router"
import { useSnackbar } from "react-simple-snackbar"
import ReactLoading from "react-loading"
import Footer from "../components/Footer"
import createAccLogo from "../../public/assets/arpp-logo-create-acc.svg"

const { NEXT_PUBLIC_API_URL } = process.env
export default function ResetPassword() {
	const router = useRouter()
	const [openSnackbar] = useSnackbar()
	const [newPassword, setNewPassword] = useState("")
	const [confirmNewPassword, setConfirmNewPassword] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [failPasswordSecurityMsg, setFailPasswordSecurityMsg] = useState(false)
	const [failPasswordEqualMsg, setFailPasswordEqualMsg] = useState(false)

	const haveErrorsInForm = () => {
		let haveErrors = false
		if (newPassword.length < 8 || !newPassword.match(/[A-Z]+/) || !newPassword.match(/\W+/)) {
			haveErrors = true
			setFailPasswordSecurityMsg(true)
		} else {
			setFailPasswordSecurityMsg(false)
		}
		if (newPassword !== confirmNewPassword) {
			haveErrors = true
			setFailPasswordEqualMsg(true)
		} else {
			setFailPasswordEqualMsg(false)
		}
		return haveErrors
	}

	const handleSubmit = async () => {
		try {
			setIsLoading(true)
			const { uuid } = router.query
			const body = { uuid, password: newPassword }
			const config = { headers: { "Content-Type": "application/json" } }
			await axios.put(`${NEXT_PUBLIC_API_URL}/authentication/reset`, body, config)
			router.push("/?password-reset=true")
		} catch (error) {
			if (error.response?.data?.responseCode) return openSnackbar(error.response.data.message)
			openSnackbar("Error when try to access server, verify your network and contact your administrator.")
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="page-container">
			<div className="form-container">

				<div className="logo" style={{margin: "0 auto 50px"}}>
					<Image
						alt="Logo login"
						height="191"
						src={createAccLogo}
						width="191"
					/>
				</div>

				<form
					className="form"
					onSubmit={(event) => {
						event.preventDefault()
						const haveErrors = haveErrorsInForm()
						if (!haveErrors) handleSubmit()
					}}
				>
					<div className="input-container">
						<label className="form-label">Username | Email Address</label>
						<input
							className="form-input"
							type="password"
							placeholder="Enter password"
							value={newPassword}
							onChange={(event) => setNewPassword(event.target.value)}
						/>
						{failPasswordSecurityMsg && <p className={"forms-error-msg"}>Min 8 characters, 1 uppercase letter, 1 special character</p>}
					</div>

					<div className="input-container">
						<input
							className="form-input"
							type="password"
							placeholder="Confirm password"
							value={confirmNewPassword}
							onChange={(event) => setConfirmNewPassword(event.target.value)}
						/>
						{failPasswordEqualMsg && <p className={"forms-error-msg"}>Passwords do not match!</p>}
					</div>

					<button className="form-btn" type="submit">
						{isLoading ? <ReactLoading className="loading" type="bubbles" color="#FFFFFF" /> : "Register"}
					</button>
				</form>
			</div>

			<Footer />
		</div>
	)
}
