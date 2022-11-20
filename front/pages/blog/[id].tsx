import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { BACKEND_URL } from '../../constant'
import {getCookie} from 'cookies-next'
import { NextPageContext } from 'next'
import { iBlog } from '../../interfaces'
import { getRequestHeader } from '../../common'

interface iPropsBlogItem{
    dataItem?: iBlog     
}

const BlogItem=({dataItem}:iPropsBlogItem)=>{
    const [loading, setLoading] = useState(true)
    
    useEffect(()=>{
        setLoading(false)
    },[dataItem])

    const router = useRouter()
    
    return(
        <>
        {loading?
        <div className="position-absolute top-50 start-50">
            <div className="spinner-border" role="status">
            </div>
        </div>:
        <div className='container'>
            <div className="img-fluid" style={{width: '100vw', height: '400px', position: 'relative' }}>
            {dataItem?.cover?<Image src={`${BACKEND_URL}/${dataItem.cover}`} loading='lazy' objectFit='contain' alt='cover' layout='fill' />:<></>}
            </div>
            
            <h1 className='text-center'>{dataItem?.title}</h1>

            <span>{dataItem?.text}</span>

            <div className='d-flex justify-content-between mt-4'>
                <span className='font-weight-bold'>author: {dataItem?.user.login}</span>
                <span className='font-weight-bold'>Date: {String(dataItem?.updatedAt)}</span>
            </div>
        </div>
      }
        </>
        
        
    )
}

interface iExtendedNextPageContext extends NextPageContext{
    query:{
        id:string
    }
}

export const getServerSideProps=async({req, res, query}:iExtendedNextPageContext)=>{
    const token = getCookie('token', { req, res});
    if(!token){
        return{
            redirect: {
                destination: '/auth',
                permanent: false,
              }
        }
    }

    const result = await axios.get(`${BACKEND_URL}/blogs/${query.id}`, getRequestHeader(String(token), false))
    
    if (result.status === 200){
        return{
            props:{
                dataItem: result.data
            }
        }
    }

    return{
        redirect: {
            destination: '/',
            permanent: false,
          }
    }
}

export default BlogItem