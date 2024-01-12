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
export const getContacts = async({userId}) =>{
    try{
        const res = await axiosInstance.get('/getcontacts',{
            params:{userId}
        })
        return res.data
    }catch(err){
        throw err
    }
}
export const getMsgs = async({url,sender,receiver}) =>{
    // console.log(sender,receiver)
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
export const getGroups = async({url,userId}) =>{
    console.log(userId)
    try{
        const res = await axiosInstance.get('/getgrps',{
            params:{userId}
        })
        console.log(res.data)
        return res.data
    }catch(err){
        throw err
    }
}
export const getGroupmsgs = async({url,userId,groupId}) =>{
    try{
        const res = await axiosInstance.get('/getgroupmsgs',{
            params:{userId,groupId}
        })
        console.log(res.data)
        return res.data
    }catch(err){
        throw err
    }
};
export const getFrndRequests = async({url,userId}) =>{
    try{
        const res = await axiosInstance.get('/getusercontacts',{
            params:{userId}
        })
        console.log(res.data)
        return res.data
    }catch(err){
        throw err
    }
};