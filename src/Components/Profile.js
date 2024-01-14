import * as React from 'react';
import Button from '@mui/material/Button';
import { userContext } from './userContext';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { axiosInstance } from '../Apis/axiosIntercept';
import { Avatar, Input, Typography } from '@mui/material';
import { FileUpload } from '@mui/icons-material';


const Profile = ({ SetProfile }) => {

    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState('')
    const [response, setResponse] = React.useState(null)
    const { user,setUser } = React.useContext(userContext);
    const [image, setImage] = React.useState(null)
    const [file, setFile] = React.useState(null)
    React.useEffect(() => {
        setOpen(true);
        console.log('modal')
    }, [])
    const handleClose = () => {
        setOpen(false)
        SetProfile(false)
    }
    const save = async () => {
        console.log(file)
        if (file) {
          
            try {
                const formData = new FormData();
                formData.append('userId', user?.userId);
                formData.append('file', file);
                console.log(formData)
                await axiosInstance.post('/adddp', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })
                setResponse("Profile Picture Saved !");
                setUser((pre)=>({...pre,picture:image}))
            } catch (err) {
                setResponse("Failed to Save !")
            }
        }
    }
    const handleFile = (e) => {
        const file = e.target.files[0]
        if (file) {
            console.log(URL.createObjectURL(file))
            setImage(URL.createObjectURL(file));
            setFile(file)
        }


    }

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Send Friend Request</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    </DialogContentText>
                    <input
                        accept="image/*"
                        id="contained-button-file"
                        type="file"
                        onChange={handleFile}
                    />
                    <Avatar sx={{ m: 1 }} src={image ? image : user?.picture}></Avatar>
                    {response !== null ? <Typography>{response}</Typography>
                        : null}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button startIcon={<FileUpload />} onClick={save}>Save</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default Profile