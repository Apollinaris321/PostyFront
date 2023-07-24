import { useState, useEffect } from "react";
import { url } from "../Url";
import { client } from "../api";
import { Page } from "./Page";
import { CardEdit } from "./CardEdit";

export type Comment = {
    authorName : string,
    createdAt : string,
    id : number,
    likes : number,
    postId : number,
    text : string,
    likedByYou : boolean
}

export type CommentResponse = {
    currentPage : number,
    lastPage : number,
    comments : []
}

type CommentSectionProps = {
    postId : string
}

export function CommentSection({postId = "1" } : CommentSectionProps){
    const [page, setPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [comments, setComments] = useState<any[]>([])

    useEffect(() => {
        const getCommentsAsync = async () =>{
            getCommentPage(page)
        }
        getCommentsAsync();
    },[])

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

    async function updatePage(newPage : number){
        setPage(newPage)
        await getCommentPage(newPage);
    }

    async function handleAdd(newtext : string){
        try{
            const response = await client.post(`/post/${postId}/comments` ,{ text : newtext})
            console.log("comment resp: ", response.data)
            setComments([response.data, ...comments])
        }catch(error){
            console.log("like error: ", error)
        }
    }

    async function handleUpdate(id : string | number, newText : string){
        try{
            const response = await client.put(`/comment/${id}`, {text : newText})
            console.log("edit comment response: ", response.data);
            const newComment = response.data as Comment
            setComments([
                ...comments.map((c : Comment) => {
                    if(c.id == newComment.id){
                        return newComment
                    }else{
                        return c
                    }
                })
            ])
        }catch(error){
            console.log("edit comment error: ", error);
        }
    }

    async function handleDelete(id : string | number){
        try{
            const response = await client.delete(url + `/comment/${id}`)
            console.log("delete comment: ", response);
            getCommentPage(page)
        }catch(error){
            console.log("error deleting comment: ", error);
        }
    }

    async function handleDislike(id : string | number){
        try{
            const response = await client.delete(`/comment/${id}/likes`)
            setComments([
                ...comments.map((c : Comment) => {
                    if(c.id == id){
                        return {...c, likes : c.likes - 1, likedByYou: false}
                    }else{
                        return c
                    }
                })
            ])
        }catch(error){
            console.log("like error : ", error);
        }
    }

    async function handleLike(id : string | number){
        try{
            const response = await client.post(`/comment/${id}/likes`)
            setComments([
                ...comments.map((c : Comment) => {
                    if(c.id == id){
                        return {...c, likes : c.likes + 1, likedByYou: true}
                    }else{
                        return c
                    }
                })
            ])
        }catch(error){
            console.log("like error : ", error);
        }
    }


    return(
        <div className="d-flex flex-column gap-2 h-100 justify-content-between">
            <AddComment postId={postId} addComment={handleAdd}></AddComment>
            <div className="d-flex flex-column gap-2 h-100">
                {comments.map(c => {
                    return(
                        <div key={c.id}>
                            <CardEdit
                            info={c}
                            linkTo=""
                            handleDelete={handleDelete}
                            handleDislike={handleDislike}
                            handleLike={handleLike}
                            handleUpdate={handleUpdate}
                            />
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
    addComment : (text : string) => void,
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
        prop.addComment(newComment)
        setNewComment("")
    }

    function handleCommentInput(e : React.ChangeEvent<HTMLTextAreaElement>){
        setError("")
        setNewComment(e.currentTarget.value);
    }

    return(
        <div className="d-flex flex-column gap-1 justify-content-center align-items-start addPost">
            {error != "" ? 
                <div className="error d-flex flex-row justify-content-center w-100 gap-1">
                    <div>
                        {error}
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                        <button className="btn btn-sm btn-outline-danger" onClick={() => setError("")}>x</button>
                    </div>
                </div>
                 : null
            }
            <textarea className="form-control" rows={2} onChange={handleCommentInput} value={newComment}></textarea>
            <div>
                <button className="btn btn-primary" onClick={sendComment}>send</button>
            </div>
        </div>
    )
}