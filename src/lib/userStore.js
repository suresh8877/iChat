import { doc, getDoc } from 'firebase/firestore'
import { create } from 'zustand'
import { db } from './firebase'

const useUserStore = create((set) => ({
  currentuser:null,
  loading:true,
    fetchinfo:async (uid)=>{
        if(!uid) return set({currentuser:null,loading:false})

            try{
                const docRef=doc(db,"users",uid)
                const docSnap=await getDoc(docRef)

                if(docRef){
                    set({currentuser:docSnap.data(),loading:false})
                }
                else{
                    set({currentuser:null,loading:false})
                }
            }
            catch(err){
                console.log(err);
                set({currentuser:null,loading:false})
            }
    }

}))
export default useUserStore