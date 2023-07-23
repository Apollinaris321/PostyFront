import { Container, Navbar } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import { userContext } from "../user";
import { useContext } from "react";
import { Auth, Logout } from "./Auth";
import "../index.css"

export default function TopNavbar() {
    const {user} = useContext(userContext)

    return(
        <div className="all">
            <Navbar bg="primary" data-bs-theme="light">
                <Container fluid >
                    <Link to="../" className="customLink">
                        Back
                    </Link>
                    <Link className="customLink" to="/">
                        Home
                    </Link>
                    <div className="logout">
                        {
                            user ? 
                            <Logout></Logout>
                            :
                            <Auth></Auth>
                        }
                    </div>
                </Container>
            </Navbar>
            <Outlet></Outlet>
        </div>
    )
}