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
import { PostPreviewLike } from "../components/PostDisplay"

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
                            <UpdatePost post={post} updatePost={handleUpdatePost} setEdit={setEdit}></UpdatePost>
                            :
                            <div className="title">
                                {post.title}
                            </div>
                        }
                    </div>
                    <div className="footer">
                        { edit ? 
                           null 
                           : 
                           <div className="d-flex flex-row gap-2">
                               <div className="d-flex flex-row justify-content-center align-items-center gap-2">
                                   <div>
                                       {post.likes}
                                   </div>
                                   <Button onClick={handleLike} variant="primary">like</Button>
                                   <Button onClick={handleDislike} variant="danger">dislike</Button>
                               </div>
                               {
                                   user?.username == post.authorName ? 
                                       <div className="d-flex flex-row gap-2">
                                           <Button onClick={() => setEdit(edit ? false : true)}>edit</Button>
                                           <Button onClick={deletePost} variant="danger">delete</Button>
                                       </div>
                                   :
                                       null
                               }
                           </div>
                        }
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

export type UpdatePostProp = {
    post : Post,
    updatePost : (p : Post, operation : "add" | "remove" | "update") => void,
    setEdit : (b : boolean) => void
}

function UpdatePost(props : UpdatePostProp){
    const [title, setTitle] = useState(props.post.title)
    const [text, setText] = useState(props.post.text)

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

    async function saveEdit(){
        try{
            const response = await client.put(`/post/${props.post.id}`, {text : text, title: title})
            const postResponse = response.data as Post
            props.updatePost({...props.post, title : postResponse.title, text : postResponse.text}, "update")
            props.setEdit(false)
        }catch(error){
            console.log("edit post error: ", error);
        }
    }

    return(
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
            <Button onClick={saveEdit}>save</Button>
            <Button onClick={() => props.setEdit(false)} variant="danger">discard</Button>
        </div>
    )
}