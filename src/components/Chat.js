import React, { useContext, useState } from 'react'
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

    const sendMessage = async () => {
        // console.log(value)
        firestore.collection('messages').add({
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
            text: value,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        setValue('')
    }

    if (loading) {
        return <Loader />
    }
    var metadata = {
        contentType: 'image/jpeg'
      };
      
      // Upload file and metadata to the object 'images/mountains.jpg'
      var uploadTask = storageRef.child('images/' + file.name).put(file, metadata);
      
      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running');
              break;
          }
        }, 
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              // User canceled the upload
              break;
      
            // ...
      
            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        }, 
        () => {
          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log('File available at', downloadURL);
          });
        }
      );
      
    return (
        <Container>
            <Grid container
                style={{ height: window.innerHeight - 50 }}
                alignItems={'center'}
                justifyContent={'center'}
            >
                <div style={{ width: '80%', height: '70vh', border: '1px solid grey', overflowY: 'auto' }}>
                    {messages.map(message =>
                        <div
                            key={message.createdAt}
                            style={{
                                width:'fit-content',
                                marginLeft: user.uid === message.uid ? 'auto' : '10px',                              
                            }}

                        >
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
                                    // border: user.uid === message.uid ? '2px solid blue' : '2px solid red',
                                    // borderRadius: 60, 
                                    border:'1px solid transparent',
                                    borderRadius: 100,
                                    padding: 25,
                                    backgroundColor: user.uid === message.uid ? 'lightgrey' : 'gray',                             
                                    width: 'fit-content',
                                }}
                            >{message.text}
                            </div>

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
                        onChange={e => setValue(e.target.value)}
                    />
                    <Button onClick={sendMessage}>Send</Button>
                </Grid>
            </Grid>

        </Container>

    )
}

export default Chat
