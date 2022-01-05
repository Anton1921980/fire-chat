import { AppBar, Button, Grid, Toolbar, Typography } from '@mui/material'
import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { HOME_ROUTE, LOGIN_ROUTE } from '../utils/consts'
import { Context } from '../index'
import {useAuthState} from "react-firebase-hooks/auth";
import firebase from 'firebase';
import 'firebase/database';


function NavBar() {


    const {auth} = useContext(Context)
    const [user] = useAuthState(auth)
    // console.log("user: ", user);
    // const user = true
    const database = firebase.database()
    const statusOffline =()=>{
    const refStatus = database.ref(`/status/${user.displayName}`);
            refStatus.set('offline');
     
    }
    return (
        <AppBar position="static" color="">
            <Toolbar variant="dense">
            <NavLink to={HOME_ROUTE}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Fire_Chat
                </Typography>
                </NavLink>
                <Grid container justifyContent={"flex-end"}>
                    {!user ?
                        <NavLink to={LOGIN_ROUTE}>
                            <Button>Login</Button>
                        </NavLink>
                        :                       
                            <Button onClick={()=>{auth.signOut();statusOffline()}}>Logout</Button>                       
                    }

                </Grid>             
            </Toolbar>
        </AppBar>
    )
}

export default NavBar
