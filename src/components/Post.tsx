import axios from "axios"
import { url } from "./Url"
import { useState, useEffect, FormEvent } from "react"
import { Comment, CommentResponse } from "./Comment"
import { Button, Form, Pagination } from "react-bootstrap"
import { useParams } from "react-router"
import { Link } from "react-router-dom"

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

type PageProps = {
    page : number
}

// ich brauch keine links das unten sind nur buttons die die id angeben
// also oben header unten footer (paginator) in der mitte content -> wird geladen anhand der page-id auf der man gerade ist
// load initial mit page-1
export function Page({page} : PageProps){
    const [pages, setPages] = useState([...calcPageArray(page)])

    useEffect(() => {
        setPages([...calcPageArray(page)])
    },[page])

    function calcPageArray(currentPage : number) : number[]{
        const firstPage = 1
        const lastPage = 20
        const range = 5
        const buffer = Math.floor(range/2)
        let start = currentPage - buffer
        let end = currentPage + buffer 
        if(currentPage < 3){
            start = firstPage 
            end = start + range - 1
        }
        if(currentPage > lastPage - buffer){
            start = lastPage - range + 1 
            end = lastPage
        }
        const arr = []
        for(let i = start;i<=end;i++){
            arr.push(i)
        }
        return arr
    }

    return(
        <div>
            <Pagination>
                <Pagination.First>
                    <Link to={`../post/1`}>
                        First
                    </Link>
                </Pagination.First>
                {pages.map(p => {
                    return(
                    <Pagination.Item active={page == p}>
                        <Link to={`../post/${p}`}>
                            {p}
                        </Link>
                    </Pagination.Item>
                    )
                })}
                <Pagination.Last>
                    <Link to={`../post/6`}>
                        Last
                    </Link>
                </Pagination.Last>
            </Pagination>
        </div>
    )
}

export function PostDisplay(){
    const {id} = useParams(); 
    const [postResponse, setPostResponse] = useState<PostResponse | null>(null)
    const [posts, setPosts] = useState<Post[]>([])


    useEffect(() => {
        console.log("rendering...");
        const getPostsUseEffect = async () => {
            await loadPosts();
        }
        getPostsUseEffect();
    },[id])

    async function loadPosts(){
        try{
            const response = await axios.get(url + `/post/feed?pageSize=10&pageNumber=${id}&sort=new`, {withCredentials : true});
            setPostResponse(response.data as PostResponse)
            setPosts([...response.data.posts])
        }catch(error){
            console.log("load more posts error: ", error);
        }
    }

    return(
        <div>
            id: {id}
            <Link to={"/"}>back</Link>
            <div>
                {posts.map(p => {
                    return(
                    <div key={p.id}>
                        {p.title}, {p.text}, author: {p.authorName}
                    </div>
                    )
                })}
            </div>
            <Page page={id ? parseInt(id) : 1}></Page>
        </div>
    )
}

export type PostProps = {
    post : Post,
    updatePost : (p : Post, operation : "update" | "remove" | "add") => void
}

// TODO make new comment
export function Post({post , updatePost} : PostProps ){
    const [comments, setComments] = useState<any[]>([])
    const [commentValue, setCommentValue] = useState("")
    const [commentResponse, setCommentResponse] = useState<null | CommentResponse>(null)

    useEffect(() => {
        const getCommentsAsync = async () =>{
            getMoreComments();
        }
        getCommentsAsync();
    },[])

    async function getMoreComments(){
        if(commentResponse != null){
            if(commentResponse.currentPage != commentResponse.lastPage){
                try{
                    const response = await axios.get(url + `/post/${post.id}/comments`, {withCredentials : true})
                    setComments([...comments, ...commentResponse.comments])
                    setCommentResponse(response.data)
                }catch(error){
                    console.log("error more comments: ", error);
                }
            }
        }else{
            try{
                const response = await axios.get(url + `/post/${post.id}/comments`, {withCredentials : true})
                setComments([...response.data.comments])
                setCommentResponse(response.data)
            }catch(error){
                console.log("get more comments error: ", error);
            }
        }
    }
    
    async function handleDislike(){
        try{
            const response = await axios.delete(url + `/post/${post.id}/likes` ,{withCredentials : true})
            updatePost({...post, likes : post.likes - 1}, "update")
            console.log("like: ", response)
        }catch(error){
            console.log("post dislike error: ", error);
        }
    }

    async function handleLike(){
        try{
            const response = await axios.post(url + `/post/${post.id}/likes` ,{},{withCredentials : true})
            updatePost({...post, likes : post.likes + 1}, "update")
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

    function handleCommentInput(e : React.ChangeEvent<HTMLInputElement>){
        setCommentValue(e.currentTarget.value);
    }

    function handleCommentChange(newComment : Comment, operation : "add" | "remove" | "update"){
        if(operation == "remove"){
            setComments([...comments.filter((c: Comment) => c.id != newComment.id)])
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
        }
    }

    async function deletePost(){
        try{
            const response = await axios.delete(url + `/post/${post.id}`, {withCredentials : true})
            console.log("delete post response: ", response);
            updatePost(post , "remove")
        }catch(error){
            console.log("delete post error: ", error);
        }
    }

    return(
        <div>
            blogs: {JSON.stringify(post)}
            <div>
                <div>
                    <UpdatePost post={post} updatePost={updatePost}></UpdatePost>
                    <Button onClick={deletePost} variant="primary">delete</Button>
                    <Button onClick={handleLike} variant="primary">like</Button>
                    <Button onClick={handleDislike} variant="primary">dislike</Button>
                    <Button id={post.id.toString()} onClick={getMoreComments} variant="primary">more</Button>
                    <div>
                        <Form>
                          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control type="text" onChange={handleCommentInput} value={commentValue}/>
                          </Form.Group>
                        </Form>
                        <Button onClick={sendComment}>send com</Button>
                    </div>
                    {comments.map((c : any) => 
                        <div key={c.id}>
                            <Comment comment={c} updateComment={handleCommentChange}></Comment>
                        </div>
                    )}
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


export type AddPostProp = {
    updatePost : (p : Post, operation : "remove" | "add" | "update") => void
}

export function AddPost(props: AddPostProp){
    const [title , setTitle] = useState("")
    const [text , setText] = useState("")

    function handleTextChange(e : React.ChangeEvent<HTMLInputElement>){
        setText(e.currentTarget.value)
    }

    function handleTitleChange(e : React.ChangeEvent<HTMLInputElement>){
        setTitle(e.currentTarget.value)
    }

    async function sendPost(){
        try{
            const response = await axios.post(url + '/post', {title : title, text : text}, {withCredentials : true})
            props.updatePost(response.data as Post, "add")
            console.log(response.data);
        }catch(error){
            console.log("send post error: ", error);
        }
    }

    return(
        <div>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" onChange={handleTitleChange} value={title}/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Text</Form.Label>
                <Form.Control  as="textarea" rows={3} type="text" onChange={handleTextChange} value={text}/> 
              </Form.Group>
            </Form>
            <Button onClick={sendPost}>post it!</Button>
        </div>
    )
}