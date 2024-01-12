import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Avatar, Typography } from '@mui/material';
import { userContext } from './userContext';
import SendRequest from './SendRequest';
import AcceptReq from './AcceptReq';
export default function Usermenu({contacts}) {
    const { user } = React.useContext(userContext);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [request, setRequest] = React.useState(false)
    const [accept, setAccept] = React.useState(false)
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const sendRequest = () => {
        setAnchorEl(null);
        setRequest(true)
    }
    const acceptRequest = () => {
        setAnchorEl(null);
        setAccept(true)
    }
    const logout = () => {

    }

    return (
        <div>
            {request ? <SendRequest setAnchorEl={setAnchorEl} setRequest = {setRequest}/> : accept ? <AcceptReq setAnchorEl={setAnchorEl} setAccept = {setAccept} /> : null}
                <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                >
                    <Avatar src={user?.picture}></Avatar>
                </Button>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={sendRequest}>Send Friend Request</MenuItem>
                    <MenuItem onClick={acceptRequest}>Accept request</MenuItem>
                    <MenuItem onClick={logout}>Logout</MenuItem>
                </Menu>


        </div>
    );
}