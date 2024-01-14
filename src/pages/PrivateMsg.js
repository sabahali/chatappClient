import React, { useCallback, useState, useEffect, useContext } from 'react'
import { socket } from '../Apis/socket';
import { Avatar, Box, Grid, Typography, Button, TextField, } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import SendIcon from '@mui/icons-material/Send';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import useSWR, { useSWRConfig } from 'swr';
import { getMsgs } from '../Apis/helperApis';
import { userContext } from '../Components/userContext';
var ObjectID = require('bson').ObjectID;
const { v4: uuidv4 } = require('uuid');

const PrivateMsg = ({ target }) => {
    const { user } = useContext(userContext);
    const [msg, setMsg] = useState([]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false)
    const { mutate: mutateMsgs } = useSWRConfig();
    const { data: msgData, isLoading: msgLoading, error: msgErr, mutate } = useSWR(user?.userId && target?.userId ? { url: '/getmsgs', sender: user?.userId, receiver: target?.userId } : null, getMsgs, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    })

    useEffect(() => {            //Received msgs but not seen
        if (!msgErr && msgData?.length) {
            setMsg(msgData);
            socket.emit('sawreceived', { sender: target?.userId, receiver: user?.userId })
        } else {
            setMsg([])
        }
    }, [msgData]);
    useEffect(() => {              //mutating upon reconnection
        const handleConnect = () => {
            socket.sendBuffer = [];
            socket.emit('userConnected', user)
            mutate()
            console.log('reconnecting')
            if (target?.userId && user?.userId) {
                socket.emit('allseen', { sender: target.userId, receiver: user.userId })
            }
        }
        socket.on('connect', handleConnect)
        return (() => {
            socket.off('connect', handleConnect)

        })
    }, [socket]);
    useEffect(() => {     //msg seen by other user
        const messageSeen = ({ sender, receiver }) => {
            mutateMsgs({ url: '/getmsgs', sender, receiver })
        }
        socket.on('msgseenchange', messageSeen)
        return (() => {
            socket.off('msgseenchange', messageSeen)

        })
    }, [socket]);

    useEffect(() => {             //typing emit
        let timeout
        const hanldeTyping = (id) => {
            if (id === target?.userId) {
                setTyping(true)
                timeout = setTimeout(() => {
                    setTyping(false)
                }, 1000)
            }
        }
        socket.on('typing', hanldeTyping)
        return (() => {
            clearTimeout(timeout)
            socket.off('typing', hanldeTyping)
        })
    }, [socket, target])
    useEffect(() => {   //emit userchanged or reload for storing userid
        socket.emit('userConnected', user);
    }, [socket, user])
    // useEffect(() => {   // msgs console
    //     console.log('msg', msg)
    // }, [msg])
    useEffect(() => {   // newMEssages incoming
        const handleMessage = (data, cb) => {

            if (data.sender === target?.userId) {
                // console.log(data.sender, target?.userId)
                cb('seen')
            } else {
                cb('gotit')
            }

            // console.log(data);
            setMsg((prev) => {
                const updatedSent = [data, ...prev];
                return updatedSent;
            });

        };
        socket.on('newMessage', handleMessage);
        return () => {
            socket.off('newMessage', handleMessage);
        };
    }, [socket, target])
    useEffect(() => {  // receiver offline
        const handleoffline = (data) => {
            console.log('receiver is offline', data)
        }
        socket.on('receiverOffline', handleoffline)
        return (() => {
            socket.off('receiverOffline', handleoffline)

        })
    }, [socket])
    const handleSend = async (e) => {   // handleSend
        const _id = uuidv4()
        setInput('');
        if (!socket.connected) {
            setMsg((prev) => ([{ _id, msg: input, sender: user.userId, receiver: target.userId, date: new Date().toISOString(), status: 'pending' }, ...prev]));
        }
        try {
            const ack = await socket.emitWithAck('sendMessage',
                { _id, msg: input, sender: user.userId, receiver: target.userId, date: new Date(), });
            console.log(ack)
            if (ack.status == 200) {
                console.log('message sent')
                setMsg((prev) => ([{ _id, msg: input, sender: user.userId, receiver: target.userId, date: new Date().toISOString(), seen: true, received: true }, ...prev]));
            }
            else if (ack.status == 201) {
                console.log('message sent')
                setMsg((prev) => ([{ _id, msg: input, sender: user.userId, receiver: target.userId, date: new Date().toISOString(), seen: false, received: true }, ...prev]));
            }
            else if (ack.status == 400) {
                setMsg((prev) => ([{ _id, msg: input, sender: user.userId, receiver: target.userId, date: new Date().toISOString(), seen: false, received: false }, ...prev]));
                console.log('Receiver is offline')

            }
        } catch (err) {
            setMsg((prev) => ([{ _id, msg: input, sender: user.userId, receiver: target.userId, date: new Date().toISOString(), seen: false, failed: true }, ...prev]));
            console.log('Server not available')

        }
    }
    const handleInput = (d) => {  //handleinput
        setInput(d)
        if (d !== '') {
            socket.emit('typing', user?.userId, target?.userId)
        }
    }

    const relativeTime = useCallback((isoDate) => {
        const date = new Date(isoDate)
        const now = new Date(); // Current date and time
        const diff = now - date; // Difference in milliseconds

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 7) {
            return date.toLocaleString(); // If more than 7 days, return the full date
        }

        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ago`;
        }
        if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        }
        if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        }
        return 'Just now';

    }, [msg, input])
    return (
        <Grid item xs={9} sx={{ backgroundColor: blueGrey[800] }} justifyContent='center' p={1}>
            <Box sx={{ backgroundColor: blueGrey[200], display: 'flex', width: '100%', height: '7vh', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                <Typography>{target?.name}</Typography>
                <Typography>{typing && 'Typing ... '}</Typography>
                <Avatar>{target?.picture}</Avatar>
            </Box>

            <Box sx={{
                backgroundColor: blueGrey[700], display: 'flex', width: '100%', height: '72vh', overflowY: 'auto', boxShadow: '10',
                flexDirection: 'column-reverse', p: 1
            }}>
                {msg.map((item, index) => {

                    if (item.receiver == target?.userId) {
                        return <Box key={index} alignSelf='end'>
                            <Typography variant='h6' color={blueGrey[200]} >{item.msg}  <span>{item.seen === true && item.received === true ? <CheckCircleIcon /> : item.seen === false && item.received === true ? <DoneAllIcon /> : <CheckIcon />}</span></Typography>
                            <Typography variant='body2' color={blueGrey[200]}>{relativeTime(item.date)}</Typography>
                        </Box>

                    } else if (item.sender == target?.userId) {
                        return <Box key={index} alignSelf='start'
                        >    <Typography variant='h6' color={blueGrey[200]} >{item.msg}</Typography>
                            <Typography variant='body2' color={blueGrey[200]}>{relativeTime(item.date)}</Typography>

                        </Box>
                    }
                })}
            </Box>
            <Box sx={{ backgroundColor: blueGrey[200], display: 'flex', width: '100%', height: '8vh', justifyContent: 'center', alignItems: 'center', p: 2 }}>
                <TextField id="search" label="Enter Message" variant="outlined" value={input}
                    sx={{ width: '100%', height: '80%', mb: 3, mr: 2 }} size='small' onChange={(e) => handleInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSend(e);
                        }
                    }}
                />
                <Button variant="contained" endIcon={<SendIcon />}
                    onClick={handleSend}
                >
                    Send
                </Button>
            </Box>
        </Grid>
    )
}

export default PrivateMsg