import { Avatar, Box, Button, Grid, TextField, Typography } from '@mui/material'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { blueGrey } from '@mui/material/colors';
import { socket } from '../Apis/socket';
import useSWR, { useSWRConfig } from 'swr';
import { getContacts, getMsgs } from '../Apis/helperApis';
import { userContext } from '../Components/userContext';
import PrivateMsg from './PrivateMsg';
const AppLayout = () => {
    const [target, setTarget] = useState(null);
    const { user } = useContext(userContext);
    const [privatemsg, setPrivatemsg] = useState(true)
    const { data, isLoading, error } = useSWR('/getcontacts', getContacts, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    })
    useEffect(() => {
        console.log(target)
    }, [target])
    const handleClick = (item) => {
        setTarget({
            name: item.name,
            picture: item.picture,
            userId: item._id
        })
    }

    const handleDisconnect = () => {
        socket.disconnect()
    }
    const handleConnect = () => {
        socket.connect()
    }
    return (
        <>
            <Box sx={{ backgroundColor: '#1A2027', width: '100vw', height: '100vh' }}>
                <Grid container direction='row' width='100%' height='10vh'>
                    <Grid item xs={12} sx={{ backgroundColor: '#fff', justifyContent: 'space-between', px: 5, alignItems: 'center', display: 'flex' }} >
                        <Typography>{user.name}</Typography>
                        <Avatar>{user.picture}</Avatar>
                        <Button onClick={handleDisconnect}>Disconnect</Button>
                        <Button onClick={handleConnect}>connect</Button>
                    </Grid>
                </Grid>
                <Grid container direction='row' width='100%' height='90%' maxHeight='90%'>
                    <Grid item xs={3} sx={{ backgroundColor: blueGrey[500] }} p={2} >
                        <Box sx={{ display: 'flex', width: '100%', height: '5vh', justifyContent: 'space-around', mb: 2 }}>
                            <Button variant='contained' color='primary'>Users</Button>
                            <Button variant='contained' color='primary'>Groups</Button>
                        </Box>
                        <Box sx={{ display: 'flex', width: '100%', height: '10vh', justifyContent: 'space-around', direction: 'row' }}>
                            <TextField id="search" label="Search" variant="outlined" value='' fullWidth />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '65vh', backgroundColor: blueGrey[100], borderRadius: '10px', overflowY: 'auto' }}>
                           {!isLoading && !error &&
                                data.map((item, index) => (
                                    <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', p: 2, cursor: 'pointer', ":hover": { backgroundColor: blueGrey[500], color: blueGrey[100] }, }} key={index}
                                        onClick={() => handleClick(item)}
                                    >
                                        <Avatar></Avatar>
                                        <Typography sx={{ ml: 2 }}

                                        >{item.name}</Typography>
                                    </Box>

                                ))
                            }
                        </Box>
                    </Grid>
                    {privatemsg ? <PrivateMsg target={target}/> : null}

                </Grid>
            </Box>
        </>

    )
}

export default AppLayout