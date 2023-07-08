import axios from "axios";
import { ButtonHTMLAttributes, ChangeEvent, PropsWithChildren, useEffect, useState } from "react"
import { json } from "stream/consumers";


const url = 'https://localhost:7226/api/'
export function Solver(){
    const [blogs, setBlogs] = useState<any[]>([])
    const [nextUrl, setNextUrl] = useState("")


    async function getBlogs(){
        let resp = await axios.get(url + "post/feed");
        console.log(resp.data);
        setBlogs(resp.data.data)
        setNextUrl(resp.data.nextMessage)
    }

    async function getNextBlogs(){
        let resp = await axios.get(url + nextUrl);
        console.log(resp.data);
        if(resp.data.nextMessage != nextUrl){
            setBlogs([...blogs, ...resp.data.data])
            setNextUrl(resp.data.nextMessage)
        }
    }

    return(
        <div>
            <PostBlog></PostBlog>
            <div>
                <button onClick={getBlogs}>click</button>
            </div>
            <div>
                {blogs.map((b : any) => 
                <div key={b.post.id}>
                    <Blog {...b}></Blog>
                </div>
                )}
            </div>
            {nextUrl == "" ? null : 
            <button onClick={getNextBlogs}>next</button>
            }
        </div>
    )
}

type blogResponse = {
    likepath : string,
    commentpath : string,
    postpath : string,
    post : any
}

function Blog(props : blogResponse){
    const [comments, setComments] = useState<any[]>([])
    const [nextUrl, setNextUrl] = useState("")
    const [likeUrl, setLikeUrl] = useState(props.likepath)
    const [commentValue, setCommentValue] = useState("")
    const urlComment = 'https://localhost:7226/api/Post/'

    useEffect(() => {
        console.log(props);
    },[])

    async function getMoreComments(e : React.MouseEvent<HTMLButtonElement>){
        const response = await axios.get(nextUrl == "" ? urlComment + e.currentTarget.id + '/comments' : nextUrl)
        if(nextUrl == ""){
            console.log("url c: ", response.data.data);
            setComments([...response.data.data])
            setNextUrl(response.data.nextMessage)
        }
        else if(response.data.nextMessage != nextUrl){
            setComments([...comments, ...response.data.data])
            setNextUrl(response.data.nextMessage)
        }else{
            setNextUrl(response.data.nextMessage)
        }
    }
    function hideComments(){
        setNextUrl("")
        setComments([])
    }
    
    async function handleDislike(){
        const response = await axios.delete(url + likeUrl,{withCredentials : true})
        console.log("like: ", response)
    }

    async function handleLike(){
        const response = await axios.post(url + 'post/1/likes',{},{withCredentials : true})
        console.log("dislike: ", response)
    }

    async function sendComment(){
    }

    function handleComment(){

    }

    return(
        <div>
            blogs: {JSON.stringify(props.post)}
            <div>
                <div>
                    <button id={props.post.id} onClick={handleLike}>like</button>
                    <button id={props.post.id} onClick={handleDislike}>dislike</button>
                    <button id={props.post.id} onClick={hideComments}>hide</button>
                    <button id={props.post.id} onClick={getMoreComments}>more</button>
                    <div>
                        <input onChange={handleComment} value={commentValue}></input>
                        <button onClick={sendComment}>send</button>
                    </div>
                    {comments.map((c : any) => 
                        <div key={c.comment.id}>
                            <button onClick={async () => {await axios.post(c.likePath,{},{withCredentials: true})}}>like</button>
                            <button onClick={async () => {await axios.delete(c.dislikePath,{withCredentials: true})}}>dislike</button>
                            comment: {JSON.stringify(c.comment)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function PostBlog(){
    const [title, setTitle] = useState("")
    const [text, setText] = useState("")
    const [email, setEmail] = useState("user@example.com")

    function handleTextChange(e : React.FormEvent<HTMLInputElement>){
        setText(e.currentTarget.value)
    }

    function handleTitleChange(e : React.FormEvent<HTMLInputElement>){
        setTitle(e.currentTarget.value)
    }

    function handleEmailChange(e : React.FormEvent<HTMLInputElement>){
        setEmail(e.currentTarget.value)
    }

    async function handleLogin(){
        const response = await axios.post("https://localhost:7226/api/Profile/login",{username : title,password : text},{withCredentials: true})
        console.log("reigster resp: ", response.data);
    }

    async function handleRegister(){
        const response = await axios.post("https://localhost:7226/api/Profile/register",{username : title, email : email, password : text},{withCredentials: true})
        console.log("reigster resp: ", response.data);
        
    }

    return(
        <div>
            <button onClick={handleRegister}>register</button>
            <button onClick={handleLogin}>login</button>
            <div>
                Username: <input onChange={handleTitleChange} value={title}></input>
            </div>
            <div>
                Password: <input onChange={handleTextChange} value={text}></input>
            </div>
            <div>
                Email: <input onChange={handleEmailChange} value={email}></input>
            </div>
        </div>
    )
}