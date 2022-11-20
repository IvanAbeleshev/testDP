import A from "./A"
import { useSelector, useDispatch } from 'react-redux'
import { selectAuthData, setInitialState } from "../store/authSlice"
import { MouseEventHandler } from "react"
import {removeCookies} from 'cookies-next'
import { useRouter } from "next/router"
import Image from "next/image"

const NavBar=()=>{
    const router = useRouter()
    const currentUserData = useSelector(selectAuthData)
    const dispatch = useDispatch()

    const logOutClick:MouseEventHandler=()=>{
        removeCookies('token')
        dispatch(setInitialState())
        router.push('/auth')
    }

    return (
        <div className='d-flex justify-content-between pt-2 pl-2 pr-2'>
            <ul className="nav ">
                    <li className="nav-item">
                        <A className="nav-link" href="/"><Image src='/favicon-32x32.png' alt='logo' width={32} height={32} /></A>
                    </li>
                    <li className="nav-item">
                        <A className="nav-link" href="/categories/1">Categories</A>
                    </li>
                    <li className="nav-item">
                        <A className="nav-link" href="/blogs/1">Blogs</A>
                    </li>
            </ul>
        {currentUserData.authState?
            <div className='d-flex'>
                <span>{currentUserData.login}</span>
                <div className='btn btn-primary mx-3' onClick={logOutClick}>Log out</div>
            </div>:
            <A className='btn btn-primary' href='/auth'>Sign in</A>
        }

        </div>

  )
}

export default NavBar