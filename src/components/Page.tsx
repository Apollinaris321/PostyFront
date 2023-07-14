import { useEffect, useState } from "react"
import { Pagination } from "react-bootstrap"

type PageProps = {
    page? : number,
    lastPage? : number,
    updatePage : (page : number) => void
}

export function Page({page = 1, lastPage = 1, updatePage} : PageProps){
    const [pages, setPages] = useState([...calc()])

    useEffect(() => {
        setPages([...calc()])
    },[page, lastPage])

    function calc() : number[]{
        const range = 4
        const halfRange = Math.floor(range/2)
        let start = page
        let end = page 
        const minStart = 1
        const maxEnd = lastPage

        if(lastPage > range){

        for(let i=0;i<=range;){
            console.log("stuck");
            
            if(start > minStart){
                start -= 1
                i += 1
            }
            if(end < maxEnd && i<range){
                end += 1
                i += 1
            }
            if(i==range){
                break
            }
            if(maxEnd == minStart){
                break
            }
        }
        }else{
            end = maxEnd
            start = minStart
        }

        const arr : number[] = [] 
        for(let i = start;i <= end;i++){
            arr.push(i);
        }
        return  arr
    }

    return(
        <div>
            <Pagination>
                <Pagination.First onClick={() => updatePage(1)}>
                    First
                </Pagination.First>
                {pages.map(p => {
                    return(
                    <Pagination.Item active={page == p} onClick={() => updatePage(p)}>
                        {p}
                    </Pagination.Item>
                    )
                })}
                <Pagination.Last onClick={() => updatePage(lastPage)}>
                    Last
                </Pagination.Last>
            </Pagination>
        </div>
    )
}