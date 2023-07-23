import { IconContext } from "react-icons";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import '../index.css'
import { Post } from "../pages/Post";

type LikeButtonProp = {
    like : (id : number | string) => void
    dislike : (id : number | string) => void
    likedByYou : boolean,
    id : number | string
}

export function LikeButton({like, dislike, likedByYou, id} : LikeButtonProp){

    return(
        <div className="d-flex justify-content-center align-items-center">
        {
            likedByYou ? 
            <button className="like button" onClick={() => dislike(id)}>
                <IconContext.Provider value={{color: "red"}}>
                    <MdFavorite></MdFavorite>
                </IconContext.Provider>

            </button>
            :
            <button className="like button" onClick={() => like(id)}>
                <IconContext.Provider value={{color: "grey"}}>
                    <MdFavoriteBorder></MdFavoriteBorder>
                </IconContext.Provider>
            </button>
        }
        </div>
    )
}