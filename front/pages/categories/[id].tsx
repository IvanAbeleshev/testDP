import axios from 'axios'
import {getCookie} from 'cookies-next'
import { BACKEND_URL } from '../../constant'
import { iCategory, userRole } from '../../interfaces'
import A from '../../components/A'
import { useRouter } from 'next/router'
import { MouseEventHandler } from 'react'
import { NextPageContext } from 'next'
import Paginator from '../../components/Paginator'
import { useSelector } from 'react-redux'
import { selectAuthData } from '../../store/authSlice'
import { getRequestHeader } from '../../common'

interface iPropsListOfCategories{
    count: number,
    rows: iCategory[]
}

const ListOfCategories=({count, rows}: iPropsListOfCategories)=>{
    const router = useRouter()
    const userData = useSelector(selectAuthData)

    const onClickRow=(indexPath: number)=>{
        const onClick:MouseEventHandler=()=>{
            router.push(`/blogs/1?categoryId=${indexPath}`)
        }
        return onClick       
    }

    const removeItem=(categoryId:number)=>{
        const clickRemoveCategory:MouseEventHandler=(event)=>{
            event.stopPropagation()
            axios.delete(`${BACKEND_URL}/category/${categoryId}`, getRequestHeader(String(userData.authToken), false)).then(result=>{
                if(result.status === 200){
                    router.reload()
                }
            })
        }
        return clickRemoveCategory
    }
    

    return (
        <div className="container">
        <div className='container'>
            {userData.authRole === userRole.admin&&<A className='btn btn-primary' href='/create/category'>add new category</A>}
        </div>

        <table className="table table-hover">
        <thead>
            <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Description</th>
            <th scope="col">Actions</th>
            </tr>
        </thead>
        <tbody>
            {rows.map((element, index)=>
            <tr key={element.id}>
            <th scope="row" onClick={onClickRow(element.id)}>{index+1}</th>
            <td onClick={onClickRow(element.id)}>{element.name}</td>
            <td onClick={onClickRow(element.id)}>{element.description}</td>   
            <td>
                {userData.authRole === userRole.admin&&
                <>
                    <A className='btn btn-primary' href={`/category/${element.id}`}>Edit</A>
                    <div className='btn btn-primary mx-3' onClick={removeItem(element.id)}>remove</div>
                </>}
            </td> 
            </tr>
            )}
        </tbody>
        </table>
        <Paginator countElements={count} currentPage={Number(router.query.id)} elementsOnThePage={10} baseLinkAdress='/categories' />
        </div>
    )
}

interface iExtendNextContext extends NextPageContext{
    query:{
        id: string,
        
    }
}

export async function getServerSideProps({req, res, query}: iExtendNextContext) {
    const token = getCookie('token', { req, res});
    if(!token){
        return{
            redirect: {
                destination: '/auth',
                permanent: false,
            }
        }
    }
    const result = await axios.get(`${BACKEND_URL}/category?page=${query.id}&limit=${10}`, getRequestHeader(String(token), false))
    if(result.status===200){
        return {
            props: {
                count: result.data.count,
                rows: result.data.rows
            }
          } 
    }

    return{
        redirect: {
            destination: '/auth',
            permanent: false,
        }
    }
}
export default ListOfCategories