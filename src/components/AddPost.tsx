import { useState } from "react"
import { Button, Form } from "react-bootstrap"

export type AddPostProp = {
    sendPost : (text : string) => void
}

export function AddPost({sendPost}: AddPostProp){
    const [text , setText] = useState("")

    function handleTextChange(e : React.ChangeEvent<HTMLTextAreaElement>){
        setText(e.currentTarget.value)
    }

    return(
        <div className="d-flex flex-column gap-1 align-items-start justify-content-center">
            <textarea className="form-control" rows={3} onChange={handleTextChange} value={text}></textarea>
            <button className="btn btn-primary" onClick={() => sendPost(text)}>post</button>
        </div>
    )
}