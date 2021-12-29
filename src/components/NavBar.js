import { AppBar, Button, Grid, Toolbar, Typography } from '@mui/material'
import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { HOME_ROUTE, LOGIN_ROUTE } from '../utils/consts'
import { Context } from '../index'
import {useAuthState} from "react-firebase-hooks/auth";

function NavBar() {


    const {auth} = useContext(Context)
    const [user] = useAuthState(auth)
    console.log("user: ", user);
    // const user = true

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
                            <Button onClick={()=>auth.signOut()}>Logout</Button>                       
                    }

                </Grid>             
            </Toolbar>
        </AppBar>
    )
}

export default NavBar
