import { Button, Container, Grid, Box } from '@mui/material';
import React, { useContext } from 'react';
import firebase from 'firebase'
import { Context } from "../index";
import FaceRetouchingOffIcon from '@mui/icons-material/FaceRetouchingOff';
import FaceIcon from '@mui/icons-material/Face';

function Login() {

    const { auth } = useContext(Context)

    const login = async () => {
        const provider = new firebase.auth.GoogleAuthProvider()
        const { user } = await auth.signInWithPopup(provider)
        // console.log("user: ", user);
    }
   
    const login2 = async () => {
        firebase.auth().signInAnonymously()
            .then(() => {
                // Signed in..               
             
            })          

            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...
            });
        // console.log("user: ", user);
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
                        <Button onClick={login} style={{ textTransform: 'none', width: '100%',  }}><FaceIcon/> &nbsp;&nbsp;Login with Google</Button>
                    </Box>                  
                    <Box p={5}>
                        <Button onClick={login2} style={{ textTransform: 'none', width: '100%',}}><FaceRetouchingOffIcon/>&nbsp;&nbsp;Login as Incognito</Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Login
