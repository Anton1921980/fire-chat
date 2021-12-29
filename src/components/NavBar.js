import { AppBar, Button, Grid, Toolbar, Typography } from '@mui/material'
import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { LOGIN_ROUTE } from '../utils/consts'
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
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Fire_Chat
                </Typography>
                <Grid container justifyContent={"flex-end"}>
                    {!user ?
                        <NavLink to={LOGIN_ROUTE}>
                            <Button>Login</Button>
                        </NavLink>
                        :
                       
                            <Button onClick={()=>auth.signOut()}>Logout</Button>
                       
                    }

                </Grid>
                {/* <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" color="inherit" component="div">
                    Photos
                </Typography> */}
            </Toolbar>
        </AppBar>
    )
}

export default NavBar
