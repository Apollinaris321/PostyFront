import axios from "axios"
import { useState } from "react"
import { Button, ButtonGroup, Form, Modal, ToggleButton } from "react-bootstrap"

export function Auth(){
    const [username, setUsername] = useState("string")
    const [password, setPassword] = useState("string")
    const [email, setEmail] = useState("user@example.com")
    const [register, setRegister] = useState(false)

    function handlePasswordChange(e : React.ChangeEvent<HTMLInputElement>){
        setPassword(e.currentTarget.value)
    }

    function handleUsernameChange(e : React.ChangeEvent<HTMLInputElement>){
        setUsername(e.currentTarget.value)
    }

    function handleEmailChange(e : React.ChangeEvent<HTMLInputElement>){
        setEmail(e.currentTarget.value)
    }

    async function handleLogin(){
        try{
            const response = await axios.post("https://localhost:7226/api/Profile/login",{username : username,password : password},{withCredentials: true})
            console.log("reigster resp: ", response.data);
            setShow(false)
        }catch(error){
            console.log("login error: ", error);
        }
    }

    async function handleRegister(){
        try{
            const response = await axios.post("https://localhost:7226/api/Profile/register",{username : username, email : email, password : password},{withCredentials: true})
            console.log("reigster resp: ", response.data);
            setShow(false)
        }catch(error){
            console.log("register error: ", error);
        }
    }

    const [show, setShow] = useState(false)

    function handleClose(){
        setShow(false)
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
                                  <Form.Label>Email address</Form.Label>
                                  <Form.Control type="email" onChange={handleEmailChange} value={email} />
                                </Form.Group>
                            :
                                null
                        }
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                          <Form.Label>Username</Form.Label>
                          <Form.Control type="text" onChange={handleUsernameChange} value={username}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                          <Form.Label>Password</Form.Label>
                          <Form.Control type="password" onChange={handlePasswordChange} value={password}/>
                        </Form.Group>
                    </Form>               
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