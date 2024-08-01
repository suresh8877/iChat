import React from 'react'
import "./list.css"
import useUserStore from '../../../lib/userStore'

function Userinfo() {
  const {currentuser}=useUserStore()

  return (
    <>
        <div className="userinfo">
            <div className="infodetail">
                <img src={currentuser.avatar ||"../src/assets/svgs/avatar.svg"} alt="" />
                <div>{currentuser.username}</div>
            </div>
            <div className="icons">
                <img src="../src/assets/svgs/3dot.svg" alt="" />
                <img src="../src/assets/svgs/video.svg" alt="" />
                <img src="../src/assets/svgs/edit.svg" alt="" />
            </div>
        </div>
    </>
  )
}

export default Userinfo