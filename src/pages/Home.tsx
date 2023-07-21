import { useContext, useEffect, useState } from "react";
import {  Post,  PostResponse } from "./Post";
import { client } from "../api";
import { Page } from "../components/Page";
import { Link, ScrollRestoration } from "react-router-dom";
import { Auth, Logout } from "../components/Auth";
import { AddPost } from "../components/AddPost";
import { Button, Card } from "react-bootstrap";
import { userContext } from "../user";
import '../index.css';
import { PostTitleCard } from "../components/PostDisplay";

export default function Home(){
    const [posts, setPosts] = useState<Post[]>([])
    const [page, setPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)

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
            <ScrollRestoration></ScrollRestoration>
        </div>
    )
}
