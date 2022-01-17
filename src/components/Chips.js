import { Avatar, Chip, Stack } from '@mui/material'
import React from 'react'

function Chips({ statusAllUsers,regUsers}) {
    console.log("statusAllUsers: ", statusAllUsers);
   
    return (
        
            <Stack direction="row" spacing={1} sx={{
                top: { xs: 25, md: 25 }, left: { xs: 2 },
                display: 'flex', zIndex: 1, alignContent: 'flex-start', alignItems: 'flex-start', color: 'grey', position: 'relative',
            }}>
                <Chip size='small' sx={{ background: 'transparent' }} label={`online`} avatar={<Avatar sx={{ background: '#1693eb' }}>{(Object.values(statusAllUsers).filter(value => value === 'online')).length}</Avatar>} />
                <Chip size='small' sx={{ background: 'transparent' }} label={`away`} avatar={<Avatar sx={{ background: '#ff6589' }}>{(Object.values(statusAllUsers).filter(value => value === 'away')).length}</Avatar>} />
                <Chip size='small' sx={{ background: 'transparent' }} label={`offline `} avatar={<Avatar sx={{ background: '#7fa8c5' }}>{regUsers.length - (Object.values(statusAllUsers).filter(value => value === 'online')).length -
                    (Object.values(statusAllUsers).filter(value => value === 'away')).length}</Avatar>} />
            </Stack>
       
    )
}

export default Chips
