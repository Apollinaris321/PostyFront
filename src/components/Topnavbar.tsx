import { Container, Navbar } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import "../index.css"
import { userContext } from "../user";
import { useContext } from "react";
import { Auth, Logout } from "./Auth";

export default function TopNavbar() {
    const {user} = useContext(userContext)

    return(
        <div className="all">
            <Navbar bg="primary" data-bs-theme="light">
                <Container fluid >
                    <div></div>
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