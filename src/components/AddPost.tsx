import { useState } from "react"
import { Button, Form } from "react-bootstrap"

export type AddPostProp = {
    sendPost : (text : string) => void
}

export function AddPost({sendPost}: AddPostProp){
    const [text , setText] = useState("")
    const [error , setError] = useState("")

    function handleTextChange(e : React.ChangeEvent<HTMLTextAreaElement>){
        setText(e.currentTarget.value)
    }

    function handleSendPost(){
        if(text == ""){
            setError("Can't send empty comment!")
        }else{
            sendPost(text)
            setText("")
        }
    }

    return(
        <div className="d-flex flex-column gap-1 align-items-start justify-content-center">
            {error != "" ? 
                <div className="error d-flex flex-row justify-content-center w-100 gap-1">
                    <div>
                        {error}
                    </div>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => setError("")}>x</button>
                </div>
                 : null
            }
            <textarea className="form-control" rows={3} onChange={handleTextChange} value={text}></textarea>
            <button className="btn btn-primary" onClick={handleSendPost}>post</button>
        </div>
    )
}