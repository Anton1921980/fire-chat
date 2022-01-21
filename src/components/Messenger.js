import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Context } from '../index'
import { Context2 } from '../App'
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore"
import { Avatar, Button, Container, Grid, } from '@mui/material';
import Loader from './Loader';
import firebase from 'firebase';
import 'firebase/auth'
import 'firebase/database';
import 'emoji-mart/css/emoji-mart.css'
import smile from '../img/smile.png'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Menulist from './Menu';
import Chips from './Chips';
import Users from './Users';
import MessagesContainer from './MessagesContainer';
import MessagesSender from './MessagesSender';


const Messenger = (props) => {


    const { auth, firestore } = useContext(Context)
    const [user] = useAuthState(auth)
    const database = firebase.database()

    const { opened, setOpened } = useContext(Context2);

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
    let [allUsers, setAllUsers] = useState({})
    const [allRegUsers, setAllRegUsers] = useState({})
    const [unreadMessages, setUnreadMessages] = useState([])
    const [removeUnread, setRemoveUnread] = useState(false)

    const backRef = useRef(null)
    const messagesEndRef = useRef(null)

    let file
    let j
    let t


    const [messagesAll, loading] = useCollectionData(

        (friend && chatId) &&
        (
            firestore.collection("messages")
                .where("chatId", "==", chatId)
        )
        ||

        (props.page === 'registered') && (!friend) &&
        (
            firestore.collection("messages")
                .where("page", "==", "registered")
        )
        ||
        (props.page === 'incognito') && (!friend) &&
        (
            firestore.collection("messages")
                .where("page", "==", 'incognito')
        )
        ||
        ((props.page === 'group')) && (!friend) &&
        (
            firestore.collection("messages")
                .where("page", "==", "group")
        )
    )
    //     let messages
    //     // (messagesAll && messagesAll.length > 0 && !friend) ? messages = messagesAll.filter(message => message.chatId == null) : messages = messagesAll

    //   if  (messagesAll && messagesAll.length > 0 && !friend) {
    //     messages = messagesAll.filter(message => message.chatId == null)  
    //   }
    //   else{
    //     messages = messagesAll

    //   }




    useEffect(() => {
        opened && isMobile && setIsUserListOpen(true)
        !opened && isMobile && setIsUserListOpen(false)
    }, [opened])

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

        const refUsersAll = database.ref(`/users`);
        refUsersAll.on("value", function (snapshot) {
            setAllUsers(snapshot.val())
        });

    }, []);


    useMemo(() => {
        let users
        let userIndex
        let currentUser

        if (friend && allUsers) {

            // console.log("allUsers: ", allUsers);
            // console.log("friend: ", friend);

            users = allUsers && Object.entries(allUsers)
            userIndex = users && users.findIndex(item => (

                ((item[1]).displayName == friend)))

            currentUser = users && (userIndex >= 0) && (Object.entries(allUsers))[userIndex]

            users && (userIndex >= 0) && users.splice(userIndex, 1)

            users && (userIndex >= 0) && users.splice(0, 0, currentUser)

            allUsers = (users && ((userIndex >= 0)) && (Object.fromEntries(users)))
            // console.log("allUsers: ", allUsers);
        }


        if (allUsers) {

            // console.log("allUsers: ", allUsers);
            // console.log("friend: ", friend);

            users = allUsers && Object.entries(allUsers)
            userIndex = users && users.findIndex(item => (item[1]).uid == user.uid)

            currentUser = users && (userIndex >= 0) && (Object.entries(allUsers))[userIndex]

            users && (userIndex >= 0) && users.splice(userIndex, 1)

            users && (userIndex >= 0) && users.splice(0, 0, currentUser)

            allUsers = users && (userIndex >= 0) && Object.fromEntries(users)
        }

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

    }, [allUsers, friend])




    let messages
    // (messagesAll && messagesAll.length > 0 && !friend) ? messages = messagesAll.filter(message => message.chatId == null) : messages = messagesAll

    if (messagesAll && messagesAll.length > 0 && !friend) {
        messages = messagesAll.filter(message => message.chatId == null)
    }
    else {
        messages = messagesAll


    }

    // const [unread, setUnread]= useState(false)

    //получил сообщения которые френд не увидел, как чтобы ему они отобразились отправить их в базу отдельным массивом 
    // если у него поменялся статус на онлайн отправить их первыми и профильтровать массив сообщ выделить

    // const [unread, setUnread] = useState(false)
    //отправить в самом сообщении поле unread setUnread true/false которое буде меняться от времени когда он зашел в наш чат!?


    //  во время отправки сообщения если френд не онлайн цепляю анрид 
    //он заходит видит юзеров там мигатет есть анрид и количестввоS
    //вібирает френда  и чатид надо убрать анрид
    useEffect(() => {
        const asArray = Object.entries(allUsers);

        const filtered = asArray.filter(key => (key[1].displayName) == friend);

        const friendObj = friend && (Object.fromEntries(filtered))[friend]
        // console.log("friendObj: ", friendObj);

        const friendSeen = friend && friendObj['seen']
        // console.log("friendSeen: ", new Date(friendSeen));




        

let allUnseenMessages
(messages) && (
    allUnseenMessages = messages && messages.filter(message => (message.chatFriend==user.displayName)))
    
    // allUnseenMessages && allUnseenMessages.map(message=>()=>{

    // })
  
function getCountsSorted(arr) {
    var counts = new Map();

    for (var i in arr) {
        if (counts.has(arr[i])) {
            counts.set(arr[i], counts.get(arr[i]) + 1);
        } else {
            counts.set(arr[i], 1);
        }
    }

    return Array.from(counts).sort(function(a, b) {
        return a[1] < b[1];
    }).map(function(entry) {
        var ret = {};
        ret[entry[0]] = entry[1];
        return ret;
    });
}



console.log(getCountsSorted(allUnseenMessages));


        
        let filteredMessages        

        (friend && messages) && (
            filteredMessages = messages && messages.filter(message => (((message.createdAt) && (message.createdAt).toDate())) > new Date(friendSeen)))
        //тут должен быть время юзер ласт сиин то есть время когда я біл перед єтим оно перезаписалось когда я сам вошел

        setUnreadMessages(filteredMessages)
        filteredMessages && filteredMessages.length && (filteredMessages.map(message => {

            message['unread'] = true
            // console.log("message: ", message);

            firestore
                .collection("messages")
                .where('createdAt', '>', `${new Date(friendSeen)}`)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        console.log(doc.id, " => ", doc.data());
                        firestore
                            .collection("messages")
                            .doc(doc.id)
                            .update({ unread: "true" });
                    });
                })
        }
        )
        )
        // console.log("setUnread: ", unread);

        // console.log("filteredMessages: ", filteredMessages);

    }, [messages, friend]);

    //работает теперь надо чтобі когда френд откріл чат убрать єтот unread у него и у меня то есть через базу реалтайм, например он нажал на френда и через 5 сек






    const sendMessage = async () => {

        await firestore.collection('messages').add({
            uid: user.uid,
            displayName: user.displayName ? user.displayName : `Incognito_${user.uid.slice(0, 3)}`,
            photoURL: user.displayName ? user.photoURL : 'https://banner2.cleanpng.com/20180505/rse/kisspng-emoji-domain-emojipedia-dark-skin-detective-5aed9ba2ed0164.8229006115255213149708.jpg',
            text: value,
            url: url,
            fileName: fileName,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            unread: false,
            chatId: chatId,
            chatFriend: friend,
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

    function startPersonalChat(e) {
        e.preventDefault(e);

        setFriend(e.target.dataset.user)
        setChatId([user.displayName, e.target.dataset.user].sort().join(''))
        backRef.current.style.visibility = 'visible'
    }

    function stopPersonalChat() {
        setFriend(null)
        setChatId(null)
        backRef.current.style.visibility = 'hidden'
    }
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const handleClose = () => setOpen(false);

    const handleOpen = (messUrl) => { setImgUrl(messUrl); setOpen(true); }


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
                    })
            })
    }


   
    useEffect(() => {
        scrollToBottom()
    
    }, [messages, unreadMessages]);

    // useEffect(() => {

    //     const timeout = setTimeout(() => {
    //         setRemoveUnread(true)
    //     }, 5000);
    //     return () => clearTimeout(timeout);

    // }, [x]);


    return (

        <Container
            maxWidth="xl"
            sx={{
                background: '#5890901f',
                height: '93vh',
                overflow: 'hidden'
            }}
        >
            <Grid container
                style={{ height: window.innerHeight - 70, }}
            >
                <Grid container item xs={12} lg={3}
                    sx={{
                        display: { xs: opened ? 'flex' : 'none', md: 'flex' },
                        height: window.innerHeight - 100,
                        position: 'relative',
                        bottom: 20
                    }}
                    alignContent={'flex-start'}
                    justifyContent={'center'}
                >
                    <Chips statusAllUsers={statusAllUsers} regUsers={regUsers} />
                    <Menulist props={props} />

                    <div style={{ width: '100%', height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                        <Button
                            size="small"
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
                        <Users removeUnread={removeUnread} unreadMessages={unreadMessages} isUserListOpen={isUserListOpen} allRegUsers={allRegUsers} user={user} friend={friend} statusAllUsers={statusAllUsers} messages={messages} regUsers={regUsers} t={t} />
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

                        <MessagesContainer
                            removeUnread={removeUnread} delay="10000"
                            messages={messages} messagesEndRef={messagesEndRef} friend={friend} props={props} statusAllUsers={statusAllUsers}
                            user={user} imgUrl={imgUrl} j={j} handleOpen={handleOpen} handleClose={handleClose} open={open}
                        />
                    </Grid>
                    <Grid
                        container
                        direction={'row'}
                        style={{ width: '100%', marginTop: 15 }}
                    >
                        <MessagesSender props={props} user={user} value={value} setValue={setValue} handleEmojiSelect={handleEmojiSelect} handleEmojiShow={handleEmojiShow}
                            onChange={onChange} sendMessage={sendMessage} showEmoji={showEmoji} smile={smile} url={url} fileName={fileName}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Container>

    )
}

export default Messenger
