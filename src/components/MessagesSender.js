import { Button, Grid, TextField } from '@mui/material';
import { Picker } from 'emoji-mart';
import React from 'react'
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';

function MessagesSender({ props, user, value, setValue, sendMessage, handleEmojiSelect, handleEmojiShow, onChange, showEmoji, smile, url, fileName}) {

    return (
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
    )
}

export default MessagesSender
