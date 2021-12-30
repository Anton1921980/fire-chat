import React, { useContext, useEffect, useRef, useState } from 'react'
import { Context } from '../index'
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore"
import { Avatar, Button, Container, Grid, TextField } from '@mui/material';
import Loader from './Loader';
import firebase from 'firebase';



function Chat() {

    const { auth, firestore } = useContext(Context)
    const [user] = useAuthState(auth)

    const [value, setValue] = useState('')
    const [messages, loading] = useCollectionData(
        firestore.collection("messages").orderBy('createdAt')
    )
    const [fileName, setFileName] = useState(null)
    const [url, setUrl] = useState(null)

    // const messagesEndRef = React.createRef(null)
    const messagesEndRef = useRef(null)
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
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
                        console.log("uploaded",url)               
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
            fileName:fileName,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        setValue('')    
      
        // await getFile()
    }

    return (
        <Container>
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
                            style={{ width: 70, height: 70, backgroundColor: 'grey' }}>
                             
                                {message.url&&(message.url).includes('.png'||'.jpg')?
                                <img
                                    style={{ width: 70, height: 70 }}
                                    src={message.url}
                                >
                                </img>:null
                                }                              
                             
                            </div>
                            <div><a href='message.url'></a>{message.fileName}</div>
                        </div>
                    )}
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
                    <input type="file" onChange={onChange} />
                    <Button onClick={sendMessage}>Send</Button>
                </Grid>
            </Grid>

        </Container>

    )
}

export default Chat
