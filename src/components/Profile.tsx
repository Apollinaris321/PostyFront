import { Link, useParams } from "react-router-dom";
import { Comment, CommentResponse } from "./Comment";
import {  useEffect, useState } from "react";
import { Post, PostResponse } from "./Post";
import { Button, ButtonGroup, Card, Pagination, Spinner, Tab, Tabs, ToggleButton } from "react-bootstrap";
import { client } from "../api";
import { Page } from "./Page";

export default function Profile() {
    const [comments, setComments] = useState<Comment[]>([])
    const [commentPage, setCommentPage] = useState(1)
    const [commentLastPage, setCommentLastPage] = useState(1)
    const [posts, setPosts] = useState<Post[]>([])
    const [postPage, setPostPage] = useState(1)
    const [postLastPage, setPostLastPage] = useState(1)
    const [profile, setProfile] = useState<Profile | null>(null)

    const [show, setShow] = useState("comment")

    const {id} = useParams()

    useEffect(() => {
        if(show == "comment"){
            getComments(commentPage)
            setPosts([])
        }else{
            getPosts(postPage)
            setComments([])
        }
    },[])

    useEffect(() => {
        if(id){
            getProfile(id)
        }
    },[])

    async function getProfile(id : string){
        try{
            const response = await client.get(`profile/${id}`)
            await getComments(commentPage)
            await getPosts(postPage)
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
            setPosts(responseData.posts)
            setPostPage(responseData.currentPage)
            setPostLastPage(responseData.lastPage)
        }catch(error){
            console.log("load more posts error: ", error);
        }
    }

    function convertDateTime(date : string){
        let timestamp = Date.parse(date)
        let newDate = new Date(timestamp)
        return newDate.toDateString()
    }

    return(
        <div className="row wrapper">
            <div className="col"></div>
            <div className="col-8">
                <div className="d-flex flex-column gap-2">
                    <ProfileCard profile={profile}></ProfileCard>
                    <Tabs className="d-flex justify-content-center" defaultActiveKey="posts" id="profileContent">
                        <Tab onClick={() => setShow("post")} eventKey="posts" title="Posts">
                            <div className="d-flex flex-column gap-2">
                                {posts.map(post =>
                                    <div key={post.id}>
                                        <Card >
                                            <Card.Header className="d-flex flex-row justify-content-around">
                                                <Link to={`/profile/${post?.authorName}`}  className="linkText">
                                                    {post?.authorName}
                                                </Link>
                                                <div>
                                                    {post?.createdAt}
                                                </div>
                                            </Card.Header>
                                            <Card.Body>
                                                <div>
                                                    <Card.Title>
                                                        <Link className="linkText" to={`../post/${post.id}`}>
                                                            <div>
                                                                {post.title}
                                                            </div>
                                                        </Link>
                                                    </Card.Title>
                                                    <Card.Text>
                                                        <div>
                                                            {post.text}
                                                        </div>
                                                    </Card.Text>
                                                </div>
                                            </Card.Body>
                                        </Card>    
                                    </div>
                                )}
                            </div>
                            <div className="d-flex justify-content-center ">
                                <Page updatePage={setPostPage} page={postPage} lastPage={postLastPage}></Page>
                            </div>
                        </Tab>
                        <Tab  onClick={() => setShow("comment")} eventKey="comments" title="Comments">
                            <div className="d-flex flex-column gap-2">
                                {comments.map(comment => 
                                    <div key={comment.id}>
                                        <Card>
                                            <Card.Body>
                                                <div className="d-flex flex-row align-items-center gap-2">
                                                    <div>
                                                        {comment.likes}
                                                    </div>
                                                    <div className="d-flex flex-column w-100">
                                                        <div className="fs-4 d-flex align-content-center justify-content-start">
                                                            {comment.text}
                                                        </div>
                                                        <Card.Footer>
                                                            <div className="d-flex flex-row align-items-end justify-content-between gap-2">
                                                                <Link to="/" className="linkText">
                                                                    {comment.authorName}
                                                                </Link>
                                                                <div>
                                                                    {convertDateTime(comment.createdAt)}
                                                                </div>
                                                            </div>
                                                        </Card.Footer>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                )}
                            </div>
                            <div className="d-flex justify-content-center ">
                                <Page updatePage={setCommentPage} page={commentPage} lastPage={commentLastPage}></Page>
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
            <div className="col"></div>
        </div>
    )
}

export type Profile = {
    username : string,
    email : string
}

export type ProfileCardProp = {
    profile : Profile | null
}

export function ProfileCard({profile} : ProfileCardProp){
    return(
        <Card>
            <Card.Header>Profile</Card.Header>
            <Card.Body>
                <Card.Text>
                    Username: {profile ? profile.username : ""}
                </Card.Text>
                <Card.Text>
                    Email: {profile ? profile.email : ""}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}