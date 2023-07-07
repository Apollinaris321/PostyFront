import axios from "axios";
import { ChangeEvent, useState } from "react"

export function Solver(){
    const [blogs, setBlogs] = useState<any[]>([])
    const [nextUrl, setNextUrl] = useState("")

    const url = 'https://localhost:7226/api/Post/feed?PageNumber=1&PageSize=10&sort=new'

    async function getBlogs(){
        let resp = await axios.get(url);
        console.log(resp.data);
        setBlogs(resp.data.data)
        setNextUrl(resp.data.nextMessage)
    }

    async function getNextBlogs(){
        let resp = await axios.get(nextUrl);
        console.log(resp.data);
        if(resp.data.nextMessage == nextUrl){
            ;
        }else{
            setBlogs([...blogs, ...resp.data.data])
            setNextUrl(resp.data.nextMessage)
        }
    }

    return(
        <div>
            <div>
                <button onClick={getBlogs}>click</button>
            </div>
            <div>
                {blogs.map((b : any) => <div key={b.id}>title: {b.title},  text: {b.text}</div>)}
            </div>
            <button onClick={getNextBlogs}>next</button>
        </div>
    )
}

function Comment(){
    return(
        <div>
            comment
        </div>
    )
}