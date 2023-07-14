import { useEffect, useState } from "react";
import {  AddPost, Post, PostResponse } from "./Post";
import { client } from "../api";
import { Page } from "./Page";
import { Link } from "react-router-dom";
import { Auth, Logout } from "./Auth";

export default function Home(){
    const [posts, setPosts] = useState<Post[]>([])
    const [page, setPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)

    useEffect(() => {
        loadPage()
    },[page])

    async function loadPage(){
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
            setPosts([...posts.filter(p => p.id != newPost.id)])
        }else if(operation == "update"){
            setPosts([...posts.map(p => {
                if(p.id == newPost.id){
                    return newPost
                }else{
                    return p
                }
            })])
        }else if(operation == "add"){
            setPosts([{...newPost}, ...posts])
        }
    }

    return(
        <div>
            <Logout></Logout>
            <Auth></Auth>
            <AddPost updatePost={handleUpdatePost}></AddPost>
            {posts.map(p => {
                return(
                    <div>
                        <Link to={`/post/${p.id}`}>
                            Click me!
                        </Link>
                        {JSON.stringify(p)}
                    </div>
                )
            })}
            <Page page={page} lastPage={lastPage} updatePage={setPage}></Page>
        </div>
    )
}