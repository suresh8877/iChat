import React, { useState } from 'react'
import "./adduser.css"
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from '../../../lib/firebase';
import useUserStore from '../../../lib/userStore'

function Adduser() {
  const [username, setusername] = useState("")
  const [user, setuser] = useState(null)
  
  const {currentuser}=useUserStore();
  
  const searchuser=async ()=>{
    try{
      const userRef = collection(db, "users");
      const q=query(userRef,where("username","==",username))
      const snapShot=await getDocs(q)
      setuser(snapShot.docs[0].data())

    }catch(err){
      setuser(null)
      console.log(err)
    }
  }

  const handleadd=async()=>{
    try{
      const chatsRef=collection(db,"chats")
      const userchatsRef=collection(db,"userchats")

      const newChatRef=doc(chatsRef)
      await setDoc(newChatRef,{
        updatedAt:serverTimestamp(),
        messages:[]
      })
      await updateDoc(doc(userchatsRef,user.id),{
        chats:arrayUnion({
          chatId:newChatRef.id,
          lastMessage:"",
          receiverId:currentuser.id,
          updatedAt:Date.now()
        })
      })
      await updateDoc(doc(userchatsRef,currentuser.id),{
        chats:arrayUnion({
          chatId:newChatRef.id,
          lastMessage:"",
          receiverId:user.id,
          updatedAt:Date.now()
        })
      })

    }
    catch(err){
      console.log(err);
    }
  }
  
  return (
    <>
      <div className="add">
        <div className="searchuser">
          <img  src="../src/assets/svgs/search.svg" alt="" />
          <input onChange={(e)=>{setusername(e.target.value)}} placeholder='Search' type="text" />
          <button onClick={searchuser}>Search</button>
        </div>
        {user &&
          <div className="searchresult">
            <div className="useritem">
              <img src={user.avatar || "../src/assets/svgs/avatar.svg"} alt="" />
              <span>{user.username}</span>
              <button onClick={handleadd}>Add User</button>
            </div>
          </div>
        }
      </div>
    </>
  )
}

export default Adduser