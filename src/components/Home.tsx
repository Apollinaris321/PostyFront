import { useContext, useEffect, useState } from "react";
import {  Post,  PostResponse } from "./Post";
import { client } from "../api";
import { Page } from "./Page";
import { Link } from "react-router-dom";
import { Auth, Logout } from "./Auth";
import { AddPost } from "./AddPost";
import { Button, Card } from "react-bootstrap";
import { userContext } from "../user";
import '../index.css';
import TopNavbar from "./Topnavbar";

export default function Home(){
    const [posts, setPosts] = useState<Post[]>([])
    const [page, setPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)

    const {user, setUser} = useContext(userContext)

    useEffect(() => {
        loadPage(page)
    },[page])

    async function loadPage(page : number){
        try{
            const response = await client.get(`/post/feed?pageSize=10&pageNumber=${page}&sort=new`);
            let responseData = response.data as PostResponse
            setPosts(responseData.posts)
            setPage(responseData.currentPage)
            setLastPage(responseData.lastPage)
        }catch(error){
            console.log("load more posts error: ", error);
        }
    }

    function handleUpdatePost(newPost : Post, operation : "update" | "remove" | "add"){
        if(operation == "remove"){
            //setPosts([...posts.filter(p => p.id != newPost.id)])
            loadPage(page)
        }else if(operation == "update"){
            setPosts([...posts.map(p => {
                if(p.id == newPost.id){
                    return newPost
                }else{
                    return p
                }
            })])
        }else if(operation == "add"){
            loadPage(page)
            //setPosts([{...newPost}, ...posts])
        }
    }

    return(
        <div className="home row">
            <div className="col-sm"></div>
            <div className="col-6 d-flex flex-column gap-2">
                <AddPost updatePost={handleUpdatePost}></AddPost>
                <div className="d-flex flex-column gap-2">
                    {posts.map(p => {
                        return(
                            <div key={p.id}>
                                <PostTitleCard post={p} updatePost={handleUpdatePost}></PostTitleCard>
                            </div>
                        )
                    })}
                </div>
                <div className="d-flex justify-content-center">
                    <Page page={page} lastPage={lastPage} updatePage={setPage}></Page>
                </div>
            </div>
            <div className="col-sm"></div>
        </div>
    )
}

type PostTitleCardProp = {
    post : Post,
    updatePost : (p : Post, operation : "add" | "remove" | "update") => void
}
export function PostTitleCard({post, updatePost} : PostTitleCardProp){
    return(
        <Card className="d-flex flex-row  align-content-center p-1">
            <PostDisplayLike post={post} updatePost={updatePost}></PostDisplayLike>
            <div className="d-flex flex-column w-100">
                <Card.Body className="p-0">
                    <Link className="linkText" to={`/post/${post.id}`}>
                        <div className="fs-3 d-flex justify-content-center">
                            {post.title}
                        </div>
                    </Link>
                </Card.Body>

                <Card.Footer className="d-flex flex-row justify-content-around">
                    <Link className="linkText" to={`/profile/${post?.authorName}`}>
                        {post.authorName}
                    </Link>
                    <div>
                        {post.createdAt}
                    </div>
                </Card.Footer>
                <div className="description">

                </div>
            </div>
        </Card>
    )
}

type PostDisplayLikeProp = {
    post : Post,
    updatePost : (p : Post, operation : "add" | "remove" | "update") => void
}

function PostDisplayLike({post, updatePost} : PostDisplayLikeProp){
    
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
        <div className="d-flex gap-1 align-items-center">
            <div>
                {post.likes}
            </div>
            <div className="d-flex flex-column gap-1">
                <Button size="sm" variant="primary" onClick={handleLike}>Like</Button>
                <Button size="sm" variant="danger" onClick={handleDislike}>Dislike</Button>
            </div>
        </div>
    )
}