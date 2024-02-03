import * as React from 'react';
import Button from '@mui/material/Button';
import { userContext } from './userContext';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import { axiosInstance } from '../Apis/axiosIntercept';
import { Typography } from '@mui/material';
import useSWR from 'swr';
import { getFrndRequests } from '../Apis/helperApis';
import { blueGrey } from '@mui/material/colors';

const AcceptReq = ({ setAccept, setAnchorEl,mutateContacts }) => {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState('')
    const [response, setResponse] = React.useState(null)
    const { user } = React.useContext(userContext);
    const { data } = useSWR({ url: '/getusercontacts', userId: user.userId }, getFrndRequests)
    const handleClose = () => {
        setAccept(false)
    };
    React.useEffect(() => {
        setOpen(true);
        console.log('modal')
    }, [])
    const handleAccept = async (item) => {
        try{
            const result = await axiosInstance.get('/acceptReq',{
                params:{_id:item._id,userId:user?.userId}
            })
            setResponse(`${item.name} is added to your contacts !`)
            mutateContacts()
        }catch(err){
            setResponse("Failed to add !")
        }

    }
    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Accespt Friend Request</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    </DialogContentText>
                    {!data?.length && <Typography>No Requests !</Typography>}
                    {data?.map((item,index)=><Typography key={index} sx={{":hover":{color:blueGrey[800],cursor:'pointer'},p:1,backgroundColor:blueGrey[200],borderRadius:'10px'}}
                    onClick={()=>handleAccept(item)}
                    >{item.name}</Typography>)}
                    {response !== null ? <Typography>{response}</Typography>
                        : null}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
 
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default AcceptReq