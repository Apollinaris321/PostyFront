import axios from "axios"
import {client} from '../api'
import { useState } from "react"
import { Button, ButtonGroup, Form, Modal, ToggleButton } from "react-bootstrap"

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
    const [register, setRegister] = useState(false)
    const [errorMsg, setErrorMsg] = useState<AuthError>({...defaultError})
    const [show, setShow] = useState(false)


    function handleClose(){
        setErrorMsg({...defaultError})
        setShow(false)
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
        let errorMsg = {...defaultError}
        
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
            console.log("reigster resp: ", response.data);
            setShow(false)
        }catch(error : any){
            handleErrors(error)
        }
    }

    async function handleRegister(){
        try{
            const response = await client.post("/Profile/register",{username : username, email : email, password : password})
            console.log("reigster resp: ", response.data);
            setShow(false)
        }catch(error : any){
            handleErrors(error)
        }
    }

    return(
        <div>
            <Button onClick={() => setShow(show ? false : true)}>Login</Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <ButtonGroup>
                        <ToggleButton
                          id={`radio-login`}
                          type="radio"
                          variant={'outline-primary'}
                          name="radio"
                          value="register"
                          checked={true == register}
                          onChange={(e) => setRegister(true)}
                        >
                            Register
                        </ToggleButton>
                        <ToggleButton
                          id={`radio-register`}
                          type="radio"
                          variant={'outline-primary'}
                          name="radio"
                          value="login"
                          checked={false == register}
                          onChange={(e) => setRegister(false)}
                        >
                            Login
                        </ToggleButton>
                    </ButtonGroup>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {
                            register ? 
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    {
                                        errorMsg.Email.length > 0 ? 
                                        <div>{errorMsg.Email}</div>
                                        : null
                                    }
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" onChange={handleEmailChange} value={email} />
                                </Form.Group>
                            :
                                null
                        }
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                            {
                                errorMsg.Username.length > 0 ? 
                                <div>{errorMsg.Username}</div>
                                : null
                            }
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" onChange={handleUsernameChange} value={username}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                            {
                                errorMsg.Password.length > 0 ? 
                                <div>{errorMsg.Password}</div>
                                : null
                            }
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" onChange={handlePasswordChange} value={password}/>
                        </Form.Group>
                    </Form>               
                    {
                        errorMsg.Register != "" ? 
                        <div>{errorMsg.Register}</div>
                        : null
                    }
                    {
                        errorMsg.Login != "" ? 
                        <div>{errorMsg.Login}</div>
                        : null
                    }
                </Modal.Body>
                <Modal.Footer>
                    {
                        register ? 
                        <Button onClick={handleRegister} variant="primary">register</Button>
                        :
                        <Button onClick={handleLogin} variant="primary">login</Button>
                    }
                    <Button onClick={handleClose} variant="secondary">Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export function Logout(){

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
            <Button onClick={handleLogout} variant="primary">logout</Button>
        </div>
    )
}