import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Context } from '../index'
import { Context2 } from '../App'
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore"
import { Autocomplete, Avatar, Button, Chip, Container, Divider, Grid, ListItemIcon, ListItemText, MenuItem, MenuList, Modal, TextField, Typography, } from '@mui/material';
import Stack from '@mui/material/Stack';
import Loader from './Loader';
import firebase from 'firebase';
import 'firebase/auth';
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
import NavBar from './NavBar';
// import {startPersonalChat} from '../utils/functions'

const Messenger = (props) => {
    // const history = useHistory()
    const { auth, firestore } = useContext(Context)
    const [user] = useAuthState(auth)

    // console.log("user: ", user);

    // const value = useContext(Context2);
    // console.log("value: ", value);

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
    let [allRegUsers, setAllRegUsers] = useState({})

    //if group chat chatId === null added in every group message
    // if personal chat we have friend and chatId !==null

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
            //    const userFiltered= asArray.filter(key => ((key[1].uid)==user.uid))
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

        console.log("allRegUsers: ", allRegUsers);

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
            chatId: chatId, //"создаем значение переменной во время первого создания чата складываем имена"
            page: props.page
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


    console.log("allRegUsers: ", allRegUsers);


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

                        <Stack direction="row" spacing={1} sx={{
                            top: { xs: 229, md: -15 }, left: { xs: 2 },
                            display: 'flex', zIndex: 1, alignContent: 'flex-start', alignItems: 'flex-start', color: 'grey', position: 'relative',
                        }}>
                            <Chip size='small' sx={{ background: 'transparent' }} label={`online`} avatar={<Avatar sx={{ background: '#1693eb' }}>{(Object.values(statusAllUsers).filter(value => value === 'online')).length}</Avatar>} />
                            <Chip size='small' sx={{ background: 'transparent' }} label={`away`} avatar={<Avatar sx={{ background: '#ff6589' }}>{(Object.values(statusAllUsers).filter(value => value === 'away')).length}</Avatar>} />
                            <Chip size='small' sx={{ background: 'transparent' }} label={`offline `} avatar={<Avatar sx={{ background: '#7fa8c5' }}>{regUsers.length - (Object.values(statusAllUsers).filter(value => value === 'online')).length -
                                (Object.values(statusAllUsers).filter(value => value === 'away')).length}</Avatar>} />
                        </Stack>

                        <MenuList style={{ width: '95%' }}>
                            <NavLink to={CHAT_ROUTE}>
                                <MenuItem style={{ background: props.page === 'group' ? '#f8fdf9' : 'none' }}>
                                    <ListItemIcon>
                                        <FaceIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Fire_Chat</ListItemText>
                                </MenuItem>
                            </NavLink>
                            <NavLink to={REGISTERED_CHAT_ROUTE}>
                                <MenuItem style={{ background: props.page === 'registered' ? '#f8fdf9' : 'none' }}>
                                    <ListItemIcon>
                                        <FaceRetouchingNaturalIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Registered</ListItemText>
                                </MenuItem>
                            </NavLink>
                            <NavLink to={INCOGNITO_CHAT_ROUTE}>
                                <MenuItem style={{ background: props.page === 'incognito' ? '#f8fdf9' : 'none' }}>
                                    <ListItemIcon>
                                        <FaceRetouchingOffIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Incognito</ListItemText>
                                </MenuItem>
                            </NavLink>
                            <Divider />
                        </MenuList>
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


                        {/* <div style={{ display: 'none' }}>
                            {userIndex = regUsers && regUsers.findIndex(item => item === user.displayName)}
                            {regUsers && regUsers.splice(userIndex, 1)}
                            {regUsers && regUsers.splice(0, 0, user.displayName)}
                        </div> */}

                        <div style={{ display: 'none' }}>
                            {/* {allRegUsers && Object.entries(allRegUsers) && (userIndex = (Object.entries(allRegUsers)).findIndex(item => (item[1]).uid == user.uid))} */}
                            {/* {console.log("Object.entries(allRegUsers): ",allRegUsers&& Object.entries(allRegUsers))} */}
                            {/* {console.log("userIndex: ", userIndex)} */}


                            {/* {currentUser = (Object.entries(allRegUsers))[userIndex]} */}

                            {/* {Object.entries(allRegUsers) &&  (Object.entries(allRegUsers)).splice(userIndex, 1)} */}

                            {/* {Object.entries(allRegUsers) && (Object.entries(allRegUsers)).splice(0, 0, (Object.entries(allRegUsers))[userIndex])} */}
                        </div>

                        <div
                            style={{ width: 350 }}
                            onClick={startPersonalChat}
                        >
                            {allRegUsers && regUsers.length &&
                                <Autocomplete
                                    open={isUserListOpen}

                                    id="user-select"
                                    sx={{ maxWidth: 350, marginTop: 1, }}
                                    disableCloseOnSelect
                                    options={Object.keys(allRegUsers)}
                                    freeSolo
                                    autoHighlight
                                    getOptionLabel={(regUser) => regUser || ""}
                                    renderOption={(props, regUser) => (

                                        <Button
                                            data-user={regUser}
                                            disabled={allRegUsers[regUser].uid === user.uid}
                                            key={regUser}
                                            style={{
                                                margin: 1,
                                                font: 'inherit',
                                                textTransform: 'none', width: '100%', justifyContent: 'flex-start',
                                                background: (allRegUsers[regUser].uid === user.uid || friend === regUser) ? '#30c9d036' : (
                                                    Object.keys(statusAllUsers).find(key => statusAllUsers[regUser] === 'online') && '#1693ebb5' ||
                                                    Object.keys(statusAllUsers).find(key => statusAllUsers[regUser] === 'away') && '#ff6589a6' ||
                                                    '#7fa8c57a')
                                            }}>

                                            {allRegUsers[regUser].photoURL && <Avatar
                                                onClick={(e) => e.stopPropagation()}
                                                src={(allRegUsers[regUser]).photoURL}

                                            />}

                                            <div
                                                //   onClick={(e) => e.stopPropagation()}
                                                data-user={regUser}
                                                style={{
                                                    lineHeight: '35px',
                                                    marginLeft: 5,
                                                    cursor: 'pointer',
                                                    color:
                                                        // Object.keys(statusAllUsers).find(key => statusAllUsers[regUser] === 'online') && 'blue' ||
                                                        // Object.keys(statusAllUsers).find(key => statusAllUsers[regUser] === 'away') && 'pink' ||
                                                        'grey'
                                                }}
                                            >
                                                {allRegUsers[regUser].uid === user.uid
                                                    ?

                                                    < div
                                                        // onClick={(e) => e.stopPropagation()}
                                                        style={{ cursor: 'default', }}>
                                                        {regUser} <span style={{ fontSize: 12, fontStyle: 'italic', color: '#1693ebb5' }}> - you</span> </div >
                                                    :
                                                    <div style={{ display: 'flex', width: 250, justifyContent: 'space-between' }} data-user={regUser} data-target="button">
                                                        <span data-user={regUser}
                                                        >{regUser}</span>
                                                        <span
                                                            // onClick={(e) => e.stopPropagation()}
                                                            data-user={regUser}
                                                            style={{ fontSize: 10, fontStyle: 'italic', cursor: 'default' }}>

                                                            {
                                                                ((new Date().getHours() - (new Date(allRegUsers[regUser].seen).getHours())) == 0)
                                                                    ?
                                                                    `seen ${(new Date().getMinutes()) - (new Date(allRegUsers[regUser].seen).getMinutes()) < 5 ? 'just now' : 'min ago'} `
                                                                    ||
                                                                    `seen ${1440 > (new Date().getMinutes()) - (new Date(allRegUsers[regUser].seen).getMinutes()) < 2880 ? 'yesterday' : '2 days ago'} `
                                                                    :
                                                                    `seen at: ${new Date(allRegUsers[regUser].seen).getHours()} : ${new Date(allRegUsers[regUser].seen).getMinutes()}`
                                                            }
                                                        </span>
                                                    </div>}
                                                <div
                                                    //  onClick={(e) => e.stopPropagation()}
                                                    data-user={regUser}
                                                >
                                                    {messages && (t = (messages.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : ((b.createdAt > a.createdAt) ? -1 : 0))
                                                        .filter(message => (message.displayName === regUser))).pop()) && t.text}
                                                </div>
                                            </div>

                                        </Button>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            // onClick={} 
                                            {...params}
                                            label={<PersonSearchIcon />}
                                            inputProps={{
                                                ...params.inputProps,

                                            }}
                                        />
                                    )}
                                />}
                        </div>


                    </Grid>

                    <Grid container item xs={12} lg={9}

                        sx={{
                            display: { xs: opened ? 'none' : 'flex', md: 'flex' },
                            //  position:'relative',
                            //  top:500,
                            //  height: window.innerHeight - 300
                        }}
                        alignContent={'flex-start'}
                        alignItems={'center'}
                        justifyContent={'center'}
                    >


                        <Grid item sx={{ height: { xs: '75vh', md: '80vh' }, width: '100%', border: '1px solid lightgrey', overflowY: 'auto', background: '#30c9d036', }}>


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

                                        {!friend && ((props.page === 'group') || (props.page === 'registered') || (props.page === 'incognito'))
                                            &&
                                            ((messages[0].createdAt === messages[i].createdAt)
                                                ||
                                                (message.photoURL !== ((messages[j]).photoURL)))
                                            &&
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
                                                >{message.displayName != null ? message.displayName : `Incognito_${user.uid.slice(0, 3)}`}
                                                </div>
                                                <div style={{ fontSize: 10, fontStyle: 'italic' }}>
                                                    {Object.keys(statusAllUsers).find(key => statusAllUsers[message.displayName] === 'online') && 'online' ||
                                                        Object.keys(statusAllUsers).find(key => statusAllUsers[message.displayName] === 'away') && 'away' ||
                                                        'offline'}
                                                </div>

                                            </Grid>
                                        }

                                        {(messages[i].createdAt !== null) && (messages[j].createdAt !== null) &&
                                            ((messages[0].createdAt === messages[i].createdAt) ||
                                                ((message.createdAt).toDate().getDay()) !== ((messages[j].createdAt).toDate().getDay())) &&
                                            <div style={{
                                                color: 'grey', fontStyle: 'italic', marginTop: 50, position: 'relative', left: user.uid !== message.uid
                                                    ? '75vh' : null, right: user.uid === message.uid ? '75vh' : null
                                            }}>
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
                                                : {(message.createdAt !== null) && ((message.createdAt).toDate().getMinutes() > 9
                                                    ?
                                                    (message.createdAt).toDate().getMinutes()
                                                    :
                                                    '0' + (message.createdAt).toDate().getMinutes())}
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
                                            // console.log(`Pressed keyCode ${e.key}`);
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
