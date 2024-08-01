import { doc, getDoc } from 'firebase/firestore'
import { create } from 'zustand'
import { db } from './firebase'
import useUserStore from './userStore'

const usechatStore = create((set) => ({
  chatId:null,
  user:null,
  isblockedcurrentuser:false,
  isblockedreceiveruser:false,

    changechat:(chatId,user)=>{
        const currentuser=useUserStore.getState().currentuser
        if(user.blocked.includes(currentuser.id)){
            return set({
                chatId,
                user:null,
                isblockedcurrentuser:true,
                isblockedreceiveruser:false,
            })
        }
        else if(currentuser.blocked.includes(user.id)){
            return set({
                chatId,
                user:null,
                isblockedcurrentuser:false,
                isblockedreceiveruser:true,
            })
        }
        else{
            return set({
                chatId:chatId,
                user:user,
                isblockedcurrentuser:false,
                isblockedreceiveruser:false,
            })
        }
    },
    changeblocked:()=>{
        set((state)=>({
            ...state,
            isblockedreceiveruser:!state.isblockedreceiveruser,
        }))
    },
    resetchat:()=>{
        set({
            chatId:null,
            user:null,
            isblockedcurrentuser:false,
            isblockedreceiveruser:false,
        })
    }

}))
export default usechatStore