import { Container, Navbar } from "react-bootstrap";
import { Link, Outlet, useLocation } from "react-router-dom";
import { userContext } from "../user";
import { useContext } from "react";
import { Auth, Logout } from "./Auth";
import { ArrowBack } from "@mui/icons-material";
import "../index.css"

export default function TopNavbar() {
    const {user} = useContext(userContext)
    const location = useLocation();

    return(
        <div className="all">
            <Navbar bg="primary" data-bs-theme="light">
                <Container fluid >
                    {
                        location.pathname == "/" ? <div></div> : 
                        <Link to="../" className="customLink">
                            <ArrowBack></ArrowBack>
                        </Link>
                    }
                    <Link className="customLink" to="/">
                        Posty
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