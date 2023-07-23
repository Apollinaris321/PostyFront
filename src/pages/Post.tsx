import { useState, useEffect, useContext } from "react"
import { CommentSection } from "../components/Comment"
import { useNavigate, useParams } from "react-router"
import { client } from "../api"
import { userContext } from "../user"
import { CardEdit } from "../components/CardEdit"
import "../index.css";

export type PostResponse = {
    currentPage : number,
    lastPage : number,
    posts : any[]
}

export type Post = {
    id : number,
    title : string, 
    text : string,
    authorName : string,
    createdAt : string,
    likes : number,
    likedByYou : boolean
}

export function Post(){
    const [post, setPost] = useState<Post>({title: "", text: "", likes: 0,authorName: "", id: 0, createdAt: "", likedByYou: false})
    const {id} = useParams()
    const {user} = useContext(userContext)
    const navigate = useNavigate();

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
            setPost({...response.data})
        }catch(error){
            console.log("error: ", error);
        }
    }
    
    async function handleDislike(){
        try{
            const response = await client.delete(`/post/${id}/likes`)
            setPost({...post, likes : post.likes - 1, likedByYou: false})
        }catch(error){
            console.log("post dislike error: ", error);
        }
    }

    async function handleLike(){
        try{
            const response = await client.post(`/post/${post.id}/likes`)
            setPost({...post, likes : post.likes + 1, likedByYou: true})
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

    async function handleUpdate(id : string | number, newText : string){
        try{
            const response = await client.put(`/post/${post.id}`, {text : newText, title: post.title})
            const postResponse = response.data as Post
            setPost({...postResponse})
        }catch(error){
            console.log("edit post error: ", error);
        }
    }

    return(
        <div className="postwrapper row">
            <div className="col"></div>
            <div className="col-6">
                    <div className="d-flex flex-column gap-1 ">
                        <div className="pt-1">
                            <CardEdit 
                                info={{...post}}
                                linkTo={`/post/${post.id}`} 
                                handleUpdate={handleUpdate}
                                handleDelete={deletePost}
                                handleLike={handleLike} 
                                handleDislike={handleDislike}
                            ></CardEdit>
                        </div>
                        <div>
                            <CommentSection postId={id ? id : "1"}></CommentSection>
                        </div>
                    </div>
            </div>
            <div className="col"></div>
        </div>
    )
}