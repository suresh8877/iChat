import React ,{useState}from 'react'
import "./detail.css"
import { auth, db } from '../../../lib/firebase'
import usechatStore from '../../../lib/chatStore'
import useUserStore from '../../../lib/userStore'
import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore'

function Detail() {

  const {chatId,user,isblockedcurrentuser,isblockedreceiveruser,changechat,changeblocked,resetchat}=usechatStore()
  const {currentuser}=useUserStore()

  
  const handleblock=async (isblockedreceiveruser,currentuser,chatId,user)=>{
    
      const docchatRef = doc(db, "userchats", currentuser.id);
      const docchatSnap = await getDoc(docchatRef);
      const index=docchatSnap.data().chats.findIndex(obj=>obj.chatId==chatId);
      const receverid=docchatSnap.data().chats[index].receiverId

      await updateDoc(doc(db,"users",currentuser.id),{
        blocked:isblockedreceiveruser?arrayRemove(receverid):arrayUnion(receverid)
      })
      changeblocked()
  }
    
  return (
    <div className='detail'>
      <div className="profiledetail">
        <div>
        <img src={user.avatar || "../src/assets/svgs/avatar.svg"} alt="" />
        <span>{user.username}</span>
        <p>Lorem ipsum dolor itatis labo</p>
        </div>
      </div>
      <div className="options">
        <div className="optionitem">
          <div className="itemtitle">
          <span>Chat Setting</span>
          <img src="../src/assets/svgs/up.svg" alt="" />
          </div>
        </div>
        <div className="optionitem">
          <div className="itemtitle">
          <span>Chat Setting</span>
          <img src="../src/assets/svgs/up.svg" alt="" />
          </div>

        </div>
        <div className="optionitem">
          <div className="itemtitle">
          <span>Privacy & help</span>
          <img src="../src/assets/svgs/up.svg" alt="" />
          </div>
        </div>
        <div className="optionitem">
          <div className="itemtitle">
            <span>Shared photos</span>
            <img src="../src/assets/svgs/down.svg" alt="" />
          </div>
          <div className="photos">
            <div className="photo">
              <img src="../src/assets/image/bgchat.png" alt="" />
              <span>photo_24454_72902.png</span>
              <img className="download" src="../src/assets/svgs/download.svg" alt="" />
            </div>
            <div className="photo">
              <img src="../src/assets/image/bgchat.png" alt="" />
              <span>photo_24454_72902.png</span>
              <img className="download" src="../src/assets/svgs/download.svg" alt="" />
            </div>
            <div className="photo">
              <img src="../src/assets/image/bgchat.png" alt="" />
              <span>photo_24454_72902.png</span>
              <img className="download" src="../src/assets/svgs/download.svg" alt="" />
            </div>
            <div className="photo">
              <img src="../src/assets/image/bgchat.png" alt="" />
              <span>photo_24454_72902.png</span>
              <img className="download" src="../src/assets/svgs/download.svg" alt="" />
            </div>
          </div>
        </div>
        <div className="optionitem">
          <div className="itemtitle">
            <span>Shared Files</span>
            <img src="../src/assets/svgs/up.svg" alt="" />
          </div>
        </div>
        <div className="block">
          <button disabled={isblockedcurrentuser} onClick={()=>{handleblock(isblockedreceiveruser,currentuser,chatId,user)}}>{isblockedreceiveruser?"UnBlock":isblockedcurrentuser?"Your Are Blocked":"Blocked"}</button>
        </div>
        <div className="logout">
          <button onClick={()=>auth.signOut()}>Log Out</button>
        </div>
      </div>
    </div>
  )
}

export default Detail