import { Avatar, Box, TextField, Typography } from '@mui/material'
import { blueGrey } from '@mui/material/colors'
import React, { useEffect, useState } from 'react'

const PrivateSidepanel = ({ isLoading, data, handleClick, error }) => {
    const [search, setSearch] = useState('')
    const [contacts,SetContacts] = useState([])

    useEffect(()=>{
        if(search == ''){
            SetContacts(data)
        }else{
            const items = data?.filter((item)=>item.name.includes(search))
            SetContacts(items)
        }

    },[search,data])
    return (<>
        <Box sx={{ display: 'flex', width: '100%', height: '10vh', justifyContent: 'space-around', direction: 'row' }}>
            <TextField label="Search" variant="outlined" fullWidth value={search} onChange={(e) => setSearch(e.target.value)} sx={{ color: blueGrey[200] }}
                inputProps={{ style: { color: blueGrey[200], borderColor: 'black', forcedColorAdjust: 'red' } }}
            />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '65vh', backgroundColor: blueGrey[100], borderRadius: '10px', overflowY: 'auto' }}>
            {!isLoading && !error &&
                contacts?.map((item, index) => (
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

export default PrivateSidepanel