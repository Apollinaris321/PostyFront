import {  useState } from "react"
import { MdLogin } from "react-icons/md"
import { IconContext } from "react-icons/lib/esm/iconContext"
import { useNavigate } from "react-router-dom"

export function Login(){
    const [show, setShow] = useState(false)
    const navigate = useNavigate()

    function handleLogin(){
        navigate("/login")
    }

    return(
        <div>
            <button className="btn d-flex flex-row gap-1 align-items-center justify-content-center" onClick={handleLogin}>
                <div className="navbartext">
                    Login
                </div>
                <div>
                    <IconContext.Provider value={{color: "white"}}>
                        <MdLogin></MdLogin>
                    </IconContext.Provider>
                </div>
            </button>
        </div>
    )
}
