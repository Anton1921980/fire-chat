import React, { useContext, useEffect, useRef, useState } from 'react'
import { Context } from '../index'
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore"
import { Avatar, Button, Container, Grid, Modal, TextField, Typography } from '@mui/material';
import Loader from './Loader';
import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/database';
import { useList, useObject } from 'react-firebase-hooks/database';
// import { AccessAlarm, ThreeDRotation } from '@mui/icons-material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { Box } from '@mui/system';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

function Chat() {

    const { auth, firestore } = useContext(Context)
    const [user] = useAuthState(auth)
    console.log("user: ", user);

    const [value, setValue] = useState('')

    const [messages, loading1] = useCollectionData(
        firestore.collection("messages").orderBy('createdAt')
    )
    const database = firebase.database()

    const userId = user.uid;
    console.log("userId: ", userId);

    const [online, setOnline] = useState([])
    const [regUsers, setRegUsers] = useState([])
    const [statusAllUsers, setStatusAllUsers] = useState([])
    console.log("regUsers: ", regUsers);
    const [showEmoji, setShowEmoji] = useState(false)
    useEffect(() => {
        // if user is logged in   
        const reference = database.ref(`/online/${userId}`);
        // Set the /users/:userId value to true
        reference
            .set(user.displayName)
            .then(() => console.log('Online presence set', reference.key));
        reference
            .onDisconnect()
            .remove()
            .then(() => console.log('On disconnect function configured.'));

        const referenceAll = database.ref(`/online`);
        referenceAll.on("value", function (snapshot) {
            let onlineUsers = snapshot.val()
            console.log('onlineUsers', onlineUsers)
            setOnline(Object.values(onlineUsers))

        });

        const refUsers = database.ref(`/users/${userId}`);
        refUsers.set(user.displayName)
        const refUsersAll = database.ref(`/users`);
        refUsersAll.on("value", function (snapshot) {
            let allUsers = snapshot.val()
            console.log('allUsers', allUsers)
            setRegUsers(Object.values(allUsers))
        });

        const refStatus = database.ref(`/status/${user.displayName}`);
        refStatus.set('online')
        refStatus
            .onDisconnect()
            .remove()
        document.onvisibilitychange = (e) => {
            if (document.visibilityState === 'hidden') {
                refStatus.set('away')
            }
            else if (user === null) {
                refStatus.set('offline');
            }
            else {
                refStatus.set('online');
            }
        };
        const refStatusAll = database.ref(`/status`);
        refStatusAll.on("value", function (snapshot) {
            let statusUsers = snapshot.val()
            console.log('statusUsers', statusUsers)
            setStatusAllUsers(Object.values(statusUsers))
        });

    }, [user]);

    console.log("online: ", online);
    // User navigates to a new tab, case 3


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


    if (loading1) {
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
                        console.log("imgUrl: ", imgUrl);

                    })
            })
    }

    const sendMessage = async () => {

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

    const handleEmojiShow = () => {
        setShowEmoji((v) => !v)
    }
    const handleEmojiSelect = (e) => {
        setValue((text) => (text += e.native))
    }
    return (
        <Container style={{ height: window.innerHeight - 70 }}>
            <Grid container
                style={{ height: window.innerHeight / 20 }}
                alignItems={'center'}
                justifyContent={'center'}
            >
                <h4>in chat:</h4>
                {regUsers && regUsers.map(regUser =>
                    <div
                        key={regUser}
                        style={{
                            width: 'fit-content',
                        }}
                    >
                        <Grid container>
                            {/* <Avatar src={message.photoURL} /> */}
                            <div
                                style={{
                                    lineHeight: '35px',
                                    marginLeft: 5,
                                    // color: (regUser === user.uid) ? 'blue' : 'grey',
                                    color: (online.includes(regUser)) ? 'blue' : 'grey',
                                }}
                            > {regUser}
                            </div>
                        </Grid>
                    </div>
                )}
            </Grid>
            {/* <div>
                <p>
                    <React.Fragment>
                        <span>
                            List:{' '}
                            {
                                online && online.length > 0 && <span>{online}</span>
                            }
                        </span>
                    </React.Fragment>
                </p>
            </div> */}
            <Grid container
                style={{ height: window.innerHeight - 450 }}
                alignItems={'center'}
                justifyContent={'center'}
            >
                <div style={{ width: '80%', height: '65vh', border: '1px solid grey', overflowY: 'auto' }}>
                    {messages.map((message, i) =>

                        <div
                            key={message.createdAt}
                            style={{
                                width: 'fit-content',
                                marginLeft: user.uid === message.uid ? 'auto' : '10px',
                            }}
                        >
                            {/* {console.log("message: ", message)} */}

                            <Grid container
                                style={{ marginTop: 50, }}
                            >
                                <Avatar src={message.photoURL} />
                                <div
                                    style={{
                                        lineHeight: '35px',
                                        marginLeft: 5,
                                        // color: (userId && message.uid === userId) ? 'blue' : 'grey',
                                        color: (online.includes(message.displayName)) ? 'blue' : 'grey',
                                    }}
                                >{message.displayName}
                                </div>
                                <div>{(online.includes(message.displayName)) ? ' online' : ' offline'}</div>
                            </Grid>
                            <div
                                style={{
                                    margin: 10,
                                    padding: 15,
                                    minWidth: 100,
                                    border: '1px solid transparent',
                                    borderRadius: 100,
                                    backgroundColor: user.uid === message.uid ? 'lightgrey' : 'gray',
                                    width: 'fit-content',
                                }}
                            >{message.text}
                            </div>
                            <div
                                ref={messagesEndRef}
                            // style={{ width: 70, height: 70, backgroundColor: 'grey' }}
                            >
                                {messages[i].url && (
                                    (messages[i].url).includes('jpg') ||
                                    (messages[i].url).includes('jpeg') ||
                                    (messages[i].url).includes('gif') ||
                                    (messages[i].url).includes('png')) ?

                                    <div
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => { handleOpen(messages[i].url) }}>
                                        <FileOpenIcon style={{ position: 'relative', top: 1, right: 3 }} />
                                        <img
                                            style={{ width: 70, height: 70, }}
                                            src={messages[i].url}
                                        >
                                        </img>
                                    </div>
                                    :
                                    //  null
                                    message.url &&
                                    <div
                                    //   onClick={() => download(message.url)}
                                    >
                                        <a href={message.url} download>
                                            <FileDownloadIcon style={{ position: 'relative', top: 7 }} /> {message.fileName}
                                        </a>
                                    </div>

                                }
                            </div>


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
                    style={{ width: '80%', marginTop: 15 }}
                >
                    <TextField
                        fullWidth
                        variant={'outlined'}
                        required
                        label="input message"
                        value={value}
                        placeholder='type message'
                        onChange={e => setValue(e.target.value)}
                        onKeyPress={(ev) => {
                            // console.log(`Pressed keyCode ${ev.key}`);
                            if (value.length && ev.key === 'Enter') {
                                // Do code here
                                ev.preventDefault();
                                sendMessage()
                            }
                        }}
                    />
                    <Grid
                        container
                        direction={'row'}
                        justifyItems={'flex-end'}
                        style={{ width: '80%', marginTop: 15 }}
                    >
                        {showEmoji && <Picker onSelect={handleEmojiSelect} emojiSize={20} />}
                        <Button onClick={handleEmojiShow}>EMO</Button>
                        <input style={{ marginTop: 15 }} type="file" onChange={onChange}></input>
                        {console.log("uploaded", url)}
                        <Button
                            disabled={value.length < 1}
                            onClick={sendMessage}>
                            Send
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    )
}
export default Chat
