import React,{useState} from 'react'
import "./login.css"
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword ,signInWithEmailAndPassword} from 'firebase/auth';
import { auth, db } from '../../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import upload from '../../../lib/uploadfile';

function Login() {
    const [avatar, setavatar] = useState({
        file:null,
        url:""
    })
    const filehandle=(e)=>{
        if(e.target.files[0]){
            setavatar({
                file:e.target.files[0],
                url:URL.createObjectURL(e.target.files[0])
            })
        }
    }
    const loginhandle=async(e)=>{
        e.preventDefault()
        setloading(true)
        const formdata=new FormData(e.target);
        const {email,password}=Object.fromEntries(formdata)
        try{
            await signInWithEmailAndPassword(auth,email,password);
        }
        catch(err){
            console.log(err)
            toast.error("Invalid User "+err.message)
        }
        finally{
            setloading(false)
        }
    }
    const [loading, setloading] = useState(false)

    const handleregister=async (e)=>{
        e.preventDefault()
        setloading(true)
        const formdata=new FormData(e.target);
        const {username,email,password}=Object.fromEntries(formdata)
        
        try{
            const res=await createUserWithEmailAndPassword(auth,email,password)
            const imgurl=await upload(avatar.file);
    
            await setDoc(doc(db,'users',res.user.uid), {
                username,
                email,
                avatar:imgurl,
                id:res.user.uid,
                blocked:[]
            });
            await setDoc(doc(db,'userchats',res.user.uid), {
                chats:[]
            });
            toast.success("Your are Registered")
        }
        catch(err){
            console.log(err);
            toast.error(err.message)
        }
        finally{
            setloading(false)
        }
    }

  return (
    <>
    <div className="title">
        <div className="heading">iCHAT
            <div className="liner">-"Where every message echoes."</div>
        </div>
    </div>
    <div className="panel">
        <div className="leftpanel">
            <h1>Welcome Back</h1>
            <form onSubmit={(e)=>{loginhandle(e)}}>
                <input placeholder='Email' name='email' type="text" />
                <input placeholder='Password' name='password' type="password" />
                <button disabled={loading}>Login</button>
            </form>
        </div>
        <div className="separator"></div>
        <div className="rightpanel">
            <h1>Register to Start</h1>
            <form onSubmit={handleregister}>
                <label htmlFor="uploadfile">
                    <img src={avatar.url || "../src/assets/svgs/avatar.svg"} alt="" />
                    Upload File
                </label>
                <input onChange={(e)=>{filehandle(e)}} type="file" name="uploadfile" id="uploadfile" style={{display:"none"}} />
                <input placeholder='Username' name='username' type="text" />
                <input placeholder='Email' name='email' type="text" />
                <input placeholder='Password' name='password' type="password" />
                <button disabled={loading}>Sign Up</button>
            </form>
        </div>
    </div>
    </>
  )
}

export default Login