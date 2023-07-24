import { Link, Outlet, useLocation } from "react-router-dom";
import { userContext } from "../user";
import { useContext } from "react";
import {  Login } from "./Login";
import { MdChat } from "react-icons/md";
import { IconContext } from "react-icons";
import "../index.css"
import { Logout } from "./Logout";

export default function TopNavbar() {
    const {user} = useContext(userContext)
    const location = useLocation();

    return(
        <div className="home">
            <div className="d-flex flex-row bg-black justify-content-between align-items-center">
                <div className=""></div>
                <div className="">
                    <Link className="linkText colorW d-flex flex-row justify-content-center align-items-center gap-1" to="/">
                        <IconContext.Provider value={{style:{transform: "rotate(20deg)"},size:"2em"}} >
                            <MdChat></MdChat>
                        </IconContext.Provider>
                        <div className="fs-2">
                            Posty
                        </div>
                    </Link>
                </div>
                <div>
                    {
                        user ? 
                        <Logout></Logout>
                        :
                        <Login></Login>
                    }
                </div>
            </div>
            <Outlet></Outlet>
        </div>
    )
}