import { useEffect, useState } from "react"
import A from "./A"

interface iPropsPaginator{
    countElements: number,
    elementsOnThePage: number,
    baseLinkAdress: string,
    currentPage: number
}

interface iArrayPathes{
    id: number,
    path: string
}
const Paginator=({countElements, elementsOnThePage, currentPage, baseLinkAdress}: iPropsPaginator)=>{
    const [countPages, setCountPages] = useState(0)
    const [arrayOfData, setArrayOfData]:[iArrayPathes[], Function] = useState([])
    useEffect(()=>{
        const countPage = countElements/elementsOnThePage===Math.trunc(countElements/elementsOnThePage)?Math.trunc(countElements/elementsOnThePage):Math.trunc(countElements/elementsOnThePage)+1
        setCountPages(countPage)
        const tempArray = []
        for(let i=0; i<countPage; i++){
            tempArray.push({id: i, path: String(i+1)})    
        }
        setArrayOfData(tempArray)
    },[countElements, elementsOnThePage])

    return(<>
    {countPages===1?
    <></>:
    <nav aria-label="Page navigation example">
    <ul className="pagination">
        <li className="page-item"><A className={`page-link ${currentPage ===1?'disabled':''}`} href={`${baseLinkAdress}/${currentPage-1}`}>Previous</A></li>
        {arrayOfData.map(element=>
            <li className={currentPage===Number(element.path)?"page-item active":"page-item"} key={element.id} >
                <A className="page-link" href={`${baseLinkAdress}/${element.path}`}>{element.path}</A>
            </li>    
            )
        }
        <li className="page-item"><A className={`page-link ${currentPage === countPages?'disabled':''}`} href={`${baseLinkAdress}/${currentPage+1}`}>Next</A></li>
    </ul>
    </nav>
    }
    </>
    )
}

export default Paginator