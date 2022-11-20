import { ChangeEventHandler, FormEventHandler, useState } from 'react'
import axios from 'axios'
import { BACKEND_URL } from '../constant'
import { useDispatch } from 'react-redux'
import { setAuthState } from '../store/authSlice'
import A from '../components/A'
import { useRouter } from 'next/router'

interface dataAuth{
    login: string,
    password: string,
    rememberMe: boolean
}
const Auth=()=>{
    const router = useRouter()
    const [data, setData] = useState({} as dataAuth)

    const dispatch = useDispatch()

    const changeValueInput:ChangeEventHandler=(event)=>{
        const target = event.target as HTMLInputElement
        if(target.name === 'rememberMe'){
            setData({...data, [target.name]: target.checked})
        }else{
            setData({...data, [target.name]: target.value})
        }
    }

    const submitHandler:FormEventHandler=(event)=>{
        event.preventDefault()
        const {login, password} = data
        axios.post(`${BACKEND_URL}/users/`, {login, password}).then(result=>{
            if(result.status === 200){
                if(data.rememberMe){
                    window.localStorage.setItem('token', result.data.token)
                }
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
        <div className='form-group form-check'>
            <input name='rememberMe' type='checkbox' className='form-check-input' id='check' checked={data.rememberMe} onChange={changeValueInput} />
            <label className='form-check-label' htmlFor='check'>Check me out</label>
        </div>
        <div className='d-flex justify-content-between'>
            <button type='submit' className={`btn btn-primary ${!data.login || !data.password?'disabled':''}`}>Submit</button>
            <A className='btn btn-info' href='/registration'>Registrate now</A>
        </div>

        
        </form>
    )
}

export default Auth