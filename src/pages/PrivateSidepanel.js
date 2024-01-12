import { Avatar, Box, Typography } from '@mui/material'
import { blueGrey } from '@mui/material/colors'
import React from 'react'

const PrivateSidepanel = ({isLoading,data,handleClick,error}) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '65vh', backgroundColor: blueGrey[100], borderRadius: '10px', overflowY: 'auto' }}>
            {!isLoading && !error &&
                data?.map((item, index) => (
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
    )
}

export default PrivateSidepanel