import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { url } from "./Url";
import { client } from "../api";
import { Page } from "./Page";
import { userContext } from "../user";
import { Link } from "react-router-dom";
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md';

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
    const {user} = useContext(userContext)
    const [edit, setEdit] = useState(false)
    const [text, setText] = useState(comment.text)

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

    async function handleEditComment(){
        try{
            const response = await client.put(`/comment/${comment.id}`, {text : text})
            console.log("edit comment response: ", response.data);
            updateComment({...comment, text : text}, "update")
            setEdit(false)
        }catch(error){
            console.log("edit comment error: ", error);
        }
    }

    function handleCommentTextChange(e : React.ChangeEvent<HTMLInputElement>){
        setText(e.currentTarget.value)
    }

    function convertDateTime(date : string){
        let timestamp = Date.parse(date)
        let newDate = new Date(timestamp)
        return newDate.toDateString()
    }

    return(
        <div className="postPreview">
            <div className="header">
                <div className="authorName">
                    <Link className="linkText" to={`/profile/${comment?.authorName}`}>
                        @{comment.authorName}
                    </Link>
                </div>
                <div className="date">
                    {convertDateTime(comment.createdAt)}
                </div>
            </div>
                <Link className="linkText" to={`/post/${comment.id}`}>
                    <div className="title">
                            {
                                edit ? 
                                <input type="text" onChange={handleCommentTextChange} value={text}></input>
                                :
                                <div className="fs-4 d-flex align-content-center justify-content-start">
                                    {comment.text}
                                </div>
                            }
                    </div>
                </Link>
                <div className="d-flex flex-row gap-1 justify-content-start pt-1">
                    {comment.likes}
                    <button className="btn btn-sm btn-primary" onClick={likeComment}>
                        <MdFavoriteBorder></MdFavoriteBorder>
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={dislikeComment}>
                        <MdFavorite></MdFavorite>
                    </button>
                    { user?.username == comment.authorName && edit == false ? <button className="btn btn-sm btn-primary" onClick={() => setEdit(true)}>edit</button> : null }
                    { user?.username == comment.authorName && edit == false ? <button className="btn btn-sm btn-danger" onClick={handleDeleteComment}>delete</button> : null }
                    {edit ? <button className="btn btn-sm btn-primary" onClick={handleEditComment}>save</button> : null }
                    {edit ? <button className="btn btn-sm btn-danger" onClick={() => {setEdit(edit ? false : true)}}>discard</button> : null}
                </div>
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
                    <input type="text" onChange={handleCommentTextChange} value={text}></input>
                    <button className="btn btn-sm btn-primary" onClick={handleEditComment} >update</button>
                    <button  className="btn btn-sm btn-danger" onClick={() => {setEdit(edit ? false : true)}}>close</button>
                </div>
                :
                <button  className="btn btn-sm btn-danger" onClick={() => {setEdit(edit ? false : true)}}>close</button>
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
            console.log("response comment page: ", commentResponse);
            
            
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
        <div className="d-flex flex-column gap-2">
            <AddComment postId={postId} updateComment={handleCommentChange}></AddComment>
            <div className="d-flex flex-column gap-2">
                {comments.map(c => {
                    return(
                        <div key={c.id}>
                            <Comment comment={c} updateComment={handleCommentChange}></Comment>
                        </div>
                    )
                })}
            </div>
            <div className="d-flex justify-content-center">
                <Page updatePage={updatePage} page={page} lastPage={lastPage}></Page>
            </div>
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

    function handleCommentInput(e : React.ChangeEvent<HTMLTextAreaElement>){
        setError("")
        setNewComment(e.currentTarget.value);
    }

    return(
        <div className="d-flex flex-column justify-content-center align-items-center">
            {
                error == "" ? 
                null : 
                <div>{error}</div>
            }
            <textarea rows={2} onChange={handleCommentInput} value={newComment}></textarea>
            <button onClick={sendComment}>send</button>
        </div>
    )
}