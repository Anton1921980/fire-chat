import { Avatar, Box, Grid, Modal } from '@mui/material'
import React from 'react'
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileOpenIcon from '@mui/icons-material/FileOpen';


function MessagesContainer({ messages, messagesEndRef, friend, props, statusAllUsers, user, imgUrl,j,handleOpen,handleClose,open }) {



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
    return (
        

            <Grid item sx={{ height: { xs: '75vh', md: '80vh' }, width: '100%', border: '1px solid lightgrey', background: '#30c9d036', }}>

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
    
    )
}

export default MessagesContainer
