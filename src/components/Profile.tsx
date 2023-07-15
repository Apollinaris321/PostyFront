import { Link, useParams } from "react-router-dom";
import { Comment, CommentResponse } from "./Comment";
import { useContext, useEffect, useState } from "react";
import { Post, PostResponse } from "./Post";
import { Button, ButtonGroup, Card, Pagination, Spinner, Tab, Tabs, ToggleButton } from "react-bootstrap";
import { client } from "../api";
import { userContext } from "../user";
import { Page } from "./Page";
import userEvent from "@testing-library/user-event";

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
    },[show])

    useEffect(() => {
        if(id){
            getProfile(id)
        }
        if(show == "comment"){
            getComments(commentPage)
        }else{
            getPosts(postPage)
        }
    },[])

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
            setPosts(responseData.posts)
            setPostPage(responseData.currentPage)
            setPostLastPage(responseData.lastPage)
        }catch(error){
            console.log("load more posts error: ", error);
        }
    }

    return(
        <div>
            <Link to={"../"}>
                back
            </Link>
            <ProfileCard profile={profile}></ProfileCard>
            <Tabs defaultActiveKey="posts" id="profileContent">
                <Tab onClick={() => setShow("post")} eventKey="posts" title="Posts">
                    <div>
                        {posts.map(p => <div key={p.id}>{JSON.stringify(p)}</div>)}
                    </div>
                    <Page updatePage={setPostPage} page={postPage} lastPage={postLastPage}></Page>
                </Tab>
                <Tab  onClick={() => setShow("comment")} eventKey="comments" title="Comments">
                    <div>
                        {posts.map(p => <div key={p.id}>{JSON.stringify(p)}</div>)}
                    </div>

                    <Page updatePage={setCommentPage} page={commentPage} lastPage={commentLastPage}></Page>
                </Tab>
            </Tabs>
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
        <div>
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
        </div>
    )
}