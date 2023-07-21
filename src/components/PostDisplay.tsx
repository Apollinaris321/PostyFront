import { Button, Card } from "react-bootstrap"
import { Post } from "../pages/Post"
import { Link } from "react-router-dom"
import { client } from "../api"
import '../index.css';
import { Favorite, FavoriteBorder, FavoriteOutlined } from "@mui/icons-material";

export type PostTitleCardProp = {
    post : Post,
    updatePost : (p : Post, operation : "add" | "remove" | "update") => void
}

export function PostTitleCard({post, updatePost} : PostTitleCardProp){

    function convertDateTime(date : string){
        let timestamp = Date.parse(date)
        let newDate = new Date(timestamp)
        return newDate.toDateString()
    }

    return(
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
                <Link className="linkText" to={`/post/${post.id}`}>
            <div className="title">
                    {post.title}
            </div>
                </Link>
            <PostPreviewLike post={post} updatePost={updatePost}></PostPreviewLike>
        </div>
    )
}

type PostPreviewLikeProp = {
    post : Post,
    updatePost : (p : Post, operation : "add" | "remove" | "update") => void
}

export function PostPreviewLike({post, updatePost} : PostPreviewLikeProp){
    
    async function handleDislike(){
        try{
            const response = await client.delete(`/post/${post.id}/likes` )
            console.log("like: ", response)
            updatePost({...post, likes : post.likes - 1}, "update")
        }catch(error){
            console.log("post dislike error: ", error);
        }
    }

    async function handleLike(){
        try{
            const response = await client.post(`/post/${post.id}/likes` )
            console.log("dislike: ", response)
            updatePost({...post, likes : post.likes + 1}, "update")
        }catch(error){
            console.log("post like error: ", error);
        }
    }

    return(
        <div className="likes">
            <div className="likeCounter">
                {post.likes}
            </div>
            <button onClick={handleDislike} className="btn btn-sm ">
                <Favorite  fontSize="small" color="error" />
            </button>
            <button onClick={handleLike} className="btn btn-sm ">
                <FavoriteBorder   fontSize="small" color="error" />
            </button>
        </div>
    )
}