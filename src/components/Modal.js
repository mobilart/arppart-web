import React, { useState } from "react"
import axios from "axios"
import Image from "next/image"
import Link from "next/link"
import ReactLoading from "react-loading"
import { useSnackbar } from "react-simple-snackbar"
import closeBtn from "../../public/assets/close.svg"
import styles from "../styles/pages/forgot-password.module.css"

const { NEXT_PUBLIC_API_URL } = process.env
export default function Modal({ setIsOpenedModal }) {
	const [openSnackbar] = useSnackbar()
	const [email, setEmail] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [invalidEmail, setInvalidEmail] = useState("")

	const handleSubmit = async () => {
		try {
			setIsLoading(true)
			setInvalidEmail(false)
			const body = { email }
			const config = { headers: {"Content-Type": "application/json"} }
			await axios.post(`${NEXT_PUBLIC_API_URL}/authentication/forgot`, body, config)
			setInvalidEmail(false)
			openSnackbar("Your password email is on it’s way!")
		} catch(error) {
			if(error.response?.status == 400) return setInvalidEmail(true)			
			openSnackbar("Error when try to access server, verify your network and contact your administrator.")
			setInvalidEmail(false)
		} finally {
			setIsLoading(false)
		}
	}
  
	return (
		<form
			className={styles["form-resend-email"]}
			onSubmit={(event) => {
				event.preventDefault()
				handleSubmit()
			}}
		>
			<div className={styles["title-resend-email-form"]}>
				<p className={styles["resend-email-paragraph"]}> Your password email is on it’s way! Didn’t get it? Let’s try that again. </p>

				<div className={styles["close-btn"]}>
					<Image
						alt="Close button"
						src={closeBtn}
						onClick={() => setIsOpenedModal(false)}
					/>
				</div>
			</div>

			<div className={styles["input-email-container"]}>
				<p className={styles["resend-email-label"]}>Username | Email Address</p>
				<input 
					className={`form-input ${styles["form-resend-email-input"]}`} 
					id="input-email" 
					type="text" 
					placeholder="Username | Email Address"
					value={email}
					onChange={(event) => setEmail(event.target.value)}
				/>

				{invalidEmail && <p className={styles["forms-resend-email-error-msg"]}>Email/username not found!</p>}
			</div>

			<button className="form-btn" type="submit">
				{isLoading ? <ReactLoading className="loading" type="bubbles" color="#FFFFFF"/> : "Resend email"}
			</button>

			<div className={styles["footer-form-resend-email"]}>
				<p> Want to join this project? <strong>Click here</strong>. Otherwise, close this window or <Link href="/"><strong>Log in here</strong></Link>.</p>
			</div>

		</form>
	)
}
