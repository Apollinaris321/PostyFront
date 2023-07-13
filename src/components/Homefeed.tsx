import axios from "axios";
import { useState, useEffect } from "react";
import { AddPost, Post, PostResponse } from "./Post";
import { Auth, Logout } from "./Auth";
import { url } from "./Url";
import { Button, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";

export function Homefeed(){
    const [postResponse, setPostResponse] = useState<PostResponse | null>(null)
    const [posts, setPosts] = useState<Post[]>([])


    useEffect(() => {
        console.log("rendering...");
        
        const getPostsUseEffect = async () => {
            await getPosts();
        }
        getPostsUseEffect();
    },[])

    async function getPosts(){
        try{
            const response = await axios.get(url + "/post/feed", {withCredentials : true});
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
                const response = await axios.get(url + `/post/feed?pageSize=10&pageNumber=${postResponse.currentPage + 1}&sort=new`, {withCredentials : true});
                setPostResponse(response.data as PostResponse)
                setPosts([...posts, ...response.data.posts])
            }catch(error){
                console.log("load more posts error: ", error);
            }
        }
    }

    function handlePostChange(newPost : Post, operation : "update" | "remove" | "add"){
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
        <div className="row">
            <div className="col"></div>
            <div className="col">
                logout: 
                <Logout></Logout>
                login:
                <Auth></Auth>
                new post:
                <AddPost updatePost={handlePostChange}></AddPost>
                <div>
                    <Button onClick={loadMorePosts} variant="primary">more</Button>
                </div>
                <div>
                    Posts:
                    {
                    posts.map((p : Post) => 
                        <div key={p.id}>
                            <Post post={p} updatePost={handlePostChange}></Post>
                        </div>
                        ) 
                    }
                </div>
            </div>
            <div className="col"></div>

        </div>
    )
}