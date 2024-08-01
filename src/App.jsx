import { useEffect, useState } from 'react'
import './App.css'
import List from './assets/components/list/List'
import Chat from './assets/components/chat/Chat'
import Detail from './assets/components/detail/Detail'
import Login from './assets/components/login/Login'
import Notification from './assets/components/notification/Notification'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './lib/firebase'
import useUserStore from './lib/userStore'
import usechatStore from './lib/chatStore'

function App() {
  const {currentuser,loading,fetchinfo}=useUserStore()
  const{chatId}=usechatStore()

  useEffect(() => {
    const unSub=onAuthStateChanged(auth,(user)=>{
      fetchinfo(user?.uid)
    })
    return ()=>{
      unSub()
    }
  }, [fetchinfo])

  if(loading) return (<div className='loading'>
      loading
      <img src="../src/assets/svgs/loadingcircle.svg" alt="theseis" />
    </div>
  )

  return (
    <>
    <div className="container">
    {currentuser
    ?
      <>
      <List/>
      {chatId && <Chat/>}
      {chatId && <Detail/>}
      </>
    :<Login/>
    }
      </div>
      <Notification/>
    </>
  )
}

export default App
