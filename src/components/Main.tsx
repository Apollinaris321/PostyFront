import axios from "axios";
import { FormEvent, useEffect, useState } from "react"

const url = 'https://localhost:7226/api'

type PostResponse = {
    currentPage : number,
    lastPage : number
    posts : any[]
}

type Post = {
    id : number
    title : string 
    text : string
    authorName : string
    createdAt : string
    likes : number
}

type AddPostProp = {
    addNewPost : (p : Post) => void
}

export function AddPost(props: AddPostProp){
    const [title , setTitle] = useState("")
    const [text , setText] = useState("")

    function handleTextChange(e : FormEvent<HTMLInputElement>){
        setText(e.currentTarget.value)
    }

    function handleTitleChange(e : FormEvent<HTMLInputElement>){
        setTitle(e.currentTarget.value)
    }

    async function sendPost(){
        const response = await axios.post(url + '/post', {title : title, text : text}, {withCredentials : true})
        props.addNewPost(response.data as Post)
        console.log(response.data);
    }

    return(
        <div>
            <input onChange={handleTitleChange} value={title}></input>
            <input onChange={handleTextChange} value={text}></input>
            <button onClick={sendPost}>post it!</button>
        </div>
    )
}

export function Homefeed(){
    const [postResponse, setPostResponse] = useState<PostResponse | null>(null)
    const [posts, setPosts] = useState<Post[]>([])


    useEffect(() => {
        const getPostsUseEffect = async () => {
            await getPosts();
        }
        getPostsUseEffect();
    },[])


    async function getPosts(){
        try{
            const response = await axios.get(url + "/post/feed");
            console.log(response);
            
            const postResponse = response.data as PostResponse
            setPostResponse(postResponse)
            setPosts([...posts, ...postResponse.posts])
        }catch(error){
            console.log("getBlogs error :", error);
        }
    }

    async function loadMorePosts(){
        if(postResponse != null && postResponse.currentPage != postResponse.lastPage){
            try{
                const response = await axios.get(url + `/post/feed?pageSize=10&pageNumber=${postResponse.currentPage + 1}&sort=new`);
                setPostResponse(response.data as PostResponse)
                setPosts([...posts, ...response.data.posts])
            }catch(error){
                console.log("load more posts error: ", error);
            }
        }
    }

    function addNewPost(p : Post){
        setPosts([p, ...posts])
    }

    function updatePost(newPost : Post, remove? : string){
        if(remove){
            setPosts([...posts.filter(p => p.id != newPost.id)])
        }else{
            setPosts([...posts.map(p => {
                if(p.id == newPost.id){
                    return newPost
                }else{
                    return p
                }
            })])
        }
    }

    return(
        <div>
            new post:
            <AddPost addNewPost={addNewPost}></AddPost>
            login:
            <Auth></Auth>
            <div>
                <button onClick={loadMorePosts}>more</button>
            </div>
            <div>
                Posts:
                {
                posts.map((p : Post) => 
                    <div key={p.id}>
                        <Post post={p} updatePost={updatePost}></Post>
                    </div>
                    ) 
                }
            </div>
        </div>
    )
}

type CommentResponse = {
    currentPage : number,
    lastPage : number,
    comments : []
}

type Comment = {
    authorName : string,
    createdAt : string,
    id : number,
    likes : number,
    postId : number,
    text : string
}

type PostProps = {
    post : Post,
    updatePost : (p : Post, remove? : string) => void
}

// TODO make new comment
function Post({post , updatePost} : PostProps ){
    const [comments, setComments] = useState<any[]>([])
    const [commentValue, setCommentValue] = useState("")
    const [commentResponse, setCommentResponse] = useState<null | CommentResponse>(null)
    const [edit, setEdit] = useState(false)
    const [title, setTitle] = useState(post.title)
    const [text, setText] = useState(post.text)

    useEffect(() => {
        const getCommentsAsync = async () =>{
            getMoreComments();
        }
        getCommentsAsync();
    },[])

    async function getMoreComments(){
        if(commentResponse != null){
            if(commentResponse.currentPage != commentResponse.lastPage){
                const response = await axios.get(url + `/post/${post.id}/comments`)
                setComments([...comments, ...commentResponse.comments])
                setCommentResponse(response.data)
            }
        }else{
            const response = await axios.get(url + `/post/${post.id}/comments`)
            setComments([...response.data.comments])
            setCommentResponse(response.data)
        }
    }
    
    async function handleDislike(){
        try{
            const response = await axios.delete(url + `/post/${post.id}/likes` ,{withCredentials : true})
            updatePost({...post, likes : post.likes - 1})
            console.log("like: ", response)
        }catch(error){
            console.log("post dislike error: ", error);
        }
    }

    async function handleLike(){
        try{
            const response = await axios.post(url + `/post/${post.id}/likes` ,{},{withCredentials : true})
            updatePost({...post, likes : post.likes + 1})
            console.log("dislike: ", response)
        }catch(error){
            console.log("post like error: ", error);
        }

    }

    async function sendComment(){
        try{
            const response = await axios.post(url + `/post/${post.id}/comments` ,{text : commentValue},{withCredentials : true})
            console.log("comment resp: ", response.data)
            setComments([...comments, {...response.data}])
            setCommentValue("")
        }catch(error){
            console.log("like error: ", error)
        }
    }

    function handleCommentInput(e : React.FormEvent<HTMLInputElement>){
        setCommentValue(e.currentTarget.value);
    }

    function handleCommentUpdate(newComment : Comment, remove? : boolean){
        if(remove){
            setComments([...comments.filter((c: Comment) => c.id != newComment.id)])
        }else{
            setComments([
                ...comments.map((c : Comment) => {
                    if(c.id == newComment.id){
                        return newComment
                    }else{
                        return c
                    }
                })
            ])
        }
    }

    async function deletePost(){
        try{
            const response = await axios.delete(url + `/post/${post.id}`)
            console.log("delete post response: ", response);
            updatePost(post , "remove")
        }catch(error){
            console.log("delete post error: ", error);
        }
    }

    function handleEdit(){
        edit ? setEdit(false) : setEdit(true)
    }

    function handleTextEditChange(e : FormEvent<HTMLInputElement>){
        setText(e.currentTarget.value)
    }

    function handleTitleEditChange(e : FormEvent<HTMLInputElement>){
        setTitle(e.currentTarget.value)
    }

    async function handleEditPost(){
        try{
            const response = await axios.put(url + `/post/${post.id}`, {text : text, title: title})
            console.log("edit post response: ", response.data);
            const postResponse = response.data as Post
            updatePost({...post, title : postResponse.title, text : postResponse.text})
        }catch(error){
            console.log("edit post error: ", error);
        }
    }

    return(
        <div>
            blogs: {JSON.stringify(post)}
            <div>
                <div>
                    <button onClick={handleEdit}>edit</button>
                    {
                        edit ? 
                        <div>
                            <input onChange={handleTitleEditChange} value={title}></input>
                            <input onChange={handleTextEditChange} value={text}></input>
                            <button onClick={handleEditPost}>update</button>
                        </div>
                        : null
                    }
                    <button onClick={deletePost}>delete</button>
                    <button onClick={handleLike}>like</button>
                    <button onClick={handleDislike}>dislike</button>
                    <button id={post.id.toString()} onClick={getMoreComments}>more</button>
                    <div>
                        <input onChange={handleCommentInput} value={commentValue}></input>
                        <button onClick={sendComment}>send com</button>
                    </div>
                    {comments.map((c : any) => 
                        <div key={c.id}>
                            <Comment comment={c} updateComment={handleCommentUpdate}></Comment>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

type CommentProps = {
    comment : Comment,
    updateComment: (c : Comment, remove? : boolean) => void
}

function Comment({comment , updateComment} : CommentProps){

    const [edit, setEdit] = useState(false)
    const [text, setText] = useState(comment.text)

    function handleUpdateComment(newComment : Comment){
        updateComment({...newComment})
    }

    async function dislikeComment(){
        try{
            const response = await axios.delete(url + `/comment/${comment.id}/likes`,{withCredentials: true})
            handleUpdateComment({...comment, likes : comment.likes - 1})
            console.log("dislike : ", response);
        }catch(error){
            console.log("dislike error : ", error);
        }
    }

    async function likeComment(){
        try{
            const response = await axios.post(url + `/comment/${comment.id}/likes`,{},{withCredentials: true})
            handleUpdateComment({...comment, likes : comment.likes + 1})
            console.log("like : ", response);
        }catch(error){
            console.log("like error : ", error);
        }

    }

    function showEdit(){
        setEdit( edit ? false : true)
    }

    async function handleEditComment(){
        try{
            const response = await axios.put(url + `/comment/${comment.id}`, {text : text}, {withCredentials: true})
            console.log("edit comment response: ", response.data);
            handleUpdateComment({...comment, text : text})
        }catch(error){
            console.log("edit comment error: ", error);
        }
    }

    async function handleDeleteComment(){
        try{
            const response = await axios.delete(url + `/comment/${comment.id}`, {withCredentials: true})
            console.log("delete comment: ", response);
            updateComment(comment, true)
        }catch(error){
            console.log("error deleting comment: ", error);
        }
    }

    function handleCommentTextChange(e : FormEvent<HTMLInputElement>){
        setText(e.currentTarget.value)
    }

    return(
        <div>
            Comment: 
            {
                edit ? 
                <div>
                    <input onChange={handleCommentTextChange} value={text}></input>
                    <button onClick={handleEditComment}>update</button>
                </div>
                : null
            }
            <button onClick={showEdit}>edit</button>
            <button onClick={handleDeleteComment}>delete</button>
            <button onClick={likeComment}>like</button>
            <button onClick={dislikeComment}>dislike</button>
            -- 
            {JSON.stringify(comment)}
        </div>
    )
}

function Auth(){
    const [username, setUsername] = useState("string")
    const [password, setPassword] = useState("string")
    const [email, setEmail] = useState("user@example.com")

    function handlePasswordChange(e : React.FormEvent<HTMLInputElement>){
        setPassword(e.currentTarget.value)
    }

    function handleUsernameChange(e : React.FormEvent<HTMLInputElement>){
        setUsername(e.currentTarget.value)
    }

    function handleEmailChange(e : React.FormEvent<HTMLInputElement>){
        setEmail(e.currentTarget.value)
    }

    async function handleLogin(){
        const response = await axios.post("https://localhost:7226/api/Profile/login",{username : username,password : password},{withCredentials: true})
        console.log("reigster resp: ", response.data);
    }

    async function handleRegister(){
        const response = await axios.post("https://localhost:7226/api/Profile/register",{username : username, email : email, password : password},{withCredentials: true})
        console.log("reigster resp: ", response.data);
        
    }

    return(
        <div>
            <button onClick={handleRegister}>register</button>
            <button onClick={handleLogin}>login</button>
            <div>
                Username: <input onChange={handleUsernameChange} value={username}></input>
            </div>
            <div>
                Password: <input onChange={handlePasswordChange} value={password}></input>
            </div>
            <div>
                Email: <input onChange={handleEmailChange} value={email}></input>
            </div>
        </div>
    )
}