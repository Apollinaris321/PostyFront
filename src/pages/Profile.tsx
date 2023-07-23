import { useParams } from "react-router-dom";
import { Comment, CommentResponse } from "../components/Comment";
import {  useEffect, useState } from "react";
import { Post, PostResponse } from "./Post";
import { Tab, Tabs } from "react-bootstrap";
import { client } from "../api";
import { Page } from "../components/Page";
import { Card } from "../components/Card";
import { ProfileCard } from "../components/ProfileCard";

export type Profile = {
    username : string,
    email : string
}

export default function Profile() {
    const [comments, setComments] = useState<Comment[]>([])
    const [commentPage, setCommentPage] = useState(1)
    const [commentLastPage, setCommentLastPage] = useState(1)

    const [posts, setPosts] = useState<Post[]>([])
    const [postPage, setPostPage] = useState(1)
    const [postLastPage, setPostLastPage] = useState(1)

    const [profile, setProfile] = useState<Profile | null>(null)
    const [show, setShow] = useState("post")
    const {id} = useParams()

    useEffect(() => {
        if(show == "post"){
            getPosts(postPage)
        }else{
            getComments(commentPage)
        }

        if(id){
            getProfile(id)
        }
    },[])

    useEffect(() => {
        console.log("posts: ", posts);
        
    },[posts])

    function handleShow(val : string){
        setShow(val)
        if(val == "post"){
            getPosts(postPage)
        }else if(val == "comment"){
            getComments(commentPage)
        }
    }

    async function getProfile(id : string){
        try{
            const response = await client.get(`profile/${id}`)
            setProfile(response.data)
        }catch(error){
            console.log("get profile error: ", error);
        }
    }

    async function getComments(page : number){
        try{
            const response = await client.get(`profile/${id}/comments?pageSize=10&pageNumber=${page}`)
            const commentResponse = response.data as CommentResponse
            setComments([...commentResponse.comments])
            setCommentPage(commentResponse.currentPage)
            setCommentLastPage(commentResponse.lastPage)
        }catch(error){
            console.log("error more comments: ", error);
        }
    }

    async function getPosts(page : number){
        try{
            const response = await client.get(`profile/${id}/posts?pageSize=10&pageNumber=${page}&sort=new`);
            let responseData = response.data as PostResponse
            setPosts([...responseData.posts])
            setPostPage(responseData.currentPage)
            setPostLastPage(responseData.lastPage)
        }catch(error){
            console.log("load more posts error: ", error);
        }
    }

    async function handlePostDislike(id : string | number){
        try{
            const response = await client.delete(`/post/${id}/likes` )
            setPosts([...posts.map(p => {
                if(p.id == id){
                    return {...p, likes : p.likes - 1, likedByYou: false}
                }else{
                    return p
                }
            })])
        }catch(error){
            console.log("post dislike error: ", error);
        }
    }

    async function handlePostLike(id : string | number){
        try{
            const response = await client.post(`/post/${id}/likes` )
            setPosts([...posts.map(p => {
                if(p.id == id){
                    return {...p, likes : p.likes + 1, likedByYou: true}
                }else{
                    return p
                }
            })])
        }catch(error){
            console.log("post like error: ", error);
        }
    }
 
    async function handleCommentDislike(id : string | number){
        try{
            const response = await client.delete(`/comment/${id}/likes` )
            setComments([...comments.map(c => {
                if(c.id == id){
                    return {...c, likes : c.likes - 1, likedByYou: false}
                }else{
                    return c
                }
            })])
        }catch(error){
            console.log("comment dislike error: ", error);
        }
    }

    async function handleCommentLike(id : string | number){
        try{
            const response = await client.post(`/comment/${id}/likes` )
            setComments([...comments.map(c => {
                if(c.id == id){
                    return {...c, likes : c.likes + 1, likedByYou: true}
                }else{
                    return c
                }
            })])
        }catch(error){
            console.log("post like error: ", error);
        }
    }   

    return(
        <div className="row wrapper">
            <div className="col"></div>
            <div className="col-8">
                <div className="d-flex flex-column gap-2">
                    <ProfileCard profile={profile}></ProfileCard>
                    <div className="d-flex flex-column gap-1">
                        <div className="d-flex flex-row align-items-center justify-content-center gap-1">
                            <button className={show  == "post" ?  "btn btn-primary" : "btn btn-outline-primary"} onClick={() => handleShow("post")}>post</button>
                            <button className={show  == "comment" ?  "btn btn-primary" : "btn btn-outline-primary"} onClick={() => handleShow("comment")}>comment</button>
                        </div>
                        <div>
                            {show == "post"?
                            <div className="d-flex flex-column gap-2">
                                {posts.map(post =>
                                    <div key={post.id}>
                                        <Card 
                                            info={{...post}}
                                            linkTo={`/post/${post.id}`}
                                            handleDislike={handlePostDislike}
                                            handleLike={handlePostLike}
                                        />
                                    </div>
                                )}                           
                                <div className="d-flex align-items-center justify-content-center">
                                    <Page updatePage={getPosts} lastPage={postLastPage} page={postPage}></Page>
                                </div>
                            </div>
                                :
                            <div className="d-flex flex-column gap-2">
                                {comments.map(comment => 
                                    <div key={comment.id}>
                                        <Card 
                                            info={{...comment}}
                                            linkTo={`/post/${comment.postId}`}
                                            handleDislike={handleCommentDislike}
                                            handleLike={handleCommentLike}
                                        />
                                    </div>
                                )}
                                <div className="d-flex align-items-center justify-content-center">
                                    <Page updatePage={getComments} lastPage={commentLastPage} page={commentPage}></Page>
                                </div>
                            </div>
                        }
                        </div>
                    </div>


                </div>
            </div>
            <div className="col"></div>
        </div>
    )
}