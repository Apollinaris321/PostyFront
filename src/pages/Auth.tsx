import { FormEvent, useContext, useEffect, useState } from "react"
import { userContext } from "../user"
import { client } from "../api"
import { useNavigate } from "react-router-dom"

type AuthError = {
    Username : string[],
    Email : string[],
    Password : string[],
    Register : string,
    Login : string
}

export function Auth(){
    const defaultError = {Username : [], Email : [], Password : [], Login : "", Register: ""}
    const [username, setUsername] = useState("string")
    const [password, setPassword] = useState("string")
    const [email, setEmail] = useState("user@example.com")

    const [errorMsg, setErrorMsg] = useState<AuthError>({...defaultError})
    const [register, setRegister] = useState(false)
    const {user, setUser} = useContext(userContext)
    const navigate = useNavigate();

    function deleteErrors(){
        setErrorMsg({...defaultError})
    }

    function handlePasswordChange(e : React.ChangeEvent<HTMLInputElement>){
        setPassword(e.currentTarget.value)
    }

    function handleUsernameChange(e : React.ChangeEvent<HTMLInputElement>){
        setUsername(e.currentTarget.value)
    }

    function handleEmailChange(e : React.ChangeEvent<HTMLInputElement>){
        setEmail(e.currentTarget.value)
    }

    function handleErrors(e : any){
        console.log("error: ", e);
        let errorMsg = {Username : [], Email : [], Password : [], Login : "", Register: ""} as AuthError
        
        if(!("errors" in e.response.data)){
            return;
        }
        const error  = e.response.data.errors
        if("Username" in error){
            console.log("username error: ", error );
            errorMsg = {...errorMsg, Username : error.Username }
        }
        if("Password" in error){
            console.log("password error: ", error );
            errorMsg = {...errorMsg, Password : error.Password }
        }
        if("Email" in error){
            console.log("email error: ", error );
            errorMsg = {...errorMsg, Email : error.Email } 
        }
        if("register" in error){
            console.log("register error: ", error );
            errorMsg = {...errorMsg, Register : error.register }
        }
        if("login" in error){
            console.log("login error: ", error );
            errorMsg = {...errorMsg, Login : error.login }
        }
        setErrorMsg({...errorMsg})
    }

    async function handleLogin(){
        try{
            const response = await client.post("Profile/login",{username : username,password : password})
            console.log("reigster resp: ", response);
            setUser({...response.data})
            navigate("/")
        }catch(error : any){
            handleErrors(error)
        }
    }

    async function handleRegister(){
        try{
            const response = await client.post("/Profile/register",{username : username, email : email, password : password})
            console.log("reigster resp: ", response.data);
            setUser(response.data)
            navigate("/")
        }catch(error : any){
            handleErrors(error)
        }
    }

    function handleSubmit(e : FormEvent<HTMLFormElement>){
        e.preventDefault()
        if(register){
            handleRegister()
        }else{
            handleLogin()
        }
    }

    return(
        <div className="row h-100">
            <div className="col"></div>
            <div className="col-8 d-flex justify-content-center align-items-center">
                <div>
                    <form className="row gap-3 loginForm" onSubmit={handleSubmit}>
                        <div className="d-flex flex-row align-items-center justify-content-center gap-1">
                            <button type="button" className={register ?  "btn btn-primary" : "btn btn-outline-primary"} onClick={() => {setRegister(true);deleteErrors()}}>register</button>
                            <button type="button" className={register ?  "btn btn-outline-primary" : "btn btn-primary"} onClick={() => {setRegister(false);deleteErrors()}}>login</button>
                        </div>
                        <div className="d-flex flex-column gap-1 justify-content-center align-items-center">

                            <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                                {
                                    errorMsg.Username.length > 0 ? 
                                    <div className="error smallFont">{errorMsg.Username}</div>
                                    : null
                                }
                                <div className="form-floating w-75">
                                    <input type="text" className="form-control" id="floatingInput" placeholder="Max Mustermann" onChange={handleUsernameChange} value={username}/>
                                    <label htmlFor="floatingInput">Username</label>
                                </div>
                            </div>
                            {
                                register ? 

                                <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                                    {
                                        errorMsg.Email.length > 0 ? 
                                        <div className="error smallFont">{errorMsg.Email}</div>
                                        : null
                                    }
                                    <div className="form-floating w-75">
                                        <input type="email" className="form-control" id="floatingEmail" placeholder="Email" onChange={handleEmailChange} value={email}/>
                                        <label htmlFor="floatingEmail">Email</label>
                                    </div>
                                </div>
                                    : 
                                    <div></div>
                            }
                            <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                                {
                                    errorMsg.Password.length > 0 ? 
                                    <div className="error smallFont">{errorMsg.Password}</div>
                                    : null
                                }
                            <div className="form-floating w-75">
                                <input type="password" className="form-control" id="floatingPassword" placeholder="Password" onChange={handlePasswordChange} value={password}/>
                                <label htmlFor="floatingPassword">Password</label>
                            </div>
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-center">
                            {
                                errorMsg.Register != "" ? 
                                <div className="error smallFont">{errorMsg.Register}</div>
                                : null
                            }
                            {
                                errorMsg.Login != "" ? 
                                <div className="error smallFont">{errorMsg.Login}</div>
                                : null
                            }
                        </div>
                        <div className="d-flex flex-row align-items-center justify-content-center gap-1">
                            {
                                register ? 
                                    <button className="btn btn-primary" onClick={handleRegister}>register</button>
                                :
                                    <button className="btn btn-primary" onClick={handleLogin}>login</button>
                            }
                        </div>
                    </form>
                </div>
            </div>
            <div className="col"></div>
        </div>
    )
}