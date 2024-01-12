import React, { useCallback, useState, useEffect, useContext } from 'react'
import { socket } from '../Apis/socket';
import { Avatar, Box, Grid, Typography, Button, TextField, Hidden, FormControl, InputLabel, MenuItem, OutlinedInput, Select, } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import SendIcon from '@mui/icons-material/Send';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import useSWR, { useSWRConfig } from 'swr';
import { getGroupmsgs } from '../Apis/helperApis';
import { userContext } from '../Components/userContext';
const ObjectID = require("bson-objectid");

const Groupmsgs = ({ currentgrp, contacts }) => {
    const { user } = useContext(userContext);
    const [msg, setMsg] = useState([]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(null)
    const { mutate: mutateMsgs } = useSWRConfig();
    const [show, setShow] = useState({ status: true, index: null });
    const [members, setMembers] = useState({})
    const { data: msgData, isLoading: msgLoading, error: msgErr, mutate } = useSWR(user?.userId && currentgrp?._id ? { url: '/getgrpmsgs', groupId: currentgrp._id, userId: user.userId } : null, getGroupmsgs, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    })
    useEffect(() => {
        if (!msgErr && msgData?.length) {
            setMsg(msgData);
            socket.emit('seenallgrpmsgs', { groupId: currentgrp._id, userId: user.userId })
        } else {
            setMsg([])
        }
    }, [msgData])
    useEffect(() => {              //mutating upon reconnection
        const handleConnect = () => {
            socket.sendBuffer = [];
            socket.emit('joinGroup', currentgrp?._id)
        }
        socket.on('connect', handleConnect)
        return (() => {
            socket.off('connect', handleConnect)

        })
    }, [socket]);
    useEffect(() => {
        if (currentgrp?._id) {
            socket.emit('joinGroup', currentgrp._id);
            console.log(currentgrp)
            const obj = {};
            for (const item of currentgrp?.members) {
                obj[item._id] = item.name
            }
            console.log(obj)
            setMembers(obj)
        }
        else if (!currentgrp?._id) {
            mutate();
        } else {

        }

    }, [currentgrp])
    useEffect(() => {
        const newMessage = async (data, cb) => {
            console.log(data)
            if (data?.groupId === currentgrp?._id) {
                cb(`seen,${user?.userId}`)
            } else {
                cb(`received,${user?.userId}`)
            }

            setMsg((prev) => ([data, ...prev]))
        }
        socket.on('newMsgtoGrp', newMessage)
        return (() => {
            socket.off('newMsgtoGrp', newMessage)
        })
    }, [currentgrp, socket])
    useEffect(() => {
        const msgSeenChange = (groupId) => {
            console.log(groupId)
            mutateMsgs({ url: '/getgrpmsgs', groupId, userId: user.userId })
        }

        socket.on('msgSeenGrpchange', msgSeenChange)
        return (() => {
            socket.off('msgSeenGrpchange', msgSeenChange)

        })
    }, [socket]);
    useEffect(() => {

    }, [currentgrp])
    useEffect(() => {             //typing emit
        let timeout
        const hanldeTyping = ({ userId, groupId }) => {
            if (groupId === currentgrp?._id) {
                setTyping(members[userId])
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
    }, [socket])
    const handleSend = async () => {
        setInput('')
        const _id = new ObjectID()
        try {
            const ack = await socket.emitWithAck('sendMessagetogrp', { _id, msg: input, sender: user.userId, groupId: currentgrp?._id, date: new Date(), }, { members: currentgrp?.members.length });
            console.log(ack)
            if (ack.status === 200) {
                console.log('message sent')
                setMsg((prev) => ([{ _id, msg: input, sender: user.userId, groupId: currentgrp?._id, date: new Date().toLocaleString(), seen: true, received: true }, ...prev]));

            } else if (ack.status === 201) {
                setMsg((prev) => ([{ _id, msg: input, sender: user.userId, groupId: currentgrp?._id, date: new Date().toLocaleString(), seen: false, received: true }, ...prev]));

            } else if (ack.status === 400) {
                setMsg((prev) => ([{ _id, msg: input, sender: user.userId, groupId: currentgrp?._id, date: new Date().toLocaleString(), seen: false, received: false }, ...prev]));
            }

        } catch (err) {
            console.log(err)
        }
    }
    const handleInput = (d) => {  //handleinput
        setInput(d)
        if (d !== '') {
            socket.emit('typing', user.userId, currentgrp._id)
        }
    }
    const handleMsgClick = (index) => {
        setShow({ status: true, index: index })
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
                {currentgrp?.members && <>
                    <Box sx={{display:'flex',flexDirection :'row',justifyContent:'center',alignItems :'center'}}>
                        <InputLabel id="demo-multiple-name-label">{currentgrp?.name}</InputLabel>
                        <Select sx={{border:'none',height:'30px',mx:1}} >
                            {currentgrp?.members.map((item, index) => (
                                <MenuItem
                                    key={index}
                                >
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>

                </>
                }
                <Typography>{typing && ` ${typing}Typing ... `}</Typography>
                <Avatar>{currentgrp?.picture}</Avatar>
            </Box>
            <Box sx={{
                backgroundColor: blueGrey[700], display: 'flex', width: '100%', height: '72vh', overflowY: 'auto', boxShadow: '10',
                flexDirection: 'column-reverse', p: 1
            }}>
                {msg.map((item, index) => {

                    if (item.sender === user?.userId) {
                        const hoverStatus = false;
                        return <Box key={index} alignSelf='end' sx={{ ":hover": { backgroundColor: blueGrey[600], hoverStatus: true }, cursor: 'pointer', px: 2, borderRadius: '10px' }}
                            onClick={() => handleMsgClick(index)}
                        >
                            <Typography variant='h6' color={blueGrey[200]} >{item.msg}  <span>{item.seen === true && item.received === true ? <CheckCircleIcon /> : item?.seenBy?.length === currentgrp?.members?.length ? <CheckCircleIcon /> : item.received === true ? <DoneAllIcon /> : <CheckIcon />}</span></Typography>
                            <Typography variant='body2' color={blueGrey[200]}>{relativeTime(item.date)}</Typography>
                            <Typography color={blueGrey[300]} style={{
                                opacity: show.status === true && show.index === index ? 1 : 0,
                                visibility: show.status === true && show.index === index ? 'visible' : 'hidden',
                                transition: 'opacity 0.5s ease, visibility 0.5s ease',
                                position: show.status === true && show.index === index ? 'relative' : 'absolute',
                            }}>Seen by &nbsp;
                                {item?.seenBy?.map((id) => {
                                    return currentgrp.members.map((mem) => {
                                        if (mem._id === id && mem._id !== user?.userId) return mem?.name
                                    })
                                })}
                            </Typography>
                        </Box>

                    } else {
                        return <Box key={index} alignSelf='start' sx={{ borderStyle: 'solid', borderColor: blueGrey[300], border: '10px' }}
                        >
                            <Typography variant='body2' color={blueGrey[200]}> From : {contacts.map((user) => user._id === item.sender ? user.name : null)}</Typography>
                            <Typography variant='h6' color={blueGrey[200]} >{item.msg}</Typography>
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

export default Groupmsgs