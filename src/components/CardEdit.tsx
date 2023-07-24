import { Link } from "react-router-dom"
import { LikeButton } from "./LikeButton"
import { convertDateTime } from "../utils"
import { useContext, useEffect, useState } from "react"
import { userContext, userInfo } from "../user"
import { SatisfiesExpression } from "typescript"
import { Post } from "../pages/Post"
import { Comment } from "./Comment"
import { MdDelete, MdDeleteOutline, MdDone, MdEdit, MdSave } from "react-icons/md"
import { IconContext } from "react-icons"

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
    handleUpdate : (id : string | number, newText : string) => void
    handleDelete : (id : string | number) => void
    handleLike : (id : string | number) => void
    handleDislike : (id : string | number) => void
} 

export function CardEdit({ info , linkTo, handleDelete, handleUpdate, handleDislike, handleLike} : CardProp){
    const [edit, setEdit] = useState(false)
    const [textEdit, setTextEdit] = useState(info.text)

    const {user} = useContext(userContext)

    useEffect(() => {
        setTextEdit(info.text)
    },[info])

    function handleTextChange(e : React.ChangeEvent<HTMLInputElement>){
        setTextEdit(e.currentTarget.value)
    }

    function handleSave(){
        handleUpdate(info.id, textEdit)
        setEdit(false)
    }

    function handleDiscard(){
        setTextEdit(info.text)
        setEdit(false)
    }

    return(
        <div className="postPreview">
            <div className="header">
                <div className="authorName">
                    <Link className="linkText colorB" to={`/profile/${info.authorName}`}>
                        @{info.authorName}
                    </Link>
                </div>
                <div className="date">
                    {convertDateTime(info.createdAt)}
                </div>
            </div>
            {
                linkTo == "" ? 
                    <div className="title">
                            {
                                edit ? 
                                <input type="text" onChange={handleTextChange} value={textEdit}></input>
                                :
                                <div className="fs-4 d-flex align-content-center justify-content-start">
                                    {info.text}
                                </div>
                            }
                    </div>
                    :
                <Link className="linkText colorB" to={linkTo}>
                    <div className="title">
                            {
                                edit ? 
                                <input type="text" onChange={handleTextChange} value={textEdit}></input>
                                :
                                <div className="fs-4 d-flex align-content-center justify-content-start">
                                    {info.text}
                                </div>
                            }
                    </div>
                </Link>
            }
                <div className="d-flex flex-row gap-1 pt-1 justify-content-start align-items-center">
                    <div>
                        {info.likes}
                    </div>
                    <LikeButton dislike={handleDislike} like={handleLike} likedByYou={info.likedByYou} id={info.id}></LikeButton>
                    { user?.username == info.authorName && edit == false ? <button className="btn btn-sm btn-primary" onClick={() => setEdit(true)}>
                        <IconContext.Provider value={{size: "1.2em"}}>
                            <MdEdit></MdEdit>
                        </IconContext.Provider>
                    </button> : null }
                    { user?.username == info.authorName && edit == false ? <button className="btn btn-sm btn-danger" onClick={() => handleDelete(info.id)}>
                        <IconContext.Provider value={{size: "1.2em"}}>
                            <MdDeleteOutline></MdDeleteOutline>
                        </IconContext.Provider>
                    </button> : null }
                    {edit ? 
                    <button className="btn btn-sm btn-primary" onClick={handleSave}>
                        Save
                    </button>
                     : null }
                    {edit ? 
                    <button className="btn btn-sm btn-danger" onClick={handleDiscard}>
                        Discard

                    </button>
                     : null}
                </div>
        </div>
    )
}