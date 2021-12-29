import { Button, Container, Grid, Box } from '@mui/material';
import React, { useContext } from 'react';
import firebase from 'firebase'
import {Context} from "../index";

function Login() {

    const { auth } = useContext(Context)

    const login = async () => {
        const provider = new firebase.auth.GoogleAuthProvider()
        const { user } = await auth.signInWithPopup(provider)
        console.log("user: ", user);

    }

    return (
        <Container>
            <Grid container
                style={{ height: window.innerHeight - 50 }}
                alignItems={'center'}
                justifyContent={'center'}
            >
                <Grid container
                    alignItems={'center'}
                    direction={'column'}
                    style={{ width: '50vh', background: 'lightgray' }}
                >
                    <Box p={5}>
                        <Button onClick={login} >Login with Google</Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Login
