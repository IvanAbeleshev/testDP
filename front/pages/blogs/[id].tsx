import axios from 'axios'
import { NextPageContext } from 'next'
import { getRequestHeader } from '../../common'
import { BACKEND_URL } from '../../constant'
import {getCookie} from 'cookies-next'
import { iBlog, iCategory, iUser, userRole } from '../../interfaces'
import { useRouter } from 'next/router'
import Card from '../../components/Card'
import Paginator from '../../components/Paginator'
import A from '../../components/A'
import { ChangeEventHandler, FormEventHandler, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectAuthData } from '../../store/authSlice'

interface iPropsBlogsList{
  dataList: iBlog[],
  count: number,
  dataCategories: iCategory[],
  dataUsers: iUser[]
}

interface iDataInputs{
  categoryId: number,
  userId: number,  
}

const BlogsList=({dataList, count, dataCategories, dataUsers}:iPropsBlogsList)=>{
  const [dataInputs, setDataInputs] = useState({categoryId:0, userId:0} as iDataInputs)
  const router = useRouter()
  const userData = useSelector(selectAuthData)

  useEffect(()=>{
    if(router.query.categoryId){
      setDataInputs({...dataInputs, categoryId: Number(router.query.categoryId)})
    }
    if(router.query.userId){
      setDataInputs({...dataInputs, userId: Number(router.query.userId)})
    }
  },[router.query.userId, router.query.categoryId])



  //---------------events---------------
  const changeEventHandler:ChangeEventHandler=(event)=>{
    const target = event.target as HTMLInputElement

    const copyObject = {...dataInputs, [target.name]: target.value}
    //setDataInputs({...dataInputs, [target.name]: target.value})

    let additionalParams = ''
    type Activity = typeof copyObject
    
    for(let i in copyObject){  
      if(!copyObject[i as keyof Activity] || copyObject[i as keyof Activity] === null || copyObject[i as keyof Activity]==0){
          continue
      }
      if(additionalParams.length>0){
        additionalParams += '&' 
      }
      additionalParams += `${i}=${copyObject[i as keyof Activity]}`
    }

    if(additionalParams.length>0){
      additionalParams = '?'+additionalParams

    }

    setDataInputs(copyObject)
    router.push(`/blogs/1${additionalParams}`)
  }

  const submitForm: FormEventHandler=(event)=>{
    event.preventDefault()
  }
  //------------------------------------

  return(
    <>
    <form className="container d-flex" onSubmit={submitForm}>
      <div className='form-group'>
        <label htmlFor='category'>Category</label>
        <select name='categoryId' className='form-select' id='category' aria-label='Default select example' value={dataInputs.categoryId} onChange={changeEventHandler}>
            <option value={0} selected>Choose category</option>
            {dataCategories.map(element=><option key={element.id} value={element.id}>{element.name}</option>)}
        </select>
      </div>  

      <div className='form-group px-3'>
        <label htmlFor='user'>User</label>
        <select name='userId' className='form-select' id='user' aria-label='Default select example' value={dataInputs.userId} onChange={changeEventHandler}>
          <option value={0} selected>Choose user</option>
          {dataUsers.map(element=><option key={element.id} value={element.id}>{element.login}</option>)}
        </select>
      </div> 
    </form>

    <div className='container d-flex justify-content-between pb-2 pt-2'>
      {(userData.authRole===userRole.admin||userData.authRole===userRole.user)&&<A className='btn btn-primary' href='/create/blog'>add new blog</A>}
    </div>

    {count===0?
    <div className="container col-xs-1 center-block">While we haven`t blogs. Please add new</div>:
    <div className="container">
      {dataList.map(element=>
          <div className="row pt-3" key={element.id}>
            <div className="col-sm">
              <Card dataCards={element}/>
            </div>
          </div>
            )}
      <Paginator countElements={count} currentPage={Number(router.query.id)} elementsOnThePage={10} baseLinkAdress='/blogs' />
    </div>
    }
    </>
  )

}

export default BlogsList

interface iExtendedNextPageContext extends NextPageContext{
  query:{
    id: string,
    categoryId?: string,
    userId?: string 
  }
}

export async function getServerSideProps({req, res, query}: iExtendedNextPageContext) {
  
  const token = getCookie('token', { req, res});
  if(!token){
    return{
      redirect: {
          destination: '/auth',
          permanent: false,
        }
    }
  }

  let additinalQueryText =''
  if(query.categoryId){
      additinalQueryText += `&categoryId=${query.categoryId}`
  }
  if(query.userId){
      additinalQueryText += `&userId=${query.userId}`
  }

  const headers = getRequestHeader(String(token), false)
  const result = await axios.get(`${BACKEND_URL}/blogs?page=${query.id}&limit=10${additinalQueryText}`, headers)
  const resultCategories = await axios.get(`${BACKEND_URL}/category/getAll`, headers)
  const resultUsers = await axios.get(`${BACKEND_URL}/users/getAll`, headers)
  
  if (result.status === 200 && resultCategories.status === 200 && resultUsers.status === 200){
    return{
      props:{
        dataList: result.data.rows,
        count: result.data.count,
        dataCategories: resultCategories.data,
        dataUsers: resultUsers.data
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