import axios from "axios"
import { useState } from "react"
import { Button, Form } from "react-bootstrap"
import { Post } from "./Post"
import { url } from "./Url"

export type AddPostProp = {
    updatePost : (p : Post, operation : "remove" | "add" | "update") => void
}

export function AddPost(props: AddPostProp){
    const [title , setTitle] = useState("")
    const [text , setText] = useState("")

    function handleTextChange(e : React.ChangeEvent<HTMLInputElement>){
        setText(e.currentTarget.value)
    }

    function handleTitleChange(e : React.ChangeEvent<HTMLInputElement>){
        setTitle(e.currentTarget.value)
    }

    async function sendPost(){
        try{
            const response = await axios.post(url + '/post', {title : title, text : text}, {withCredentials : true})
            props.updatePost(response.data as Post, "add")
            console.log(response.data);
        }catch(error){
            console.log("send post error: ", error);
        }
    }

    return(
        <div>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" onChange={handleTitleChange} value={title}/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Text</Form.Label>
                <Form.Control  as="textarea" rows={3} type="text" onChange={handleTextChange} value={text}/> 
              </Form.Group>
            </Form>
            <Button onClick={sendPost}>post it!</Button>
        </div>
    )
}