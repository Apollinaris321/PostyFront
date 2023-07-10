import axios from "axios";
import { useState, FormEvent } from "react";
import { url } from "./Url";

export type Comment = {
    authorName : string,
    createdAt : string,
    id : number,
    likes : number,
    postId : number,
    text : string
}

export type CommentResponse = {
    currentPage : number,
    lastPage : number,
    comments : []
}

export type CommentProps = {
    comment : Comment,
    updateComment: (c : Comment, operation : "add" | "remove" | "update" ) => void
}

export function Comment({comment , updateComment} : CommentProps){
    async function dislikeComment(){
        try{
            const response = await axios.delete(url + `/comment/${comment.id}/likes`,{withCredentials: true})
            updateComment({...comment, likes : comment.likes - 1}, "update")
            console.log("dislike : ", response);
        }catch(error){
            console.log("dislike error : ", error);
        }
    }

    async function likeComment(){
        try{
            const response = await axios.post(url + `/comment/${comment.id}/likes`,{},{withCredentials: true})
            updateComment({...comment, likes : comment.likes + 1}, "update")
            console.log("like : ", response);
        }catch(error){
            console.log("like error : ", error);
        }

    }

    async function handleDeleteComment(){
        try{
            const response = await axios.delete(url + `/comment/${comment.id}`, {withCredentials: true})
            console.log("delete comment: ", response);
            updateComment(comment, "remove")
        }catch(error){
            console.log("error deleting comment: ", error);
        }
    }

    return(
        <div>
            Comment: 
            <UpdateComment comment={comment} updateComment={updateComment}></UpdateComment>
            <button onClick={handleDeleteComment}>delete</button>
            <button onClick={likeComment}>like</button>
            <button onClick={dislikeComment}>dislike</button>
            -- 
            {JSON.stringify(comment)}
        </div>
    )
}

export type UpdateCommentProp = {
    comment : Comment,
    updateComment : (c : Comment, operation : "update" | "remove" | "add") => void
}

export function UpdateComment(props : UpdateCommentProp){
    const [text, setText] = useState(props.comment.text)
    const [edit, setEdit] = useState(false)

    async function handleEditComment(){
        try{
            const response = await axios.put(url + `/comment/${props.comment.id}`, {text : text}, {withCredentials: true})
            console.log("edit comment response: ", response.data);
            props.updateComment({...props.comment, text : text}, "update")
            setEdit(false)
        }catch(error){
            console.log("edit comment error: ", error);
        }
    }

    function handleCommentTextChange(e : FormEvent<HTMLInputElement>){
        setText(e.currentTarget.value)
    }

    return(
        <div>
            <button onClick={() => {setEdit(edit ? false : true)}}>edit</button>
            {
                edit ? 
                <div>
                    <input onChange={handleCommentTextChange} value={text}></input>
                    <button onClick={handleEditComment}>update</button>
                </div>
                :
                null
            }
        </div>
    )
}