import React ,{useState,useRef,useEffect}from 'react'
import EmojiPicker from 'emoji-picker-react';
import "./chat.css"
import { db } from '../../../lib/firebase';
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import usechatStore from '../../../lib/chatStore';
import useUserStore from '../../../lib/userStore';
import upload from '../../../lib/uploadfile';

function Chat() {
  const [chat, setchat] = useState()
  const [openemoji, setopenemoji] = useState(false)
  const [text, settext] = useState("")
  const endRef = useRef(null)
  const [imgfile, setimgfile] = useState({
    file:null,
    url:""
  })
  const filehandle=(e)=>{
    if(e.target.files[0]){
        setimgfile({
            file:e.target.files[0],
            url:URL.createObjectURL(e.target.files[0])
        })
    }
  }
  useEffect(() => {
    endRef.current?.scrollIntoView({behaviour:"smooth"})
  }, [])
  
  const {chatId,user,isblockedcurrentuser,isblockedreceiveruser,changechat,changeblocked}=usechatStore()
  useEffect(()=>{
    const unSub=onSnapshot(doc(db, "chats",chatId),(res)=>{
        setchat(res.data())
    })
    return ()=>{
      unSub()
    }
  
  },[chatId])
  
  const emojihandle=(e)=>{
    settext(prev=>
      prev+e.emoji
    )
  }
  const {currentuser}=useUserStore()
  const handlesend=async()=>{
    if(text==="") return

    let imgUrl=null;

    try{
      
      if(imgfile.file){
        imgUrl=await upload(imgfile.file)
      }

      await updateDoc(doc(db,"chats",chatId),{
        messages:arrayUnion({
          senderId:currentuser.id,
          text,
          createdAt:new Date(),
          ...(imgUrl && {img:imgUrl})
        })
      })

      const UserIds=[currentuser.id,user.id]

      UserIds.forEach(async (id)=>{

          const userChatsRef=doc(db,"userchats",id)
          const userChatSnapshot=await getDoc(userChatsRef)
        
          if(userChatSnapshot.exists()){
          const userchatdata=userChatSnapshot.data()
          const chatIndex=userchatdata.chats.findIndex(
            (c)=>c.chatId===chatId
          )
          
          userchatdata.chats[chatIndex].lastMessage=text;
          userchatdata.chats[chatIndex].isSeen=id===currentuser.id?true:false;
          userchatdata.chats[chatIndex].updatedAt=Date.now();
          console.log(userchatdata.chats)
          console.log(userchatdata.chats[chatIndex])

          await updateDoc(userChatsRef,{
            chats:userchatdata.chats,
          })
        }
      })
      setimgfile({
        file:null,
        url:""
      })
      settext("")
    }
    catch(err){
      console.log(err)
    }
  }
  const time=(seconds)=>{
   
      if (seconds < 60) {
          return "just now";
      }
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
  
      if (days > 0) {
          return `${days} day${days > 1 ? 's' : ''} ago`;
      }
      if (hours > 0) {
          return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      }
      if (minutes > 0) {
          return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      }
      return "just now";
  }


  return (
    <div className='chat'>
      <div className="top">
        <div className="user">
          <img className="propic" src={user.avatar || "../src/assets/svgs/avatar.svg"} alt="" />
          <div className="userchat">
            <span>{user.username}</span>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit</p>
          </div>
        </div>
        <div className="icon">
          <img src="../src/assets/svgs/call.svg" alt="" />
          <img src="../src/assets/svgs/video.svg" alt="" />
          <img src="../src/assets/svgs/info.svg" alt="" />
        </div>
      </div>

      <div className="middle">
      {isblockedreceiveruser?<div className='msgyoublock'>*You blocked the User</div>:""}
      {isblockedcurrentuser?<div className='msgyoublock'>*You are blocked by User</div>:""}
      {!(isblockedreceiveruser || isblockedcurrentuser) && chat?.messages?.map((message)=>{
        return <div className={currentuser.id===message.senderId?"message own":"message"}>
          {message.img && <img className='imagedata' src={message.img} alt="" />}
          <div className="msginfo">
            <p>{message.text}</p>
            <div>{time((new Date().getTime()/1000)-message.createdAt.seconds)}</div>
          </div>
        </div>
        })
      }
      {imgfile.url &&
        <div className={currentuser.id===message.senderId?"message own":"message"}>
          <img className='receivedimg' src={imgfile.url} alt="" />
        </div>
      }
      <div ref={endRef}></div>
      </div>

      <div className="bottom">
        <div className="icons">
          <img src="../src/assets/svgs/camera.svg" alt="" />
          <img src="../src/assets/svgs/microphone.svg" alt="" />
          <label htmlFor="uploadfile">
            <img src="../src/assets/svgs/image.svg" alt="img" />
          </label>
          <input onChange={(e)=>{filehandle(e)}} id="uploadfile" name="uploadfile" type="file" style={{display:"none"}}/>
        </div>
        <input disabled={(isblockedreceiveruser || isblockedcurrentuser)?true:false} value={text} onChange={(e)=>{settext(e.target.value)}} placeholder='Type your msg...' type="text" />
        <div className="emoji">
          <div className="picker">
            {openemoji && <EmojiPicker onEmojiClick={(e)=>emojihandle(e)}/>}
          </div>
          <img src="../src/assets/svgs/emoji.svg" onClick={()=>{setopenemoji(prev=>!prev)}} alt="" />
        </div>
        <button className="send" onClick={()=>{handlesend()}} disabled={(isblockedreceiveruser || isblockedcurrentuser)?true:false}>Send</button>
      </div>
    </div>
  )
}

export default Chat