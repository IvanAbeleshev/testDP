import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { MouseEventHandler } from 'react'
import { useSelector } from 'react-redux'
import { getRequestHeader } from '../common'
import { BACKEND_URL } from '../constant'
import { iBlog, userRole } from '../interfaces'
import { selectAuthData } from '../store/authSlice'
import A from './A'

interface iPropsCard{
  dataCards: iBlog
}

const Card=({dataCards}: iPropsCard)=>{
  const currentUserData = useSelector(selectAuthData)
  const router = useRouter()

  const removeItem:MouseEventHandler=()=>{
    axios.delete(`${BACKEND_URL}/blogs/${dataCards.id}`, getRequestHeader(currentUserData.authToken, false)).then(result=>{
      if(result.status === 200){
          router.reload()
      }
    })
  }

  return(
    <div className='card enabled'>

      <div className='card-img-top' style={{width: '100%', height: '150px', position: 'relative' }}>
        {dataCards?.cover?<Image src={`${BACKEND_URL}/${dataCards.cover}`} loading='lazy' objectFit='contain' alt='cover' layout='fill' />:<></>}
      </div>
      <div className='card-body'>
        <h5 className='card-title'>{dataCards.title}</h5>
        <p className='card-text'>{dataCards.text.slice(0, 250)+'...'}</p>
        <A href={`/blog/${dataCards.id}`} className='btn btn-primary'>Read now</A>

        {currentUserData.authRole === userRole.admin||currentUserData.authRole === userRole.user? 
        <div className='commandPanel'>
          {currentUserData.authRole === userRole.admin &&<>
          <A className='itemsCommandPanel btn btn-primary' href={`/blog/edit/${dataCards.id}`}>edit</A>
          <div className='itemsCommandPanel btn btn-primary' onClick={removeItem}>remove</div></>}
          {currentUserData.authRole === userRole.user && currentUserData.login===dataCards.user.login? 
          <>
            <A className='itemsCommandPanel btn btn-primary' href={`/blog/edit/${dataCards.id}`}>edit</A>
            <div className='itemsCommandPanel btn btn-primary' onClick={removeItem}>remove</div>
          </>:<></>}
        </div>:<></>}
      </div>
    </div>
    )
}

export default Card