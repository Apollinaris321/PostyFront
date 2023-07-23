import { Link } from "react-router-dom"
import { LikeButton } from "./LikeButton"
import { convertDateTime } from "../utils"
import { useContext, useEffect, useState } from "react"
import { userContext, userInfo } from "../user"
import { SatisfiesExpression } from "typescript"
import { Post } from "../pages/Post"
import { Comment } from "./Comment"

export type CardProp2 = {
    author : string,
    likes : number, 
    likedByYou : boolean,
    createdAt : string,
    id : number | string,
    text : string,
}

export type CardProp = {
    info : Post | Comment ,
    linkTo : string,
    handleLike : (id : number | string) => void
    handleDislike : (id : number | string) => void
} 

export function Card({info , linkTo, handleDislike, handleLike} : CardProp){

    return(
        <div className="postPreview">
            <div className="header">
                <div className="authorName">
                    <Link className="linkText" to={`/profile/${info.authorName}`}>
                        @{info.authorName}
                    </Link>
                </div>
                <div className="date">
                    {convertDateTime(info.createdAt)}
                </div>
            </div>
                <Link className="linkText" to={linkTo}>
                    <div className="title">
                        <div className="fs-4 d-flex align-content-center justify-content-start">
                            {info.text}
                        </div>
                    </div>
                </Link>
                <div className="d-flex flex-row justify-content-start align-items-center">
                    <div>
                        {info.likes}
                    </div>
                    <LikeButton dislike={handleDislike} like={handleLike} likedByYou={info.likedByYou} id={info.id}></LikeButton>
                </div>
        </div>
    )
}