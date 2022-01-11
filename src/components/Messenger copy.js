import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
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



const Messenger = () => {

    const { auth, firestore } = useContext(Context)
    const [user] = useAuthState(auth)
    const [value, setValue] = useState('')

    const database = firebase.database()

    const userId = user.uid;
    const userName = user.displayName

    console.log("userId: ", userId);

    const [online, setOnline] = useState([])
    const [friend, setFriend] = useState(null)
    const [regUsers, setRegUsers] = useState([])
    const [statusAllUsers, setStatusAllUsers] = useState([])
    const [showEmoji, setShowEmoji] = useState(false)

    console.log("regUsers: ", regUsers);


    const [chatId, setChatId] = useState(null)

    // const [chatUser, setChatUser] = useState(null)

    // useMemo(() => {
    //     setChatId([user.displayName, chatUser].sort().join(''))
    // }, [chatUser]);

    useMemo(() => {

        const refUsers = database.ref(`/users/${user.displayName}/displayName`);
        refUsers.set(user.uid)
        const refPhoto = database.ref(`/users/${user.displayName}/photoURL`);
        refPhoto.set(user.photoURL)
       
        const refStatus = database.ref(`/users/${user.displayName}/status`);
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
        const refStatusAll = database.ref(`/users/${user.displayName}/status`);
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

    }, []);

    // console.log("online: ", online);
    // User navigates to a new tab, case 3


    const [fileName, setFileName] = useState(null)
    const [url, setUrl] = useState(null)
    const [imgUrl, setImgUrl] = useState(null)

    const messagesEndRef = useRef(null)
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }




    const [open, setOpen] = useState(false);

    const handleClose = () => setOpen(false);

    const handleOpen = (messUrl) => {
        setImgUrl(messUrl);
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



    function startPersonalChat(e) {
        e.preventDefault();

        setFriend(e.target.innerText)
        setChatId([user.displayName, e.target.innerText].sort().join(''))

    }


    // АЛЬТЕРНАТИВА useCollectionData
    // let messages = []
    // let loading1
    // useEffect(() => {
    //     firestore.collection("messages")
    //     .where("chatId", "==", chatId)
    //     .get()
    //     .then((querySnapshot) => {
    //         console.log("querySnapshot: ", querySnapshot && querySnapshot.docs);        

    //         querySnapshot && (querySnapshot.docs).map(doc=>{
    //             messages.push(doc.data())
    //         })
    //         console.log("messages: ", messages);
    //     });
    // }, [chatId]);

    //перерендерится вся страница  useCollectionData ИЗЗА ЛОАДЕРА !!!
    const [messages, loading1] = useCollectionData(
        firestore.collection("messages")
            .where("chatId", "==", chatId)
        // .orderBy("createdAt", "asc") не работает, будем фильтровать на клиенте      
    )


    const sendMessage = async () => {

        await firestore.collection('messages').add({
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
            text: value,
            url: url,
            fileName: fileName,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            chatId: chatId, //"создаем значение переменной во время первого создания чата складываем имена"
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

    // //ПЕРЕРЕНДЕ ВСЕГО БЫЛ ИЗЗА ЭТОГО ЛОАДЕРА!!!
    // if (loading1) {
    //     return <Loader />
    // }

    let j

    return (
        <>
            <Container
                maxWidth="xl"
            // style={{ background: 'lightgrey' , height: '90vh'}}
            >
                <Grid container
                    columnSpacing={' xs: 2, sm: 2 '}
                //  style={{ height: window.innerHeight - 70, }}
                >
                    <Grid container item xs={2}
                        style={{ height: window.innerHeight / 20, marginTop: 20, }}
                        alignItems={'center'}
                        justifyContent={'center'}
                    >
                        {/* <div><h4>in chat:</h4></div> */}
                        <Stack direction="row" spacing={2}>
                            <div style={{ color: 'grey' }}>offline: {regUsers.length - (Object.values(statusAllUsers).filter(value => value === 'online')).length - (Object.values(statusAllUsers).filter(value => value === 'away')).length}</div>
                            <div style={{ color: 'blue' }}>online: {(Object.values(statusAllUsers).filter(value => value === 'online')).length}</div>
                            <div style={{ color: 'pink' }}>away: {(Object.values(statusAllUsers).filter(value => value === 'away')).length}</div>

                        </Stack>
                        <Stack mt={2}
                            onClick={startPersonalChat}
                        >
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
                                            // onClick={() => openPersonalChat(regUser)}
                                            // onClick={() => setChatUser(regUser)}
                                            style={{
                                                lineHeight: '35px',
                                                marginLeft: 5,
                                                cursor: 'pointer',
                                                color:
                                                    Object.keys(statusAllUsers).find(key => statusAllUsers[regUser] === 'online') && 'blue' ||
                                                    Object.keys(statusAllUsers).find(key => statusAllUsers[regUser] === 'away') && 'pink' ||
                                                    'grey'
                                            }}
                                        >
                                            {regUser === userName ? <div onClick={(e) => e.stopPropagation()} style={{ cursor: 'default' }}> {regUser} <span style={{ fontSize: 10, fontStyle: 'italic' }}> - you</span> </div> : <div> {regUser}  </div>}
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

                        {friend && <div style={{ width: '100%', height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {/* {friend  && messages && messages.length > 0  ? //если он еще не писал личные сообщ то не и аватарки можно в редакс сохранять конечно 
                            <Avatar src={(messages.find(message => message.displayName === friend)).photoURL} />
                            :null} */}
                            <div><span style={{ fontStyle: 'italic', fontSize: 12, color: 'blue' }}>chatting with:&nbsp; </span>{friend}</div>
                        </div>}

                        <div style={{ width: '100%', height: '70vh', border: '1px solid lightgrey', overflowY: 'auto', background: '#6ef9b236' }}>

                            {messages && messages.length > 0 && messages
                                .sort((a, b) => (a.createdAt > b.createdAt) ? 1 : ((b.createdAt > a.createdAt) ? -1 : 0))
                                .map((message, i) =>
                                    <div
                                        ref={messagesEndRef}
                                        key={i}
                                        style={{
                                            width: 'fit-content',
                                            marginLeft: user.uid === message.uid ? 'auto' : '10px',
                                        }}
                                    >
                                        <div style={{ display: 'none' }}>{i >= 1 ? j = i - 1 : j = 0}</div>
                                        {(messages[i].createdAt !== null) &&
                                            ((messages[0].createdAt === messages[i].createdAt) || ((message.createdAt).toDate().getDay()) !== ((messages[j].createdAt).toDate().getDay())) &&
                                            <div style={{ color: 'grey', fontStyle: 'italic', marginTop: 50, position: 'relative', left: user.uid !== message.uid ? '75vh' : null, right: user.uid === message.uid ? '75vh' : null }}>
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
                                                backgroundColor: user.uid === message.uid ? 'lightgrey' : 'white',
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
                                                // Do code here
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
        </>

    )


}

export default Messenger
