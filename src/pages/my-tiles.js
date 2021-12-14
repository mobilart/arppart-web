import ListProjects from "../components/ListProjects"

export default function Projects() {
	return( <ListProjects path="/api/v1/arpp-art/project/my-tiles" title="Please complete your joined project before proceeding to others" haveProject={true}/> )
}