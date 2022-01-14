import { AppBar, Button, Grid, Toolbar, Typography } from '@mui/material'
import React, { useContext, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { HOME_ROUTE, LOGIN_ROUTE } from '../utils/consts'
import { Context } from '../index'
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from 'firebase';
import 'firebase/database';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';

function NavBar() {


    const { auth } = useContext(Context)
    const [user] = useAuthState(auth)
    // console.log("user: ", user);
    // const user = true
    const database = firebase.database()
    const statusOffline = () => {
        const refStatus = database.ref(`/status/${user.displayName}`);
        refStatus.set('offline');
    }
    const [disabled, setDisabled] = useState(false)
    return (
        <AppBar position="static" color="">
            <Toolbar variant="dense">
                <NavLink to={HOME_ROUTE}>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} style={{ display: 'flex', lineHeight: 1.3, color: '#3300ff' }}>
                        <LocalFireDepartmentIcon /> Fire_Chat
                    </Typography>
                </NavLink>
                <Grid container justifyContent={"flex-end"}>
                    {!user ?
                        <NavLink to={LOGIN_ROUTE}>
                            <Button onClick={()=>setDisabled(true)} disabled={disabled}><LoginIcon /></Button>
                        </NavLink>
                        :
                        <Button onClick={() => { statusOffline(); auth.signOut() }}><LogoutIcon /></Button>
                    }

                </Grid>
            </Toolbar>
        </AppBar>
    )
}

export default NavBar
