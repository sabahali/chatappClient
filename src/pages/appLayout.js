import {  Box, Button, Grid, TextField, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { blueGrey } from '@mui/material/colors';
import { socket } from '../Apis/socket';
import useSWR from 'swr';
import { getContacts, getGroups } from '../Apis/helperApis';
import { userContext } from '../Components/userContext';
import PrivateMsg from './PrivateMsg';
import PrivateSidepanel from './PrivateSidepanel';
import GroupForm from './GroupForm';
import Groupsidepanel from './Groupsidepanel';
import Groupmsgs from './Groupmsgs';
import Usermenu from '../Components/Usermenu';
const AppLayout = () => {
    const [target, setTarget] = useState(null);
    const { user } = useContext(userContext);
    const [privatemsg, setPrivatemsg] = useState(true)
    const [contacts,setContacts] = useState([]);
    const [currentgrp,setCurrentgrp] = useState(null)
    const { data, isLoading, error } = useSWR({url:'/getcontacts',userId:user?.userId}, getContacts, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    })
    const { data:grps, isLoading:grpsLoading, error:grpsError,mutate:mutateGrps} = useSWR(!privatemsg ? {url:'/getgrps',userId:user?.userId} : null, getGroups, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    })
    const [anchorEl, setAnchorEl] = React.useState(null);
    useEffect(()=>{
        setContacts(data)
    },[data])
    useEffect(() => {
        console.log(target)
    }, [target])
    useEffect(() => {
        console.log(currentgrp)
    }, [currentgrp])
    const handleClick = (item) => {
        setTarget({
            name: item.name,
            picture: item.picture,
            userId: item._id
        })
    }
    const handlegroup = (item) =>{
        setCurrentgrp({
            name:item.name,
            _id:item._id,
            members:item.members
        })
    }
    const handleDisconnect = () => {
        socket.disconnect()
    }
    const handleConnect = () => {
        socket.connect()
    }
    useEffect(()=>{
        const joinedGroup = (data) =>{
            console.log(data)
        }
        socket.on('joinedgroup',joinedGroup)
        return(()=>{
            socket.off('joinedgroup',joinedGroup)  
        })
    },[socket])
    return (
        <>
            <Box sx={{ backgroundColor: '#1A2027', width: '100vw', height: '100vh' }}>
                <Grid container direction='row' width='100%' height='10vh'>
                    <Grid item xs={12} sx={{ backgroundColor: '#fff', justifyContent: 'space-between', px: 5, alignItems: 'center', display: 'flex' }} >
                        <Typography>{user.name}</Typography>
                        <Usermenu contacts = {contacts}/>
                        {/* <Button onClick={handleDisconnect}>Disconnect</Button>
                        <Button onClick={handleConnect}>connect</Button> */}
                    </Grid>
                </Grid>
                <Grid container direction='row' width='100%' height='90%' maxHeight='90%'>
                    <Grid item xs={3} sx={{ backgroundColor: blueGrey[500] }} p={2} >
                        <Box sx={{ display: 'flex', width: '100%', height: '5vh', justifyContent: 'space-around', mb: 2 }}>
                            {!privatemsg &&
                                <>
                                    <Button variant='contained' color='primary' onClick={() => setPrivatemsg(true)}>Users</Button>
                                    <GroupForm contacts={contacts} userId = {user?.userId}  mutateGrps={mutateGrps} />
                                </>
                           }
                            {privatemsg &&
                                <>
                                    <Button variant='contained' color='primary' onClick={() => setPrivatemsg(false)}>Groups</Button>
                                </>
                            }

                        </Box>
                        
                        {privatemsg ? <PrivateSidepanel isLoading={isLoading} data={contacts} handleClick={handleClick} error={error} /> : 
                        <Groupsidepanel isLoading={grpsLoading} data={grps} handleClick={handlegroup} error={grpsError}/>}
                    </Grid>
                    {privatemsg ? <PrivateMsg target={target} /> : <Groupmsgs currentgrp = {currentgrp} contacts={contacts}/>}

                </Grid>
            </Box>
        </>

    )
}

export default AppLayout