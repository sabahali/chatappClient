import LoadingModal from "../Components/LoadingModal"
import { useContext,useEffect } from "react"
import { userContext } from "../Components/userContext"
import { credential } from "../Apis/helperApis";
import { useNavigate, useParams } from "react-router-dom";

const Login = () => {
  const {setUser} = useContext(userContext);
  const params = useParams()
  const navigate = useNavigate()
  useEffect(()=>{
    if(params?.userId){
        async function auth () {
            try{
                const resp = await credential(params?.userId)
                setUser((p)=>{
                    return{...p,accessToken:resp.accessToken,userId:params.userId,email:resp.email,
                    name:resp.name,email:resp.email,picture:resp.picture,requests:resp.requests
                    }
                })
            }catch(err){
                
            }finally{
                navigate('/app',{replace:true})
            }
            
        }
        auth()
    }
},[params])


    return(
        <div>
            <LoadingModal/>
        </div>
    )
}

export default Login