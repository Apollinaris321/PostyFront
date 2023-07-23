import { useState } from "react"
import { Button, Form } from "react-bootstrap"

export type AddPostProp = {
    sendPost : (text : string) => void
}

export function AddPost({sendPost}: AddPostProp){
    const [text , setText] = useState("")

    function handleTextChange(e : React.ChangeEvent<HTMLInputElement>){
        setText(e.currentTarget.value)
    }

    return(
        <div>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Text</Form.Label>
                <Form.Control  as="textarea" rows={3} type="text" onChange={handleTextChange} value={text}/> 
              </Form.Group>
            </Form>
            <Button onClick={() => sendPost(text)}>post it!</Button>
        </div>
    )
}