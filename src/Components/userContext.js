import React, { useState } from 'react'
import { createContext } from 'react'
export const userContext = createContext()
const UserProvider = ({children}) => {
   const [user,setUser] = useState({
        name :'',
        email:'',
        picture:'',
        userId:'',
        accessToken:'',

    })
  return (
    <userContext.Provider value={{user,setUser}}>
        {children}
    </userContext.Provider>
  )
}

export default UserProvider