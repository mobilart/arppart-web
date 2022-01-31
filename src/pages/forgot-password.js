import React, { useState } from "react"
import Image from "next/image"
import axios from "axios"
import ReactLoading from "react-loading"
import { useSnackbar } from "react-simple-snackbar"
import Footer from "../components/Footer"
import Modal from "../components/Modal"
import forgotPwLogo from "../../public/assets/arpp-logo-create-acc.svg"
import styles from "../styles/pages/forgot-password.module.css"

const { NEXT_PUBLIC_API_URL } = process.env
export default function ForgotPassword() {
	const [openSnackbar] = useSnackbar()
	const [email, setEmail] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [invalidEmail, setInvalidEmail] = useState(false)
	const [openedModal, setIsOpenedModal] = useState(false)

	const handleSubmit = async (event) => {
		event.preventDefault()
		try {
			setIsLoading(true)
			setInvalidEmail(false)
			const body = { email }
			const config = { headers: { "Content-Type": "application/json" } }
			await axios.post(`${NEXT_PUBLIC_API_URL}/authentication/forgot`, body, config)
			setInvalidEmail(false)
			setIsOpenedModal(true)
		} catch (error) {
			if (error.response?.status == 400) return setInvalidEmail(true)
			openSnackbar("Error when try to access server, verify your network and contact your administrator.")
			setInvalidEmail(false)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="page-container">
			<div className="form-container">

				<div className="logo">
					<Image
						alt="Logo login"
						height="188"
						src={forgotPwLogo}
						width="191"
					/>
				</div>

				<p className={styles.paragraph}> Enter your email or username below, and we&apos;ll email you a password reset link. </p>

				{openedModal && <Modal setIsOpenedModal={setIsOpenedModal} />}

				<form className="form" onSubmit={handleSubmit}>
					<div className="input-container">
						<label className="form-label">Username | Email Address</label>
						<input
							className="form-input"
							id="input-email"
							type="text"
							placeholder="Username | Email Address"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
						/>

						{invalidEmail && <p className="forms-error-msg">Email/username not found!</p>}
					</div>

					<button className={`form-btn ${styles["send-btn"]}`} type="submit">
						{isLoading ? <ReactLoading className="loading" type="bubbles" color="#FFFFFF" /> : "Send email"}
					</button>
				</form>

			</div>
			<Footer />
		</div>
	)
}
