import { useRouter } from 'next/router'
import { FC, ReactNode, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectAuthState, setAuthState } from '../store/authSlice'
import axios from 'axios'
import { BACKEND_URL } from '../constant'
import {getCookie} from 'cookies-next'

interface iPropsLayoutAurh{
    children: ReactNode
}
enum enabledPathes{
    authPage ='/auth',
    registrationPage ='/registration'
}

const LayoutAuth=({children}:iPropsLayoutAurh)=>{
    const router = useRouter()
    const currentStateAuth = useSelector(selectAuthState)
    const dispatch = useDispatch()

    const pushToAuthPage=()=>{
        if(!currentStateAuth){
            if(!(router.pathname in enabledPathes)){
                router.push(enabledPathes.authPage)
            }
        }
    }

    useEffect(()=>{
        if(!currentStateAuth){
            const token = getCookie('token')
            if(token){
                axios.post(`${BACKEND_URL}/users/checkUser`, {token}).then(result=>{
                    if(result.status === 200){
                        dispatch(setAuthState({authState: true, authRole: result.data.role, authToken: result.data.token, login: result.data.login}))   
                    }else{
                        pushToAuthPage()
                    }
                }).catch(error=>{
                    pushToAuthPage()
                })
            }
        }
    },[currentStateAuth, router.pathname])

    return(<>{children}</>)
}

export default LayoutAuth