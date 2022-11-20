import { ChangeEventHandler, FormEventHandler, useEffect, useState } from "react"
import axios from 'axios'
import { BACKEND_URL } from "../../constant"
import { useRouter } from "next/router"
import { useSelector } from "react-redux"
import { selectAuthData } from "../../store/authSlice"
import { userRole } from "../../interfaces"
import { getRequestHeader } from "../../common"

const Category=()=>{
    const router = useRouter()
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const userData = useSelector(selectAuthData)

    useEffect(()=>{
        if(userData.authRole!==userRole.admin){
            router.back()
        }
    },[userData.authRole])

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
        axios.post(`${BACKEND_URL}/category`, {name, description}, getRequestHeader(String(userData.authToken), false)).then(result=>{
            if(result.status === 200){
                router.push('/categories/1')
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

        <button type="submit" className={name?"btn btn-primary mt-3":"btn btn-primary mt-3 disabled"}>Create</button>
    </form>
    )
}

export default Category