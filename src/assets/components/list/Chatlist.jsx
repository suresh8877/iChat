import React,{useEffect, useState} from 'react'
import "./adduser.css"
import Adduser from './Adduser'
import useUserStore from '../../../lib/userStore'
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from '../../../lib/firebase';
import usechatStore from '../../../lib/chatStore';

function Chatlist() {
  const [addbutton, setaddbutton] = useState(false)
  const [chatdata, setchatdata] = useState([])
  const [filterchatdata, setfilterchatdata] = useState([])

  const {currentuser}=useUserStore()

  useEffect(() => {
    setfilterchatdata(chatdata)
  }, [chatdata])

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "userchats",currentuser.id), async (res) => {
          const items=res.data().chats

          const promises=items.map(async(item)=>{
          const userDocRef=doc(db,"users",item.receiverId)
          const userDOcSnap=await getDoc(userDocRef)
          
          const user=userDOcSnap.data()
          return{...item,user}
        })

        const chatData=await Promise.all(promises)
        setchatdata(chatData.sort((a,b)=>(b.updateAt-a.updateAt)))
      });
    return ()=>{
      unSub()
    }
  }, [currentuser.id])

  const {chatId,changechat}=usechatStore()
  
  const handleSelect=async(chat)=>{
      const userChats=chatdata.map((item)=>{
        const {user,...rest}=item;
        return rest
      })
      const chatIndex=userChats.findIndex(item=>item.chatId===chat.chatId)
      userChats[chatIndex].isSeen=true;

      const userchatRef=doc(db,"userchats",currentuser.id)

      try{
        await updateDoc(userchatRef,{
          chats:userChats,
        })
        changechat(chat.chatId,chat.user)
      }
      catch(err){
        console.log(err);
      }
  }
  const filterchats=(e)=>{
      if(e.target.value==""){
        setfilterchatdata(chatdata)
      }
      else{
        const data=chatdata.filter((item)=>{
          console.log(item,"jo")
          if(item.user.username===e.target.value){
            return item
          }
        })
        setfilterchatdata(data)
      }
  }
  return (
    <>
      <div className="chatlist">
        <div className="search">
          <div className="searchbar">
            <img src="../src/assets/svgs/search.svg" alt="" />
            <input onChange={(e)=>{filterchats(e)}} type="text" placeholder='Search' name="" id="" />
          </div>
          <img onClick={()=>{setaddbutton(!addbutton)}} src={addbutton?"../src/assets/svgs/minus.svg":"../src/assets/svgs/plus.svg"} alt="" />
        </div>
        <div className="list">
        {filterchatdata.map((chat)=>{
          console.log(chat)
            return <div style={{background:chat.isSeen?"transparent":"blue"}} key={chat.id} className="listitem" onClick={()=>handleSelect(chat)}>
                <img src={chat.user.avatar || "../src/assets/svgs/avatar.svg"} alt="" />
                <div className="listiteminfo">
                  <span>{chat.user.username}</span>
                  <p>{chat.lastMessage}</p>
                </div>
            </div>
        })}
        </div>
      </div>
      <div className="adduser">
        {addbutton && <Adduser/>}
      </div>
    </>
  )
}

export default Chatlist