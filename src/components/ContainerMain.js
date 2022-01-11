import React, { useContext, useState } from 'react'
import { Container, Grid, TextField ,Button} from '@mui/material';
import Messenger from './Messenger';
import { Picker } from 'emoji-mart'
import smile from '../img/smile.png'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/database';
import { useAuthState } from "react-firebase-hooks/auth";
import { Context } from '../index'

const ContainerMain = () => {
    
    const { auth, firestore } = useContext(Context)
    const [user] = useAuthState(auth)

    const [value, setValue] = useState('')
    const [showEmoji, setShowEmoji] = useState(false)
    const [url, setUrl] = useState(null)
    const [fileName, setFileName] = useState(null)


    const sendMessage = async () => {
       
        await firestore.collection('messages').add({
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
            text: value,
            url: url,
            fileName: fileName,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            // chatId: chatId, //"создаем значение переменной во время первого создания чата складываем имена"
        })
        setValue('')
        file = null
        setFileName(null)
        setUrl(null)
        setShowEmoji(false)
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

    const handleEmojiShow = () => {
        setShowEmoji((v) => !v)
    }

    const handleEmojiSelect = (e) => {
        setValue((text) => (text += e.native))
    }
    return (
        <Container
            maxWidth="xl"
            style={{ background: 'lightgrey' , height: '90vh'}}
        >
              <Grid container
                columnSpacing={' xs: 2, sm: 2 '}
            //  style={{ height: window.innerHeight - 70, }}
            >
            <Messenger />
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
        </Container>
    )
}

export default ContainerMain
