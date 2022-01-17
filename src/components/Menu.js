
import { Divider, ListItemIcon, ListItemText, MenuItem, MenuList } from '@mui/material'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { CHAT_ROUTE, INCOGNITO_CHAT_ROUTE, REGISTERED_CHAT_ROUTE } from '../utils/consts';
import FaceIcon from '@mui/icons-material/Face';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import FaceRetouchingOffIcon from '@mui/icons-material/FaceRetouchingOff';

function Menulist(props) {
  const  propsPage=props.props.page
    console.log("propsPage: ", propsPage);

    return (
        <>
            <MenuList style={{ width: '95%' }}>
                <NavLink to={CHAT_ROUTE}>
                    <MenuItem style={{ background: propsPage === 'group' ? '#f8fdf9' : 'none' }}>
                        <ListItemIcon>
                            <FaceIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Fire_Chat</ListItemText>
                    </MenuItem>
                </NavLink>
                <NavLink to={REGISTERED_CHAT_ROUTE}>
                    <MenuItem style={{ background: propsPage === 'registered' ? '#f8fdf9' : 'none' }}>
                        <ListItemIcon>
                            <FaceRetouchingNaturalIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Registered</ListItemText>
                    </MenuItem>
                </NavLink>
                <NavLink to={INCOGNITO_CHAT_ROUTE}>
                    <MenuItem style={{ background: propsPage === 'incognito' ? '#f8fdf9' : 'none' }}>
                        <ListItemIcon>
                            <FaceRetouchingOffIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Incognito</ListItemText>
                    </MenuItem>
                </NavLink>
                <Divider/>
            </MenuList>
        </>
    )
}

export default Menulist


