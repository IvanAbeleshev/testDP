import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css' // Import bootstrap CSS
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import NavBar from '../components/NavBar'
import { store, wrapper } from '../store/store'
import LayoutAuth from '../components/LayoutAuth'
import { Provider } from 'react-redux'

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js'!)
  }, [])

  return ( 
    <Provider store={store}>
    <main className='d-flex flex-column min-vh-100'>
      <NavBar />
      <LayoutAuth><Component {...pageProps} /></LayoutAuth>
    </main>
    </Provider>
  )
}

export default App