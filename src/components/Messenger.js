import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Context } from '../index'
import { Context2 } from '../App'
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore"
import { Autocomplete, Avatar, Button, Chip, Container, Divider, Grid, ListItemIcon, ListItemText, MenuItem, MenuList, Modal, TextField, Typography, } from '@mui/material';
import Stack from '@mui/material/Stack';
import Loader from './Loader';
import firebase from 'firebase';
import 'firebase/auth'
import 'firebase/database';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { Box, display } from '@mui/system';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import smile from '../img/smile.png'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import FaceIcon from '@mui/icons-material/Face';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import FaceRetouchingOffIcon from '@mui/icons-material/FaceRetouchingOff';
import { NavLink, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { CHAT_ROUTE, INCOGNITO_CHAT_ROUTE, REGISTERED_CHAT_ROUTE } from '../utils/consts';

import { createStyles, makeStyles } from '@mui/styles';
import Menulist from './Menu';
import Chips from './Chips';
import Users from './Users';
import messagesContainer from './MessagesContainer';
import MessagesContainer from './MessagesContainer';




const Messenger = (props) => {

    const { auth, firestore } = useContext(Context)
    const [user] = useAuthState(auth)

    const database = firebase.database()

    const [value, setValue] = useState('')
    const [isMobile, setIsMobile] = useState(false)
    const [isUserListOpen, setIsUserListOpen] = useState(true)
    const [friend, setFriend] = useState(null)
    const [regUsers, setRegUsers] = useState([])
    const [statusAllUsers, setStatusAllUsers] = useState([])
    const [showEmoji, setShowEmoji] = useState(false)
    const [chatId, setChatId] = useState(null)
    const [fileName, setFileName] = useState(null)
    const [url, setUrl] = useState(null)
    const [imgUrl, setImgUrl] = useState(null)
    const [open, setOpen] = useState(false);
    const [allRegUsers, setAllRegUsers] = useState({})

    const [messages, loading1] = useCollectionData(

        (friend && chatId) &&
        (
            firestore.collection("messages")
                .where("chatId", "==", chatId)
        )
        ||

        (props.page === 'registered') &&
        (
            firestore.collection("messages")
                .where("chatId", "==", null)
        )
        ||
        (props.page === 'incognito') &&
        (
            firestore.collection("messages")
                .where("chatId", "==", null)
        )
        ||
        ((props.page === 'group')) &&
        (
            firestore.collection("messages")
                .where("chatId", "==", null)
        )
    )

    useEffect(() => {
        window.innerWidth < 500 ? setIsMobile(true) : setIsMobile(false)

        const nullName = `Incognito_${user.uid.slice(0, 3)}`

        const refUsers = database.ref(user.displayName == null ? `/users/${nullName}/displayName` : `/users/${user.displayName}/displayName`);
        refUsers.set(user.displayName == null ? nullName : user.displayName)

        const refUid = database.ref(user.displayName == null ? `/users/${nullName}/uid` : `/users/${user.displayName}/uid`);
        refUid.set(user.uid)

        const refPhoto = database.ref(user.displayName == null ? `/users/${nullName}/photoURL` : `/users/${user.displayName}/photoURL`);
        refPhoto.set(user.photoURL != null ? user.photoURL : 'https://banner2.cleanpng.com/20180505/rse/kisspng-emoji-domain-emojipedia-dark-skin-detective-5aed9ba2ed0164.8229006115255213149708.jpg')

        const refSeen = database.ref(user.displayName == null ? `/users/${nullName}/seen` : `/users/${user.displayName}/seen`);
        refSeen.set(firebase.database.ServerValue.TIMESTAMP)

        const refStatus = database.ref(user.displayName == null ? `/status/${nullName}` : `/status/${user.displayName}`);
        refStatus.set('online')
        refStatus
            .onDisconnect()
            .remove()

        document.onvisibilitychange = (e) => {
            if (document.visibilityState === 'hidden') {
                refStatus.set('away')
                refSeen.set(firebase.database.ServerValue.TIMESTAMP)
            }
            else if (user === null) {
                refStatus.set('offline');
                refSeen.set(firebase.database.ServerValue.TIMESTAMP)
            }
            else {
                refStatus.set('online');
                refSeen.set(firebase.database.ServerValue.TIMESTAMP)
            }
        };

        let allUsers = null

        const refUsersAll = database.ref(`/users`);
        refUsersAll.on("value", function (snapshot) {
            allUsers = snapshot.val()
            return allUsers
        });

        if (allUsers && (props.page === 'registered')) {
            const asArray = Object.entries(allUsers);

            const filtered = asArray.filter(key => (!(key[1].displayName).includes('Inc')));

            const registeredAllUsers = Object.fromEntries(filtered);

            setAllRegUsers(registeredAllUsers)
            setRegUsers(Object.keys(registeredAllUsers))
        }
        else if (allUsers && (props.page === 'incognito')) {
            const asArray = Object.entries(allUsers);

            const filtered = asArray.filter(key => ((key[1].displayName).includes('Inc')));

            let registeredAllUsers = Object.fromEntries(filtered);

            setAllRegUsers(registeredAllUsers)
            setRegUsers(Object.keys(registeredAllUsers))
        }
        else if (allUsers) {
            setAllRegUsers(allUsers)

            setRegUsers(Object.keys(allUsers))
        }

        const refStatusAll = database.ref(`/status`);
        refStatusAll.on("value", function (snapshot) {
            let statusUsers = snapshot.val()
            setStatusAllUsers(statusUsers)
        });

    }, []);

    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const handleClose = () => setOpen(false);

    const handleOpen = (messUrl) => { setImgUrl(messUrl); setOpen(true); }

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

    const backRef = useRef(null)


    function startPersonalChat(e) {
        e.preventDefault(e);
        console.log("e: ", e.target.dataset.user)

        setFriend(e.target.dataset.user)
        setChatId([user.displayName, e.target.dataset.user].sort().join(''))
        backRef.current.style.visibility = 'visible'
    }

    function stopPersonalChat() {
        setFriend(null)
        setChatId(null)
        backRef.current.style.visibility = 'hidden'
    }

    const sendMessage = async () => {

        await firestore.collection('messages').add({
            uid: user.uid,
            displayName: user.displayName ? user.displayName : `Incognito_${user.uid.slice(0, 3)}`,
            photoURL: user.displayName ? user.photoURL : 'https://banner2.cleanpng.com/20180505/rse/kisspng-emoji-domain-emojipedia-dark-skin-detective-5aed9ba2ed0164.8229006115255213149708.jpg',
            text: value,
            url: url,
            fileName: fileName,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            chatId: chatId,
            page: props.page
        })
        setValue('')
        file = null
        setFileName(null)
        setUrl(null)
        setShowEmoji(false)
    }

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


    let j
    let t

    const { opened, setOpened } = useContext(Context2);

    useEffect(() => {
        opened && isMobile && setIsUserListOpen(true)
        !opened && isMobile && setIsUserListOpen(false)
    }, [opened])


    useEffect(() => {

        let users = Object.entries(allRegUsers)
        let userIndex = users && users.findIndex(item => (item[1]).uid == user.uid)

        let currentUser = users && (userIndex >= 0) && (Object.entries(allRegUsers))[userIndex]

        users && (userIndex >= 0) && users.splice(userIndex, 1)

        users && (userIndex >= 0) && users.splice(0, 0, currentUser)

        users && (userIndex >= 0) && (setAllRegUsers(Object.fromEntries(users)))
    }, [regUsers])




    return (
        <>
            <Container
                maxWidth="xl"
                sx={{
                    background: '#5890901f',
                    height: '93vh'
                }}
            >
                <Grid container
                    // columnSpacing={' xs: 2, sm: 2 '}
                    style={{ height: window.innerHeight - 70, }}
                >
                    <Grid container item xs={12} lg={3}
                        sx={{

                            display: { xs: opened ? 'flex' : 'none', md: 'flex' },
                            height: window.innerHeight - 100,
                            // marginTop: 20,
                            position: 'relative',
                            bottom: 20

                        }}
                        alignContent={'flex-start'}
                        // alignItems={'center'}
                        justifyContent={'center'}
                    >
                        <Chips statusAllUsers={statusAllUsers} regUsers={regUsers} />
                        <Menulist props={props} />

                        <div style={{ width: '100%', height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                            <Button
                                size="small"
                                // variant='outlined'
                                style={{ visibility: 'hidden', marginRight: 'auto', marginLeft: 10, textTransform: 'capitalize' }}
                                ref={backRef}
                                onClick={stopPersonalChat}><KeyboardBackspaceIcon />&nbsp;&nbsp; back
                            </Button>
                            {friend && allRegUsers && <div style={{ display: 'flex', marginRight: 15, alignItems: 'center', height: 30 }}><span style={{ fontStyle: 'italic', fontSize: 12, color: 'blue', }}>Chat with:&nbsp;&nbsp; </span>
                                <Avatar sx={{ width: 24, height: 24 }} src={allRegUsers[friend].photoURL} />&nbsp;{friend}</div>}
                        </div>

                        <div
                            style={{ width: 350 }}
                            onClick={startPersonalChat}
                        >
                            <Users isUserListOpen={isUserListOpen} allRegUsers={allRegUsers} user={user} friend={friend} statusAllUsers={statusAllUsers} messages={messages} regUsers={regUsers} t={t} />
                        </div>

                    </Grid>

                    <Grid container item xs={12} lg={9}
                        sx={{
                            display: { xs: opened ? 'none' : 'flex', md: 'flex' },
                        }}
                        alignContent={'flex-start'}
                        alignItems={'center'}
                        justifyContent={'center'}
                    >

                        <Grid item sx={{ height: { xs: '75vh', md: '80vh' }, width: '100%', border: '1px solid lightgrey', overflowY: 'auto', background: '#30c9d036', }}>

                            <MessagesContainer messages={messages} messagesEndRef={messagesEndRef} friend={friend} props={props} statusAllUsers={statusAllUsers} user={user}  imgUrl={imgUrl} j={j} handleOpen={handleOpen} handleClose={handleClose} open={open}/>
{/*  */}
                        </Grid>
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
                                <Grid item xs={12} md={9}>
                                    <TextField
                                        fullWidth
                                        variant={'outlined'}
                                        required
                                        disabled={user.displayName === null && props.page === 'registered'}

                                        label={user.displayName === null && props.page === 'registered' ? 'Login from Google to write  in this chat' : 'input message'}
                                        value={value}
                                        placeholder='type message'
                                        onChange={e => setValue(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (value.length && e.key === 'Enter') {
                                                // Do code here
                                                e.preventDefault();
                                                sendMessage()
                                            }
                                        }}
                                    />
                                </Grid >
                                <Grid container item xs={12} sm={12} md={3} position={'relative'} direction={'row'} sx={{ justifyContent: 'space-around' }}>
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

                                    {url && url.length
                                        ?
                                        <div style={{ position: 'absolute', right: '23%', top: '85%' }}>
                                            <FileUploadIcon style={{ position: 'relative', top: 6, right: 2 }} />{fileName}</div>
                                        :
                                        null}

                                    <Button
                                        variant='outlined'
                                        disabled={value.length < 1}
                                        onClick={sendMessage}>
                                        <SendRoundedIcon fontSize="large" />
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
