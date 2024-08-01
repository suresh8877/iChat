import React from 'react'
import "./list.css"
import Userinfo from './Userinfo'
import Chatlist from './Chatlist'
import Detail from '../detail/Detail'

function List() {
  return (
    <div className='list'>
      <Userinfo/>
      <Chatlist/>
      <div className="footer">
        <div className="heading">iCHAT</div>
        <div className="heading">&copy; 2024</div>
      </div>
    </div>
  )
}

export default List