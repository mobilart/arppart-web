import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Image from "next/image"
import axios from "axios"
import FileSaver from "file-saver"
import ReactLoading from "react-loading"
import ReactTooltip from "react-tooltip"
import { useSnackbar } from "react-simple-snackbar"

import Alert from "../components/Alert"
import styles from "../styles/pages/projectsIds.module.css"
import pencil from "../../public/assets/pencil.svg"
import download from "../../public/assets/download.svg"
import upload from "../../public/assets/upload.svg"
import logout from "../../public/assets/white-logout.svg"

const { NEXT_PUBLIC_API_URL } = process.env
export default function Projects({ haveProject }) {
	const router = useRouter()
	const [openSnackbar] = useSnackbar()
	const [title, setTitle] = useState("")
	const [readonlyTitle, setReadonlyTitle] = useState(true)
	const [project, setProject] = useState({})
	const [file, setFile] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [fileError, setFileError] = useState(false)
	const [isOpenedAlert, setIsOpenedAlert] = useState(false)

	useEffect(async () => {
		try {
			if (!router.isReady) return
			const { projectId, tileId } = router.query
			const userData = JSON.parse(localStorage.getItem("userData"))
			const config = { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userData.accessToken}` } }
			const path = haveProject ? "/api/v1/arpp-art/project/current-tile" : `/api/v1/arpp-art/project/${projectId}/tile/${tileId}`
			const response = await axios.get(`${NEXT_PUBLIC_API_URL}${path}`, config)
			setProject(response.data)
			setTitle(response.data.title)
		} catch (error) {
			if (error.response?.body?.responseCode == "-9001") router.push("/projects?responseCode=-9001")
			router.push("/?error=true")
		}
	}, [router.isReady])

	const downloadFile = async () => {
		try {
			const { projectId, tileId } = project
			setIsLoading(true)
			const userData = JSON.parse(localStorage.getItem("userData"))
			const config = { headers: { "Authorization": `Bearer ${userData.accessToken}`, responseType: "blob" } }
			const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/v1/arpp-art/project/${projectId}/download/${tileId}`, config)
			if(response.status !== 200) throw await response.json()
			const blob = await response.blob()
			FileSaver(blob, `project_${projectId}_template_tile_${tileId}.png`)
			localStorage.setItem("userData", JSON.stringify({ ...userData, hasInProgressProject: true }))
		} catch (error) {
			console.log(error.response)
			if (error.responseCode == "-3023") return setIsOpenedAlert(true)
			if (error.responseCode) return openSnackbar(error.message)
			openSnackbar("Error when try to access server, verify your network and contact your administrator.")
		} finally {
			setIsLoading(false)
		}
	}

	const uploadFile = async () => {
		try {
			if (!file) return openSnackbar("Please upload the file to proceed.")
			setIsLoading(true)
			setFileError(false)
			const { projectId, tileId } = project
			const userData = JSON.parse(localStorage.getItem("userData"))
			const config = { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userData.accessToken}` } }
			const formData = new FormData()
			formData.append("file", file, `project_${projectId}_template_tile_${tileId}.png`)
			await axios.put(`${NEXT_PUBLIC_API_URL}/api/v1/arpp-art/project/${projectId}/upload/${tileId}`, formData, config)
			localStorage.setItem("userData", JSON.stringify({ ...userData, hasInProgressProject: false }))
			router.push("/projects?success=true")
		} catch (error) {
			if (error.response?.status === 500) return openSnackbar("Internal error, please contact your administrator")
			if (error.response?.data) {
				openSnackbar(error.response.data.message)
				return setFileError(true)
			}
			openSnackbar("Error when try to access server, verify your network and contact your administrator.")
		} finally {
			setIsLoading(false)
		}
	}

	const editMode = () => {
		return readonlyTitle
			?<h1 className={styles.title}>{title}</h1>
			:<input
				value={title}
				onChange={(evt) => setTitle(evt.target.value)}
				onBlur={closeEditMode}
				className={styles["title-input"]}
				style={{width:`${title.length * 1.2}ch`, maxWidth: "50vw"}}
				autoFocus
			/>
	}

	const closeEditMode = (evt) => {
		if(!evt.target.value || title === project.title) setTitle(project.title)
		else updateTitle()
		setReadonlyTitle(true)
	}

	const updateTitle = async () => {
		try {
			const { projectId } = project
			const userData = JSON.parse(localStorage.getItem("userData"))
			const config = { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userData.accessToken}` } }
			const response = await axios.put(`${NEXT_PUBLIC_API_URL}/api/v1/arpp-art/project/${projectId}?title=${title}`, {}, config)
			openSnackbar("Project title changed.")
			setProject({ ...project, title: response.data })
			setTitle(response.data)
		} catch (error) {
			if (error.response?.status === 500) return openSnackbar("Internal error, please contact your administrator")
			if (error.response?.data) return openSnackbar(error.response.data.message)
			openSnackbar("Error when try to access server, verify your network and contact your administrator.")
		}
	}

	const logoutUser = () => {
		localStorage.setItem("userData", null)
		router.push("/")
	}

	return (
		<>
			{isOpenedAlert && <Alert setIsOpenedAlert={setIsOpenedAlert}/>}

			<div className={styles.container}>
				<ReactTooltip delayShow={1000} effect="solid" place="top" type="light" />
				<header className={styles.header}>
					<div />
					<div className={styles["content-title"]}>
						{editMode()}
						<Image alt="Pencil icon" className={styles["pencil-icon"]} src={pencil} data-tip="Edit project tile" onClick={() => readonlyTitle && setReadonlyTitle(false)} />
					</div>
					<div className={styles.logout}>
						<Image
							alt="Logout icon"
							data-tip="Logout"
							src={logout}
							onClick={logoutUser} 
						/>
					</div>
				</header>
				{haveProject && <p className={styles["colored-text"]}>Please complete your joined project before proceeding to others</p>}
				{!project.displayUrl ?
					<ReactLoading className={styles["tile-img-loading"]} type="spinningBubbles" color="#FFFFFF" />
					:
					<div className={styles.content}>
						<div className={styles["tile-img-container"]}>
							{project &&
						<img
							alt="Tile"
							src={file ? URL.createObjectURL(file) : project.displayUrl}
							className={styles["tile-img"]}
						/>}
							<p className={styles["counter-parts"]}>{project.currentSeq} of {project.tileCount}</p>
						</div>

						<div className={styles["art-container"]}>
							<div className={styles["image-uploaded-container"]}>
								<img
									src={project.minimapUrl}
									width="100%"
									height="100%"
									alt={`project-id-${project.projectId}`}
								/>
							</div>
							<div className={styles["form-container"]}>
								<div className={styles["download-upload-container"]}>
									<label>
										<Image
											alt="Download button"
											width="36px"
											height="36px"
											data-tip="Download tile"
											className={styles["btn-container"]}
											onClick={downloadFile}
											type="file"
											accept=".png"
											src={download}
										/>
									</label>

									<label htmlFor="file-input">
										<Image
											alt="Upload button"
											width="36px"
											height="36px"	
											data-tip="Upload tile"
											className={styles["btn-container"]}
											src={upload}
										/>
										<input id="file-input" type="file" accept="image/png, image/tiff, image/jpeg" className={styles["file-input"]} onChange={(event) => {if(event.target.files[0]) setFile(event.target.files[0])}} />
									</label>
								</div>

								{/* <p className={styles["filename"]}>{file?.name}</p> */}

								<div className={styles["unable-upload-container"]}>
									{fileError && <p className={styles["unable-upload"]}> Please re-upload with original PNG format and dimensions. </p>}
								</div>

								<button className={styles["done-btn"]} type="button" data-tip="Submit tile to project" onClick={uploadFile}>
									{isLoading ? <ReactLoading className="loading" type="bubbles" color="#FFFFFF" /> : "Done"}
								</button>
							</div>
						</div>
					</div>
				}
			</div>
		</>
	)
}
