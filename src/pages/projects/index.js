import ListProjects from "../../components/ListProjects"

export default function Projects() {
	return( <ListProjects path="/api/v1/arpp-art/project" title="Select a project to join" haveProject={false}/> )
}