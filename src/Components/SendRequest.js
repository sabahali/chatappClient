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
const SendRequest = ({ setAnchorEl, setRequest }) => {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState('')
    const [response,setResponse] = React.useState(null)
    const { user } = React.useContext(userContext);
    const handleClose = () => {
        setAnchorEl(null)
        setRequest(false)
    };
    React.useEffect(() => {
        setOpen(true);
        console.log('modal')
    }, [])
    const handleSendRequest = async(data) =>{
        if(data.email !== user?.email){
            try{
                const result = await axiosInstance('/sendfriendreq',{
                    params:{...data,sender:user.userId}
                })
                if(result) setResponse("Request Sent Successfully")
            }catch(err){
                console.log(err)
                setResponse("No Such User")
            }

        }else {
            setResponse("Your email is not valid")
        }
      
    }
    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        console.log(formData.entries());
                        handleSendRequest(formJson)
                    },
                }}
            >
                <DialogTitle>Send Friend Request</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    </DialogContentText>

                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                    />
                {response !== null ? <Typography>{response}</Typography>
                :null}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" >Send</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default SendRequest
