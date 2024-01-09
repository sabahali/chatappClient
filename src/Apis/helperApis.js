import { axiosInstance } from "./axiosIntercept";


export const getReload = async()=>{
    try{
        const res= await axiosInstance.get('/reload')
    return res.data
    }catch(err){
        throw err
    }
}
export const credential = async(args) =>{
    try{
        const resp = await axiosInstance.get('/auth',{
            params:{userId:args}
        })
        // console.log(resp.data)
        return resp.data
    }catch(err){
        console.log(err)
        throw err
    }
}
export const getContacts = async(args) =>{
    try{
        const res = await axiosInstance.get('/getcontacts')
        return res.data
    }catch(err){
        throw err
    }
}
export const getMsgs = async({url,sender,receiver}) =>{
    console.log(sender,receiver)
    try{
        const res = await axiosInstance.get('/getmsgs',{
            params:{sender,receiver}
        })
        // console.log(res.data)
        return res.data
    }catch(err){
        throw err
    }
}