import { useContext, useEffect, useState } from "react";
import {  Post,  PostResponse } from "./Post";
import { client } from "../api";
import { Page } from "../components/Page";
import { AddPost } from "../components/AddPost";
import { Card } from "../components/Card";
import { userContext } from "../user";
import '../index.css';

export default function Home(){
    const [posts, setPosts] = useState<Post[]>([])
    const [page, setPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const {user} = useContext(userContext)

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

    async function handleSendPost(newText : string){
        try{
            const response = await client.post('/post', {title : "empty", text : newText})
            console.log(response.data);
            const newPost = response.data as Post
            const newPosts = [...posts]
            if(posts.length >= 10){
                newPosts.pop()
            }
            setPosts([newPost, ...newPosts])
        }catch(error){
            console.log("send post error: ", error);
        }

    }

    async function handleDislike(id : string | number){
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

    async function handleLike(id : string | number){
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

    return(
        <div className="row">
            <div className="col"></div>
            <div className="col-6">
                <div className="d-flex flex-column pt-1 gap-2">
                    <div>
                        <AddPost sendPost={handleSendPost}></AddPost>
                    </div>
                    <div className="d-flex flex-column gap-2">
                        {posts.map(p => {
                            return(
                                <div key={p.id}>
                                    <Card 
                                        info={p} 
                                        linkTo={`Post/${p.id}`} 
                                        handleLike={handleLike}
                                        handleDislike={handleDislike}
                                    />
                                </div>
                            )
                        })}
                    </div>

                    <div className="d-flex justify-content-center">
                        <Page page={page} lastPage={lastPage} updatePage={setPage}></Page>
                    </div>
                </div>
            </div>
            <div className="col"></div>
        </div>
    )
}
