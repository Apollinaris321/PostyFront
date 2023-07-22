import axios from "axios"
import { url } from "../components/Url"
import { useState, useEffect, useContext } from "react"
import { CommentSection } from "../components/Comment"
import { Button, Card, Form, Pagination } from "react-bootstrap"
import { useNavigate, useParams } from "react-router"
import { Link } from "react-router-dom"
import { client } from "../api"
import { userContext } from "../user"
import "../index.css";

export type PostResponse = {
    currentPage : number,
    lastPage : number
    posts : any[]
}

export type Post = {
    id : number
    title : string 
    text : string
    authorName : string
    createdAt : string
    likes : number
}

export function Post(){
    const [post, setPost] = useState<Post>({title: "", text: "", likes: 0,authorName: "", id: 0, createdAt: ""})
    const [edit, setEdit] = useState(false)
    const [title, setTitle] = useState(post.title)
    const [text, setText] = useState(post.text)

    const navigate = useNavigate();
    const {id} = useParams()
    const {user} = useContext(userContext)

    useEffect(() => {
        const getCommentsAsync = async () =>{
            loadPost();
        }
        getCommentsAsync();
    },[])

    async function loadPost(){
        try{
            const response = await client.get(`/post/${id}`)
            console.log("response: ", response);
            setPost(response.data)
        }catch(error){
            console.log("error: ", error);
        }
    }
    
    async function handleDislike(){
        try{
            const response = await axios.delete(url + `/post/${id}/likes` ,{withCredentials : true})
            console.log("like: ", response)
            setPost({...post, likes : post.likes - 1})
        }catch(error){
            console.log("post dislike error: ", error);
        }
    }

    async function handleLike(){
        try{
            const response = await axios.post(url + `/post/${post.id}/likes` ,{},{withCredentials : true})
            console.log("dislike: ", response)
            setPost({...post, likes : post.likes + 1})
        }catch(error){
            console.log("post like error: ", error);
        }
    }

    async function deletePost(){
        try{
            const response = await client.delete(`/post/${post.id}`)
            navigate('../', {replace: true});
            console.log("delete post response: ", response);
        }catch(error){
            console.log("delete post error: ", error);
        }
    }

    function handleUpdatePost(p : Post, operation : "add" | "remove" | "update"){
        if(operation == "update"){
            setPost({...p})
        }
    }

    function convertDateTime(date : string){
        let timestamp = Date.parse(date)
        let newDate = new Date(timestamp)
        return newDate.toDateString()
    }

    function handleTextEditChange(e : React.ChangeEvent<HTMLInputElement>){
        setText(e.currentTarget.value)
    }

    function handleTitleEditChange(e : React.ChangeEvent<HTMLInputElement>){
        setTitle(e.currentTarget.value)
    }

    async function saveEdit(){
        try{
            const response = await client.put(`/post/${post.id}`, {text : text, title: title})
            const postResponse = response.data as Post
            handleUpdatePost({...post, title : postResponse.title, text : postResponse.text}, "update")
            setEdit(false)
        }catch(error){
            console.log("edit post error: ", error);
        }
    }

    return(
        <div className="postwrapper row">
            <div className="col"></div>
            <div className="col-6">
                <div className="postPreview">
                    <div className="header">
                        <div className="authorName">
                            <Link className="linkText" to={`/profile/${post?.authorName}`}>
                                @{post.authorName}
                            </Link>
                        </div>
                        <div className="date">
                            {convertDateTime(post.createdAt)}
                        </div>
                    </div>

                    <div>
                        {
                            edit ? 
                            <input onChange={handleTitleEditChange} value={title}></input>
                            :
                            <div className="title">
                                {post.title}
                            </div>
                        }
                    </div>
                    <div className="footer d-flex flex-row gap-1">
                        <div>
                            {post.likes}
                        </div>
                        <button className="btn btn-sm btn-primary" onClick={handleLike}>like</button>
                        <button className="btn btn-sm btn-danger" onClick={handleDislike}>dislike</button>
                        {user?.username == post.authorName && edit == false ? <button className="btn btn-sm btn-primary" onClick={() => setEdit(edit ? false : true)}>edit</button> : null }
                        {user?.username == post.authorName && edit == false ? <button className="btn btn-sm btn-danger" onClick={deletePost} >delete</button> : null }
                        { edit ? <button className="btn btn-sm btn-primary" onClick={saveEdit}>save</button> : null }
                        { edit ? <button className="btn btn-sm btn-danger" onClick={() => setEdit(false)}>discard</button> : null }
                    </div>
                </div>
                <div className="d-flex flex-column">
                    <div className="text-center">
                        Commentsection
                    </div>
                    <CommentSection postId={id ? id : "1"}></CommentSection>
                </div>
            </div>
            <div className="col"></div>
        </div>
    )
}