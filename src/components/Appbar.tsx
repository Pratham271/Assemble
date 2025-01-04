import React from 'react'
import Logout from './Logout'

const Appbar = ({name}:{name:string}) => {
  return (
    <div className="flex justify-between items-center mx-3 mt-2 shadow-sm p-3">
    <h1 className="text-2xl font-bold">Assemble</h1>
    <div className="flex items-center space-x-2">
      <span>Welcome, {name}</span>
      <Logout/>
    </div>
  </div>
  )
}

export default Appbar
