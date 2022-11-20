import { NextPageContext } from 'next'
import { useRouter } from 'next/router'
import axios from 'axios'
import { BACKEND_URL } from '../../constant'
import { iCategory } from '../../interfaces'
import {getCookie} from 'cookies-next'
import { ChangeEventHandler, FormEventHandler, useEffect, useState } from 'react'
import { getRequestHeader } from '../../common'

interface iPropsCategory{
    dataCategory: iCategory
}

const Category=({dataCategory}:iPropsCategory)=>{
    const router = useRouter()
    const [name, setName] = useState(dataCategory.name)
    const [description, setDescription] = useState(dataCategory.description)
    
    useEffect(()=>{
        setName(dataCategory.name)
        setDescription(dataCategory.description)
    },[dataCategory])
    const changeName:ChangeEventHandler=(event)=>{
        const {value} = event.target as HTMLInputElement
        setName(value)
    }

    const changeDescription:ChangeEventHandler=(event)=>{
        const {value} = event.target as HTMLInputElement
        setDescription(value)
    }

    const onSubmitEvent:FormEventHandler=(event)=>{
        event.preventDefault()
        axios.post(`${BACKEND_URL}/category/${dataCategory.id}`, {name, description}).then(result=>{
            if(result.status === 200){
                router.back()
            }
        })
    }
    return(
    <form className="container" onSubmit={onSubmitEvent}>
        <div className="form-group">
            <label htmlFor="nameCategory">Name</label>
            <input type="text" className="form-control" id="nameCategory" aria-describedby="nameHelp" placeholder="Enter name category" value={name} onChange={changeName} />
        </div>

        <div className="form-group">
            <label htmlFor="descriptionCategory">Description</label>
            <input type="text" className="form-control" id="descriptionCategory" aria-describedby="descriptionHelp" placeholder="Enter description category" value={description} onChange={changeDescription} />
        </div>

        <button type="submit" className={name?"btn btn-primary mt-3":"btn btn-primary mt-3 disabled"}>Save changes</button>
    </form>
    )
}

interface iExtendedNextPageContext extends NextPageContext{
    query:{
        id: string
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

    const result = await axios.get(`${BACKEND_URL}/category/${query.id}`, getRequestHeader(String(token), false))
    if(result.status===200){
      const dataCategory:iCategory = result.data
      return {
        props:{
            dataCategory
        }
      }
    }
    
    return{
        redirect: {
            destination: '/',
            permanent: false,
          }
    }
    

  return {
    props: {}
  }
}
export default Category