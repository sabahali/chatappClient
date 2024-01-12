import React, { useEffect } from 'react'
import { Avatar, Box, TextField, Typography } from '@mui/material'
import { blueGrey } from '@mui/material/colors'
import { useState } from 'react'
const Groupsidepanel = ({ isLoading, data, handleClick, error }) => {
    const [search, setSearch] = useState('')
    const [groups,setGroups] = useState([])

    useEffect(()=>{
        if(search == ''){
        setGroups(data)
        }else{
            const items = data?.filter((item)=>item.name.includes(search))
            setGroups(items)
        }

    },[search,data])
    return (<>
        <Box sx={{ display: 'flex', width: '100%', height: '10vh', justifyContent: 'space-around', direction: 'row' }}>
            <TextField  label="Search" variant="outlined" fullWidth  value={search} onChange = {(e)=>setSearch(e.target.value)} sx={{color:blueGrey[200]}}
            inputProps={{ style: { color: blueGrey[200],borderColor:'black',forcedColorAdjust:'red' } }}
            />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '65vh', backgroundColor: blueGrey[100], borderRadius: '10px', overflowY: 'auto' }}>
            {!isLoading && !error && data &&
                groups?.map((item, index) => (
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
    </>
    )
}

export default Groupsidepanel