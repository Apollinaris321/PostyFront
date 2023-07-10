import axios from "axios"
import { useState } from "react"

export function Auth(){
    const [username, setUsername] = useState("string")
    const [password, setPassword] = useState("string")
    const [email, setEmail] = useState("user@example.com")

    function handlePasswordChange(e : React.FormEvent<HTMLInputElement>){
        setPassword(e.currentTarget.value)
    }

    function handleUsernameChange(e : React.FormEvent<HTMLInputElement>){
        setUsername(e.currentTarget.value)
    }

    function handleEmailChange(e : React.FormEvent<HTMLInputElement>){
        setEmail(e.currentTarget.value)
    }

    async function handleLogin(){
        try{
            const response = await axios.post("https://localhost:7226/api/Profile/login",{username : username,password : password},{withCredentials: true})
            console.log("reigster resp: ", response.data);
        }catch(error){
            console.log("login error: ", error);
        }
    }

    async function handleRegister(){
        try{
            const response = await axios.post("https://localhost:7226/api/Profile/register",{username : username, email : email, password : password},{withCredentials: true})
            console.log("reigster resp: ", response.data);
        }catch(error){
            console.log("register error: ", error);
        }
    }

    async function handleLogout(){
        try{
            const response = await axios.get("https://localhost:7226/api/Profile/logout",{withCredentials: true})
            console.log("reigster resp: ", response.data);
        }catch(error){
            console.log("logout error: ", error);
        }
    }

    return(
        <div>
            <button onClick={handleLogout}>logout</button>
            <button onClick={handleRegister}>register</button>
            <button onClick={handleLogin}>login</button>
            <div>
                Username: <input onChange={handleUsernameChange} value={username}></input>
            </div>
            <div>
                Password: <input onChange={handlePasswordChange} value={password}></input>
            </div>
            <div>
                Email: <input onChange={handleEmailChange} value={email}></input>
            </div>
        </div>
    )
}