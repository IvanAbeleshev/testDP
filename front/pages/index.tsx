import axios from 'axios'
import A from '../components/A'
import Card from '../components/Card'
import { BACKEND_URL } from '../constant'
import {getCookie} from 'cookies-next'
import { NextPageContext } from 'next'
import { getRequestHeader } from '../common'
import { iBlog, userRole } from '../interfaces'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectAuthData } from '../store/authSlice'


interface iPropsHomePage{
  dataList: iBlog[],
  count: number
}

export default function Home({dataList, count}:iPropsHomePage) {
  const [currentData, setCurrentData]:[iBlog[], Function] = useState(dataList)
  const [currentPage, setCurrentPage] = useState(1)

  const usedData = useSelector(selectAuthData)
  const getNewItems=()=>{
    axios.get(`${BACKEND_URL}/blogs?page=${currentPage+1}&limit=10`, getRequestHeader(String(usedData.authToken), false)).then(result=>{
      if(result.status === 200){
        setCurrentData([...currentData, ...result.data.rows])
        setCurrentPage(currentPage+1)
      }
    })
  }

  const refreshFunction=()=>{}

  return (
    <>
    <div className='container d-flex justify-content-between pb-2 pt-2'>
      <div className='mr-3'> 
        {(usedData.authRole===userRole.admin || usedData.authRole===userRole.user)&&<A className='btn btn-primary' href='/create/blog'>add new blog</A>}
      </div>
      <div className='mr-3'>
      {usedData.authRole===userRole.admin&&<A className='btn btn-primary' href='/create/category'>add new category</A>}
        
      </div>
    </div>

    <div className="container">
    <InfiniteScroll
        dataLength={currentData.length} //This is important field to render the next data
        next={getNewItems}
        hasMore={currentData.length<count}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        // below props only if you need pull down functionality
        refreshFunction={refreshFunction}
        pullDownToRefresh
        pullDownToRefreshThreshold={50}
        pullDownToRefreshContent={
          <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
        }
        releaseToRefreshContent={
          <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
        }
      >
        {currentData.map(element=>
          <div className="row pt-3" key={element.id}>
            <div className="col-sm">
              <Card dataCards={element}/>
            </div>
          </div>
            )}
      </InfiniteScroll>
      {}
    </div>
    </>
  )
}

export async function getServerSideProps({req, res}: NextPageContext) {
  const token = getCookie('token', { req, res});
  if(!token){
    return{
        redirect: {
            destination: '/auth',
            permanent: false,
          }
    }
  }

  const result = await axios.get(`${BACKEND_URL}/blogs?page=1&limit=10`, getRequestHeader(String(token), false))
  
  if (result.status === 200){
    return{
        props:{
          dataList: result.data.rows,
          count: result.data.count
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