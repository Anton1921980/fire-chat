import { AppBar, Button, Grid, IconButton, Toolbar, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { HOME_ROUTE, LOGIN_ROUTE } from '../utils/consts'
import { Context } from '../index'
import { Context2 } from '../App'
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from 'firebase';
import 'firebase/database';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

function NavBar() {

    const { opened, setOpened } = useContext(Context2);
    const { auth } = useContext(Context)

    const [user] = useAuthState(auth)
    const database = firebase.database()

    const statusOffline = () => {
        const refStatus = database.ref(`/status/${user.displayName}`);
        refStatus.set('offline');
    }
    const [disabled, setDisabled] = useState(false)


    return (
        <AppBar position="static" color="" sx={{ background: '#5890901f',overflow:'hidden' }}>
            <Toolbar variant="dense">

                <Grid container justifyContent={"space-around"}>
                    <IconButton
                        onClick={() => (!opened ? setOpened(true) : setOpened(false))}
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ display: { xs: 'block', lg: 'none', }, mr: 2 }}
                    >
                        {!opened ? <MenuIcon /> : <CloseIcon sx={{color:'#1976d2'}} />}
                    </IconButton>

                    <NavLink to={HOME_ROUTE}>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', lineHeight: 1.3, color: '#3300ff', position: 'relative', top: { xs: 18, lg: 5 }, left: { lg: '93vh' } }}
                        // style={{ display: 'flex', lineHeight: 1.3, color: '#3300ff' }}
                        >
                            <LocalFireDepartmentIcon /> Fire_Chat
                        </Typography>
                    </NavLink>
                    <Grid item sx={{ position: 'relative', top: { xs: 12, md: 0 }, left: { xs: 40, md: 0 }, marginLeft: { md: 'auto' }, }}>
                        {!user ?
                            <NavLink to={LOGIN_ROUTE}>
                                <Button onClick={() => setDisabled(true)} disabled={disabled}><LoginIcon /></Button>
                            </NavLink>
                            :
                            <Button onClick={() => { statusOffline(); auth.signOut() }}><LogoutIcon /></Button>
                        }
                    </Grid>

                </Grid>
            </Toolbar>
        </AppBar>
    )
}

export default NavBar
