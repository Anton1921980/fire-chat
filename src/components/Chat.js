import React, { useContext, useEffect, useRef, useState } from 'react'
import { Context } from '../index'
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore"
import { Avatar, Button, Container, Grid, Modal, TextField, } from '@mui/material';
import Stack from '@mui/material/Stack';
import Loader from './Loader';
import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/database';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { Box } from '@mui/system';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import smile from '../img/smile.png'


function Chat() {

    const { auth, firestore } = useContext(Context)
    const [user] = useAuthState(auth)
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
    const [showEmoji, setShowEmoji] = useState(false)

    console.log("regUsers: ", regUsers);

    useEffect(() => {
        // // if user is logged in   
        // // const reference = database.ref(`/online/${userId}`);
        // // // Set the /users/:userId value to true
        // // reference
        // //     .set(user.displayName)
        // //     .then(() => console.log('Online presence set', reference.key));
        // // reference
        // //     .onDisconnect()
        // //     .remove()
        // //     .then(() => console.log('On disconnect function configured.'));

        // // const referenceAll = database.ref(`/online`);
        // // referenceAll.on("value", function (snapshot) {
        // //     let onlineUsers = snapshot.val()
        // //     console.log('onlineUsers', onlineUsers)
        // //     setOnline(Object.values(onlineUsers))

        // // });
        // const refUsers = database.ref(`/users/${userId}/displayName`);
        // refUsers.set(user.displayName)
        // const refPhoto = database.ref(`/users/${userId}/photoURL`);
        // refPhoto.set(user.photoURL)
       
        // const refUsersAll = database.ref(`/users`);
        // refUsersAll.on("value", function (snapshot) {
        //     let allUsers = snapshot.val()
        //     console.log('allUsers', allUsers)
        //     setRegUsers(Object.keys(allUsers))
        // });
        // // const refUsers = database.ref(`/users/${userId}`);
        // // refUsers.set(user.displayName)
        // // const refUsersAll = database.ref(`/users`);
        // // refUsersAll.on("value", function (snapshot) {
        // //     let allUsers = snapshot.val()
        // //     console.log('allUsers', allUsers)
        // //     setRegUsers(Object.values(allUsers))
        // // });

        // const refStatus = database.ref(`/status/${user.displayName}`);
        // refStatus.set('online')
        // refStatus
        //     .onDisconnect()
        //     .remove()
        // document.onvisibilitychange = (e) => {
        //     if (document.visibilityState === 'hidden') {
        //         refStatus.set('away')
        //     }
        //     else if (user === null) {
        //         refStatus.set('offline');
        //     }
        //     else {
        //         refStatus.set('online');
        //     }
        // };
        // const refStatusAll = database.ref(`/status`);
        // refStatusAll.on("value", function (snapshot) {
        //     let statusUsers = snapshot.val()
        //     console.log('statusUsers', statusUsers)
        //     setStatusAllUsers(statusUsers)
        // });
        const refUsers = database.ref(`/users/${user.displayName}/displayName`);
        refUsers.set(user.displayName)
        const refUid = database.ref(`/users/${user.displayName}/uid`);
        refUid.set(user.uid)
        const refPhoto = database.ref(`/users/${user.displayName}/photoURL`);
        refPhoto.set(user.photoURL)
       
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
            setStatusAllUsers(statusUsers)
        });

        const refUsersAll = database.ref(`/users`);
        refUsersAll.on("value", function (snapshot) {
            let allUsers = snapshot.val()
            console.log('allUsers', allUsers)
            setRegUsers(Object.keys(allUsers))
        });

    }, []);

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




    let file
    const onChange = (e) => {
        file = e.target.files[0];
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
        file = null
        setFileName(null)
        setUrl(null)
        setShowEmoji(false)
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

    useEffect(() => {
        scrollToBottom()
    }, [messages]);

    if (loading1) {
        return <Loader />
    }
    let j

    return (
        <Container maxWidth="xl"
        //  style={{ height: window.innerHeight - 70, }}
        >
            <Grid container
                columnSpacing={' xs: 2, sm: 2 '}
            //  style={{ height: window.innerHeight - 70, }}
            >
                <Grid container item xs={2}
                    style={{ height: window.innerHeight / 20, marginTop: 20 }}
                    alignItems={'center'}
                    justifyContent={'center'}
                >
                    {/* <div><h4>in chat:</h4></div> */}
                    <Stack direction="row" spacing={2}>
                        <div>users: {regUsers.length}</div>
                        <div style={{ color: 'blue' }}>online: {(Object.values(statusAllUsers).filter(value => value === 'online')).length}</div>
                        <div style={{ color: 'pink' }}>away: {(Object.values(statusAllUsers).filter(value => value === 'away')).length}</div>

                    </Stack>
                    <Stack mt={2}>
                        {regUsers && regUsers.map(regUser =>
                            <div
                                key={regUser}
                                style={{
                                    width: 'fit-content',
                                }}
                            >
                                <div>
                                    {/* <Avatar src={regUser===messages} /> */}
                                    <div
                                        style={{
                                            lineHeight: '35px',
                                            marginLeft: 5,
                                            color:
                                                Object.keys(statusAllUsers).find(key => statusAllUsers[regUser] === 'online') && 'blue' ||
                                                Object.keys(statusAllUsers).find(key => statusAllUsers[regUser] === 'away') && 'pink' ||
                                                'grey'
                                        }}
                                    > {regUser}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Stack>
                </Grid>

                <Grid container item xs={10}
                    // style={{ height: window.innerHeight - 300 }}
                    alignItems={'center'}
                    justifyContent={'center'}
                >
                   

                    <div style={{ width: '100%', height: '70vh', border: '1px solid lightgrey', overflowY: 'auto', background: '#6ef9b236' }}>
                        {messages.map((message, i) =>
                            <div
                                ref={messagesEndRef}
                                key={i}
                                style={{
                                    width: 'fit-content',
                                    marginLeft: user.uid === message.uid ? 'auto' : '10px',
                                }}
                            >
                                <div style={{ display: 'none' }}>{i >= 1 ? j = i - 1 : j = 0}</div>
                                {
                                    ((messages[0].createdAt === messages[i].createdAt) || (message.photoURL !== ((messages[j]).photoURL))) &&
                                    <Grid container
                                        style={{
                                            marginTop: 50,
                                            //  color: (online.includes(message.displayName)) ? 'blue' : 'grey', 
                                            color:
                                                Object.keys(statusAllUsers).find(key => statusAllUsers[message.displayName] === 'online') && 'blue' ||
                                                Object.keys(statusAllUsers).find(key => statusAllUsers[message.displayName] === 'away') && 'pink' ||
                                                'grey'
                                        }}
                                    >
                                        <Avatar src={message.photoURL} />
                                        <div
                                            style={{
                                                lineHeight: '35px',
                                                marginLeft: 5,
                                            }}
                                        >{message.displayName ? message.displayName : 'Incognito'}
                                        </div>
                                        <div style={{ fontSize: 10, fontStyle: 'italic' }}>
                                            {/* {(online.includes(message.displayName)) ? ' online ' : ' offline'} */}
                                            {Object.keys(statusAllUsers).find(key => statusAllUsers[message.displayName] === 'online') && 'online' ||
                                                Object.keys(statusAllUsers).find(key => statusAllUsers[message.displayName] === 'away') && 'away' ||
                                                'offline'}
                                        </div>

                                    </Grid>
                                }                               
                                {(messages[i].createdAt !== null) &&
                                    ((messages[0].createdAt === messages[i].createdAt) || ((message.createdAt).toDate().getDay()) !== ((messages[j].createdAt).toDate().getDay())) &&
                                    <div style={{ color: 'grey', fontStyle: 'italic', marginTop: 0, position: 'relative', left: user.uid !== message.uid ? '75vh' : null, right: user.uid === message.uid ? '75vh' : null }}>
                                        {((message.createdAt).toDate().toJSON().slice(0, 10).split('-').reverse().join('.'))}
                                    </div>
                                }
                                <div
                                    style={{
                                        position: 'relative',
                                        margin: 10,
                                        padding: 15,
                                        minWidth: 100,
                                        border: '1px solid transparent',
                                        borderRadius: 100,
                                        backgroundColor: user.uid === message.uid ? 'lightgrey' : 'gray',
                                        width: 'fit-content',
                                    }}
                                >{message.text}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 38,
                                            right: 16,
                                            fontSize: 10,
                                            fontStyle: 'italic',
                                            color: 'darkgrey'
                                        }}
                                    >
                                        {(message.createdAt !== null) && ((message.createdAt).toDate().getHours())}
                                        : {(message.createdAt !== null) && ((message.createdAt).toDate().getMinutes() > 9 ?
                                            (message.createdAt).toDate().getMinutes() : '0' + (message.createdAt).toDate().getMinutes())}
                                    </div>
                                </div>

                                <div>
                                    {messages[i].url && (
                                        (messages[i].url).includes('.jpg') ||
                                        (messages[i].url).includes('.jpeg') ||
                                        (messages[i].url).includes('.gif') ||
                                        (messages[i].url).includes('.png')
                                    )
                                        ?
                                        <>
                                            <div
                                                style={{ cursor: 'pointer', }}
                                                onClick={() => { handleOpen(messages[i].url) }}>
                                                <FileOpenIcon style={{ position: 'relative', top: 1, right: 3 }} />
                                                <img
                                                    style={{ width: 70, height: 70, }}
                                                    src={messages[i].url}
                                                >
                                                </img>
                                            </div>
                                            <div style={{ fontSize: 12 }}>{message.fileName}</div>
                                        </>
                                        :
                                        //  null
                                        message.url &&
                                        <div
                                            style={{ fontSize: 12 }}
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
                            <Box sx={style}><img src={imgUrl} style={{ width: '100%', height: '100%' }} /></Box>
                        </Modal>
                    </div>
                    <Grid
                        container
                        direction={'row'}
                        style={{ width: '100%', marginTop: 15 }}
                    >
                        <Grid
                            container
                            columnSpacing={' xs: 2, sm: 2 '}
                            direction={'row'}
                            position={'relative'}
                        >
                            <Grid item xs={12} md={10}>
                                <TextField
                                    fullWidth
                                    variant={'outlined'}
                                    required
                                    label="input message"
                                    value={value}
                                    placeholder='type message'
                                    onChange={e => setValue(e.target.value)}
                                    onKeyPress={(e) => {
                                        // console.log(`Pressed keyCode ${e.key}`);
                                        if (value.length && e.key === 'Enter') {                                            
                                            e.preventDefault();
                                            sendMessage()
                                        }
                                    }}
                                />
                            </Grid >
                            <Grid container item xs={12} sm={12} md={2} position={'relative'} direction={'row'} sx={{ justifyContent: 'space-between' }}>
                                {showEmoji &&
                                    <Picker
                                        onSelect={handleEmojiSelect}
                                        emojiSize={25}
                                        title={'fire_chat Emoji'}
                                        theme={'light'}
                                        showPreview={false}
                                        showSkinTones={false}
                                        set={'twitter'}
                                        style={{ position: 'absolute', bottom: '10vh', right: '0vh', }}
                                    />}
                                <Button
                                    style={{ background: `url(${smile}) no-repeat  center/50%` }}
                                    onClick={handleEmojiShow}>
                                </Button>
                                <div><input style={{ marginTop: 15 }} type="file" onChange={onChange} className="custom-file-input"></input></div>
                                {console.log("uploaded", url)}

                                {url && url.length ?
                                    <div style={{ position: 'absolute', right: '23%', top: '85%' }}>
                                        <FileUploadIcon style={{ position: 'relative', top: 6, right: 2 }} />{fileName}</div> :
                                    null}
                                <Button
                                    variant='outlined'
                                    disabled={value.length < 1}
                                    onClick={sendMessage}>
                                    Send
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    )
}
export default Chat
