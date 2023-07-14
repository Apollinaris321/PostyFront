import axios from "axios";
import { useState, FormEvent, useEffect } from "react";
import { url } from "./Url";
import { Button, Form } from "react-bootstrap";
import { client } from "../api";
import { Page } from "./Page";
import { useParams } from "react-router";

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
            <Button onClick={handleDeleteComment}>delete</Button>
            <Button onClick={likeComment}>like</Button>
            <Button onClick={dislikeComment}>dislike</Button>
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

    function handleCommentTextChange(e : React.ChangeEvent<HTMLInputElement>){
        setText(e.currentTarget.value)
    }

    return(
        <div>
            {
                edit ? 
                <div>
                    <Form>
                      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>edit comment: </Form.Label>
                        <Form.Control type="text" onChange={handleCommentTextChange} value={text}/>
                      </Form.Group>
                    </Form>
                    <Button onClick={handleEditComment} variant="primary">update</Button>
                    <Button onClick={() => {setEdit(edit ? false : true)}}>close</Button>
                </div>
                :
                <Button onClick={() => {setEdit(edit ? false : true)}}>edit</Button>
            }
        </div>
    )
}

type CommentSectionProps = {
    postId : string
}

export function CommentSection({postId = "1" } : CommentSectionProps){
    const [page, setPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [comments, setComments] = useState<any[]>([])
    const [commentValue, setCommentValue] = useState("")

    useEffect(() => {
        const getCommentsAsync = async () =>{
            getCommentPage(page)
        }
        getCommentsAsync();
    },[page])

    async function getCommentPage(page : number){
        try{
            const response = await client.get(`Post/${postId}/comments?pageSize=10&pageNumber=${page}`)
            const commentResponse = response.data as CommentResponse
            
            setComments([...commentResponse.comments])
            setPage(commentResponse.currentPage)
            setLastPage(commentResponse.lastPage)
        }catch(error){
            console.log("error more comments: ", error);
        }
    }

    function handleCommentChange(newComment : Comment, operation : "add" | "remove" | "update"){
        if(operation == "remove"){
            getCommentPage(page)
        }else if(operation == "update"){
            setComments([
                ...comments.map((c : Comment) => {
                    if(c.id == newComment.id){
                        return newComment
                    }else{
                        return c
                    }
                })
            ])
        }else if(operation == "add"){
            getCommentPage(page)
        }
    }

    async function updatePage(newPage : number){
        setPage(newPage)
        await getCommentPage(newPage);
    }

    return(
        <div>
            <AddComment postId={postId} updateComment={handleCommentChange}></AddComment>
            {comments.map(c => {
                return(
                    <div key={c.id}>
                        <Comment comment={c} updateComment={handleCommentChange}></Comment>
                    </div>
                )
            })}
            <Page updatePage={updatePage} page={page} lastPage={lastPage}></Page>
        </div>
    )
}

type AddCommentProp = {
    updateComment : (c : Comment, operation : "add" | "remove" | "update") => void,
    postId?: string
}

function AddComment(prop : AddCommentProp){
    const [newComment, setNewComment] = useState("")
    const [error, setError] = useState("")

    async function sendComment(){
        if(newComment == ""){
            setError("Can't send empty comment!")
            return;
        }
        try{
            const response = await client.post(`/post/${prop.postId}/comments` ,{text : newComment})
            console.log("comment resp: ", response.data)
            setNewComment("")
            prop.updateComment(response.data, "add")
        }catch(error){
            console.log("like error: ", error)
        }
    }

    function handleCommentInput(e : React.ChangeEvent<HTMLInputElement>){
        setError("")
        setNewComment(e.currentTarget.value);
    }

    return(
        <div>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Comment</Form.Label>
                {
                    error == "" ? null : <div>{error}</div>
                }
                <Form.Control type="text" onChange={handleCommentInput} value={newComment}/>
              </Form.Group>
            </Form>
            <Button onClick={sendComment}>send</Button>
        </div>
    )
}