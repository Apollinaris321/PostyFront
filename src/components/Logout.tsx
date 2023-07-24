import { useContext } from "react";
import { IconContext } from "react-icons";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { client } from "../api";
import { userContext } from "../user";

export function Logout(){
    const {user, setUser} = useContext(userContext)
    const navigate = useNavigate();

    async function handleLogout(){
        try{
            const response = await client.get("Profile/logout")
            console.log("reigster resp: ", response.data);
            setUser(null)
            navigate("/")
        }catch(error){
            console.log("logout error: ", error);
        }
    }

    return(

        <div>
            <button className="btn d-flex gap-1 flex-row align-items-center justify-content-center" onClick={handleLogout}>
                <div className="navbartext">
                    Logout
                </div>
                <IconContext.Provider value={{color: "white"}}>
                    <MdLogout ></MdLogout>
                </IconContext.Provider>
            </button>
        </div>
    )
}