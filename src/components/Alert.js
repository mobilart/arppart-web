import React from "react"
import Image from "next/image"
import closeBtn from "../../public/assets/close.svg"
import styles from "../styles/components/alert.module.css"

export default function Alert({ setIsOpenedAlert }) {

	return (
		<div className={styles.center}>
			<div className={styles.container}>
				<div className={styles["container-text"]}>
					<p>This tile already taken by someone!</p>
					<p>Try another project!</p>
				</div>
				<div className={styles["container-img"]}>
					<Image
						alt="close icon"
						src={closeBtn}
						width="36px"
						height="36px"
						onClick={() => setIsOpenedAlert(false)} 
					/>
				</div>
			</div>
		</div>
	)

}
