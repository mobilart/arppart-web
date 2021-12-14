import React, { useState, useEffect } from "react"
import axios from "axios"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useSnackbar } from "react-simple-snackbar"
import ReactTooltip from "react-tooltip"
import logout from "../../public/assets/logout.svg"
import completed from "../../public/assets/completed.png"
import remaining from "../../public/assets/remaining.png"
import nextTile from "../../public/assets/next-tile.png"
import styles from "../styles/pages/projects.module.css"

const { NEXT_PUBLIC_API_URL } = process.env
export default function Projects({ path, title, haveProject }) {
	const router = useRouter()
	const [openSnackbar] = useSnackbar()
	const [projects, setProjects] = useState([])
	
	useEffect(async () => {
		try {
			const { success } = router.query
			if(success) {
				openSnackbar("Success to upload file.")
				router.replace("/projects")	
			}
			const userData = JSON.parse(localStorage.getItem("userData"))
			if(userData.hasInProgressProject !== haveProject) return router.push("/")
			const config = { headers: {"Content-Type": "application/json", "Authorization": `Bearer ${userData.accessToken}`} }
			const response = await axios.get(`${NEXT_PUBLIC_API_URL}${path}`, config)
			setProjects(response.data)
		} catch (error) {
			router.push("/?error=true")
		}
	}, [router.isReady])
	
	const listProjects = () =>{
		return projects
			.map(el => (
				<div key={`${el.projectId}${el.tileId}`} className={styles.item}>
					<img
						layout="responsive"
						width="100%"
						height="100%"
						alt={`project-id-${el.projectId}`}
						src={el.displayUrl}
						onClick={() => {redirectToProject(el)}}
					/>
				</div>
			))
	}

	const listMyProjects = () => {
		const initializedProject = projects.find(el => el.tileStatus === "INITIALIZED")
		// Removing historical of the user
		// const finishedProjects = projects.filter(el => el.tileStatus === "FINISHED")
		const finishedProjects = []
		if(!projects.length) return
		console.log(initializedProject, finishedProjects)	
		return (
			<div className={styles.list}>
				<div className={styles.item}>
					<Link href={"/projects/my-tile"}>
						<img
							style={{"borderStyle": "solid"}}
							layout="responsive"
							width="100%"
							height="100%"
							alt={`project-id-${initializedProject.projectId}`}
							src={initializedProject.displayUrl}
						/>
					</Link>
				</div> 
				{finishedProjects.map(el => (
					<div key={el.projectId} className={styles["item-finished"]}>
						<img
							layout="responsive"
							width="100%"
							height="100%"
							alt={`project-id-${el.projectId}`}
							src={el.displayUrl}
						/>
					</div>
				))}
			</div>
		)
	}

	const redirectToProject = (project) => {
		router.push(`/projects/${project.projectId}/${project.tileId}`)
	}

			
	const logoutUser = () => {
		localStorage.setItem("userData", null)
		router.push("/")
	}
			
	return (
		<div className={styles.container}>
			<ReactTooltip delayShow={1000} effect="solid" place="top"/>
			<header className={styles["header"]}>
				<div className={styles.logout}>
					<Image
						alt="Logout icon"
						src={logout}
						data-tip="Logout"
						width="100%"
						onClick={logoutUser}
					/>
				</div>
				<h1 className={styles.h1} style={{color: haveProject && "#CD7A4E"}}>{title}</h1>
			</header>
			<div className={styles.list}>
				{haveProject ? listMyProjects() : listProjects()}
			</div>
			<div className={styles["subtitle-container"]}>
				<div className={styles.subtitle}>
					<Image
						alt="Subtitle remaining"
						height="50%"
						src={remaining}
						width="50%"
					/>
					<span>Remaining</span>
				</div>
				
				<div className={styles.subtitle}>
					<Image
						alt="Subtitle next tile"
						height="50%"
						src={nextTile}
						width="50%"
					/>
					<span>Next Tile</span>
				</div>
				
				<div className={styles.subtitle}>
					<Image
						alt="Subtitle completed"
						height="50%"
						src={completed}
						width="50%"
					/>
					<span>Completed</span>
				</div>
			</div>
		</div>
	)
}
			