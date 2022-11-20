import { ChangeEventHandler, FormEventHandler, useState } from 'react'
import axios from 'axios'
import { BACKEND_URL } from '../constant'
import { useDispatch } from 'react-redux'
import { setAuthState } from '../store/authSlice'
import A from '../components/A'
import { userRole } from '../interfaces'
import { useRouter } from 'next/router'

interface dataAuth{
    login: string,
    password: string,
    role: userRole
}
const Registration=()=>{
    const router = useRouter()
    const [data, setData] = useState({} as dataAuth)

    const dispatch = useDispatch()

    const changeValueInput:ChangeEventHandler=(event)=>{
        const target = event.target as HTMLInputElement
        
        setData({...data, [target.name]: target.value})
    }

    const submitHandler:FormEventHandler=(event)=>{
        event.preventDefault()
        axios.post(`${BACKEND_URL}/users/createUser`, data).then(result=>{
            if(result.status === 200){
                dispatch(setAuthState({authState: true, authRole: result.data.role, authToken: result.data.token, login: result.data.login}))
                router.push('/')
            }
        })
    }

    return(
        <form className='container' onSubmit={submitHandler}>
        <div className='form-group'>
            <label htmlFor='inputEmail'>Email address</label>
            <input name='login' type='email' className='form-control' id='inputEmail' aria-describedby='emailHelp' placeholder='Enter email' value={data.login} onChange={changeValueInput} />
            <small id='emailHelp' className='form-text text-muted'>We'll never share your email with anyone else.</small>
        </div>
        <div className='form-group'>
            <label htmlFor='inputPassword'>Password</label>
            <input name='password' type='password' className='form-control' id='inputPassword' placeholder='Password' value={data.password} onChange={changeValueInput} />
        </div>
        <div className='form-group'>
            <label htmlFor='selectorRole'>Select your role</label>

            <select className='custom-select form-control' id='selectorRole' name='role' value={data.role} onChange={changeValueInput}>
                <option value='' selected>Choose one</option>
                <option value={userRole.guest}>{userRole.guest}</option>
                <option value={userRole.user}>{userRole.user}</option>
            </select>
        </div>
        <button type='submit' className={`btn btn-primary mt-3 ${!data.login || !data.password || !data.role?'disabled':''}`}>Registration</button>
 
        </form>
    )
}

export default Registration