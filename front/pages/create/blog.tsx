import { ChangeEventHandler, FormEventHandler, MutableRefObject, useEffect, useRef, useState } from 'react'
import { iCategory, userRole } from '../../interfaces'
import axios, { AxiosResponse } from 'axios'
import { BACKEND_URL } from '../../constant'
import { useSelector } from 'react-redux'
import { selectAuthData } from '../../store/authSlice'
import { useRouter } from 'next/router'
import { getRequestHeader } from '../../common'

interface iInputsData{
    title: string,
    categoryId: number,
    text: string
}
const Blog=()=>{
    const [dataCategories, setDataCategories]:[iCategory[], Function] = useState([])
    const [dataInputs, setDataInputs] = useState({} as iInputsData)

    const inputElement = useRef() as MutableRefObject<HTMLInputElement>
    const router = useRouter()

    const currentUserData = useSelector(selectAuthData)
    useEffect(()=>{
        if(currentUserData.authRole===userRole.guest){
            router.back()
        }
    },[currentUserData.authRole])

    useEffect(()=>{
        //maybe need this part of code transfer to server side props!?!
        axios.get(`${BACKEND_URL}/category/getAll`, getRequestHeader(String(currentUserData.authToken), false)).then(result=>{
            if(result.status === 200){
                setDataCategories(result.data)
            }
        })
    },[])

    const changeEventHandler:ChangeEventHandler=(event)=>{
        const target = event.target as HTMLInputElement
        
        setDataInputs({...dataInputs, [target.name]: target.value})
    }

    const submitFormEvent:FormEventHandler=(event)=>{
        event.preventDefault()
        const callbackFulfill =(result:AxiosResponse)=>{
            if(result.status === 200){
                router.back()
            }
        }

        axios.post(`${BACKEND_URL}/blogs`, getFormData(),getRequestHeader(currentUserData.authToken, true) ).then(result=>{
            if(result.status === 200){
            router.back()
            }
        })
    }

    const getFormData=():FormData=>{
        const formData = new FormData()
        if(inputElement.current.files && inputElement.current.files.length>0){
            formData.append('img', inputElement.current.files[0])
        }
        type Activity = typeof dataInputs

        for(let i in dataInputs){
            
            if(!dataInputs[i as keyof Activity] || dataInputs[i as keyof Activity] === null ){
                continue
            }
            formData.append(i, String(dataInputs[i as keyof Activity]))
        }
    
        return formData
    }

    return (
        <form className='container' onSubmit={submitFormEvent}>
        <div className='form-group'>
            <label htmlFor='nameBlog'>Title</label>
            <input name='title' type='text' className='form-control' id='nameBlog' aria-describedby='nameHelp' placeholder='Enter name blog' value={dataInputs.title} onChange={changeEventHandler} />
        </div>
        <div className='form-group'>
            <label htmlFor='category'>Category</label>
            <select name='categoryId' className='form-select' id='category' aria-label='Default select example' value={dataInputs.categoryId} onChange={changeEventHandler}>
                <option selected>Choose category</option>
                {dataCategories.map(element=><option key={element.id} value={element.id}>{element.name}</option>)}
            </select>
        </div>
        <div className='mb-3'>
            <label htmlFor='formFile'>Coverage</label>
            <input className='form-control' type='file' id='formFile' ref={inputElement}/>
        </div>
        <div className='form-group'>
            <label htmlFor='textBlog'>Text</label>
            <textarea name='text' className='form-control' id='textBlog' rows={8} value={dataInputs.text} onChange={changeEventHandler}/>
        </div>
        
        <button type='submit' className={'btn btn-primary mt-3'}>Create</button>
    </form>
    )
}

export default Blog