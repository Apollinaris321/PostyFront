import axios from "axios"
import { url } from "./Url"
import { useState, useEffect, FormEvent } from "react"
import { Comment, CommentResponse, CommentSection } from "./Comment"
import { Button, Form, Pagination } from "react-bootstrap"
import { useNavigate, useParams } from "react-router"
import { Link } from "react-router-dom"
import { client } from "../api"

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
      const navigate = useNavigate();
    const {id} = useParams()

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

    return(
        <div>
            <Link to={"../"}>
                Back
            </Link>
            <div>
                blogs: {JSON.stringify(post)}
            </div>
            <div>
                <div>
                    <Button onClick={deletePost} variant="primary">delete</Button>
                    <Button onClick={handleLike} variant="primary">like</Button>
                    <Button onClick={handleDislike} variant="primary">dislike</Button>
                    <UpdatePost post={post} updatePost={handleUpdatePost}></UpdatePost>
                    <CommentSection postId={id ? id : "1"}></CommentSection>
                </div>
            </div>
        </div>
    )
}

export type UpdatePostProp = {
    post : Post,
    updatePost : (p : Post, operation : "add" | "remove" | "update") => void
}

function UpdatePost(props : UpdatePostProp){
    const [title, setTitle] = useState(props.post.title)
    const [text, setText] = useState(props.post.text)
    const [edit, setEdit] = useState(false)

    useEffect(() => {
        setTitle(props.post.title)
        setText(props.post.text)
    },[props.post])

    function handleTextEditChange(e : React.ChangeEvent<HTMLInputElement>){
        setText(e.currentTarget.value)
    }

    function handleTitleEditChange(e : React.ChangeEvent<HTMLInputElement>){
        setTitle(e.currentTarget.value)
    }

    async function handleEditPost(){
        try{
            const response = await axios.put(url + `/post/${props.post.id}`, {text : text, title: title}, {withCredentials: true})
            console.log("edit post response: ", response.data);
            const postResponse = response.data as Post
            props.updatePost({...props.post, title : postResponse.title, text : postResponse.text}, "update")
            setEdit(false)
        }catch(error){
            console.log("edit post error: ", error);
        }
    }
    return(
        <div>
            <Button onClick={() => setEdit(edit ? false : true)}>edit</Button>
            {
                edit ? 
                <div>
                    <Form>
                      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" onChange={handleTitleEditChange} value={title}/>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Text</Form.Label>
                        <Form.Control type="text" onChange={handleTextEditChange} value={text}/>
                      </Form.Group>
                    </Form>
                    <Button onClick={handleEditPost}>update</Button>
                </div>
                :
                null
            }
        </div>
    )
}
