import { Autocomplete, Avatar, Button, Hidden, TextField } from '@mui/material'
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import React from 'react'
import CheckerUser from './CheckerUser';

function Users({ isUserListOpen, allRegUsers, user, friend, statusAllUsers, regUsers, messages, unreadMessages, t, ...props }) {
    // console.log("unreadMessages: ", unreadMessages);

    return (
        <>
            {allRegUsers && regUsers.length &&
                <Autocomplete
                    open={isUserListOpen}
                    id="user-select"
                    sx={{ maxWidth: 350, marginTop: 1, overflowX: 'hidden' }}
                    // classes={{ paper: classes.paper }}
                    disableCloseOnSelect
                    options={Object.keys(allRegUsers)}
                    freeSolo
                    autoHighlight
                    getOptionLabel={(regUser) => regUser || ""}
                    renderOption={(props, regUser) => (

                        <Button
                            data-user={regUser}
                            disabled={user.uid && allRegUsers[regUser].uid === user.uid}
                            key={regUser}
                            style={{
                                maxHeight: 70,
                                overflow: 'hidden',
                                margin: 1,
                                font: 'inherit',
                                textTransform: 'none', width: '100%', justifyContent: 'flex-start',
                                background: (allRegUsers[regUser].uid === user.uid || friend === regUser) ? '#30c9d036' : (
                                    Object.keys(statusAllUsers).find(key => statusAllUsers[regUser] === 'online') && '#1693ebb5' ||
                                    Object.keys(statusAllUsers).find(key => statusAllUsers[regUser] === 'away') && '#ff6589a6' ||
                                    '#7fa8c57a')
                            }}>

                            {allRegUsers[regUser].photoURL &&
                                <Avatar
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
                                        'grey'
                                }}
                            >
                                {allRegUsers[regUser].uid === user.uid
                                    ?

                                    < div
                                        // onClick={(e) => e.stopPropagation()}
                                        style={{ cursor: 'default', }}>
                                        {regUser} <span style={{ fontSize: 12, fontStyle: 'italic', color: '#1693ebb5' }}> - you</span>

                                    </div >
                                    :
                                    <div style={{ display: 'flex', width: 250, justifyContent: 'space-between' }} data-user={regUser} data-target="button">
                                        <span data-user={regUser}
                                        >{regUser}</span>

                                        <span
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
                                        {
                                            friend && (allRegUsers[regUser].displayName == friend) && unreadMessages && unreadMessages.length && (unreadMessages[0]).displayName == friend &&

                                            // <Avatar sx={{ bgcolor: 'blue', marginTop:0, left: '92%',width: 25, height: 25 ,fontSize:12,position:'absolute' }}> {unreadMessages.length}</Avatar>
                                            <CheckerUser unreadMessages={unreadMessages} delay={"5000"} />
                                        }
                                    </div>}
                                <div
                                    style={{ overflow: 'hidden' }}
                                    data-user={regUser}
                                >
                                    {messages && (t = (messages.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : ((b.createdAt > a.createdAt) ? -1 : 0))
                                        .filter(message => (message.displayName === regUser))).pop()) &&
                                        //  t&&t.length&&(t.length>30)?                                       
                                        `${t['text'].slice(0, 30)}`
                                        //   :t.text
                                    }
                                </div>
                            </div>

                        </Button>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={<PersonSearchIcon />}
                            inputProps={{
                                ...params.inputProps,

                            }}
                        />
                    )}
                />}

        </>
    )
}

export default Users


