import React, { useContext, useEffect, useRef, useState } from 'react'
import { Context } from '../index'
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore"
import { Avatar, Button, Container, Grid, Modal, TextField, Typography } from '@mui/material';
import Loader from './Loader';
import firebase from 'firebase';
import 'firebase/auth';

// import { AccessAlarm, ThreeDRotation } from '@mui/icons-material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Box } from '@mui/system';


function Chat() {

    const { auth, firestore } = useContext(Context)
    const [user] = useAuthState(auth)

    console.log("user: ", user);

    const [value, setValue] = useState('')

    const [messages, loading] = useCollectionData(
        firestore.collection("messages").orderBy('createdAt')
    )

    let mes = []
    messages && messages.map(message => {
        console.log("message: ", message.displayName);
        mes.push(message.displayName)
    })
    const users1 = new Set(mes)
    const users = Array.from(users1)
    console.log("users: ", users);

    const [fileName, setFileName] = useState(null)
    const [url, setUrl] = useState(null)
    const [imgUrl, setImgUrl] = useState(null)

    const messagesEndRef = useRef(null)
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }




    const [open, setOpen] = useState(false);
    // const handleOpen = (url) => setOpen(true); setImgUrl(url);
    const handleClose = () => setOpen(false);

    const handleOpen = (url) => {
        setImgUrl(url);
        setOpen(true);
    }


    useEffect(() => {
        scrollToBottom()
    }, [messages]);


    if (loading) {
        return <Loader />
    }


    const onChange = (e) => {
        const file = e.target.files[0];
        setFileName(file.name)
        firebase
            .storage()
            .ref('images/' + file.name)
            .put(file)
            .then(() => {
                firebase
                    .storage().ref('images/' + file.name)
                    .getDownloadURL()
                    .then(imgUrl => {
                        setUrl(imgUrl)
                        console.log("uploaded", url)
                    })
            })
    }
    // const getFile = async () => {
    //     firebase.storage()
    //         .ref(`images/${fileName}`)
    //         .getDownloadURL()
    //         .then(imgUrl => {
    //             setUrl(imgUrl)
    //             console.log(imgUrl);

    //         })
    // }
    const sendMessage = async () => {
        // console.log(value)
        // await getFile()
        await firestore.collection('messages').add({
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
            text: value,
            url: url,
            fileName: fileName,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        setValue('')
        // await getFile()
    }
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90vh',
        boxSizing: 'border-box',
        bgcolor: 'background.paper',
        border: 'none',
        padding: 0,
        boxShadow: 24,
    };

    return (
        <Container>
            <Grid container
                style={{ height: window.innerHeight / 15 }}
                alignItems={'center'}
                justifyContent={'center'}
            >
                <h4>in chat:</h4>
                {users.map(user =>
                    <div
                        key={user}
                        style={{
                            width: 'fit-content',
                            // marginLeft: user.uid === message.uid ? 'auto' : '10px',
                        }}
                    >
                        {/* {console.log("messages: ", messages)} */}
                        <Grid container>
                            {/* <Avatar src={message.photoURL} /> */}
                            <div
                                style={{
                                    lineHeight: '35px',
                                    marginLeft: 5
                                }}
                            > {user}
                            </div>
                        </Grid>
                    </div>
                )}
            </Grid>

            <Grid container
                style={{ height: window.innerHeight - 50 }}
                alignItems={'center'}
                justifyContent={'center'}
            >
                <div style={{ width: '80%', height: '70vh', border: '1px solid grey', overflowY: 'auto' }}>
                    {messages.map((message, i) =>

                        <div
                            key={message.createdAt}
                            style={{
                                width: 'fit-content',
                                marginLeft: user.uid === message.uid ? 'auto' : '10px',
                            }}
                        >
                            {/* {console.log("message: ", message)} */}

                            <Grid container>
                                <Avatar src={message.photoURL} />
                                <div
                                    style={{
                                        lineHeight: '35px',
                                        marginLeft: 5
                                    }}
                                >{message.displayName}
                                </div>
                            </Grid>
                            <div
                                style={{
                                    margin: 10,
                                    padding: 15,
                                    border: '1px solid transparent',
                                    borderRadius: 100,
                                    padding: 25,
                                    backgroundColor: user.uid === message.uid ? 'lightgrey' : 'gray',
                                    width: 'fit-content',
                                }}
                            >{message.text}
                            </div>
                            <div
                                ref={messagesEndRef}
                            // style={{ width: 70, height: 70, backgroundColor: 'grey' }}
                            >
                                {message.url && (message.url).includes('.png' || '.jpg' || '.jpeg' || '.gif') ?
                                    <>
                                        <img
                                            style={{ width: 70, height: 70, cursor: 'pointer' }}
                                            src={message.url}
                                            onClick={() => { handleOpen(messages[i].url) }}
                                        >
                                        </img>
                                    </>
                                    : null
                                }
                            </div>
                            {message.url &&
                                <div
                                //   onClick={() => download(message.url)}
                                >
                                    <a href={message.url} download>
                                        <FileDownloadIcon style={{ position: 'relative', top: 7 }} /> {message.fileName}
                                    </a>
                                </div>
                            }

                        </div>
                    )}
                    <Modal
                        open={open}
                        onClose={handleClose}
                    >
                        <Box sx={style}>
                            <img src={imgUrl} style={{ width: '100%', height: '100%' }} />
                        </Box>
                    </Modal>
                </div>
                <Grid
                    container
                    direction={'column'}
                    alignItems={'flex-end'}
                    style={{ width: '80%' }}
                >
                    <TextField
                        fullWidth
                        // rowsMin={2}
                        variant={'outlined'}
                        value={value}
                        placeholder='type message'
                        onChange={e => setValue(e.target.value)}
                    />
                    <input type="file" onChange={onChange}></input>
                    <Button onClick={sendMessage}>Send</Button>
                </Grid>
            </Grid>

        </Container>

    )
}
export default Chat
