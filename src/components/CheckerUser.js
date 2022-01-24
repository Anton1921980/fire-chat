import React, { useEffect, useState } from 'react'
import { Avatar } from '@mui/material';



function CheckerUser({ delay, unreadMessages, unreadMessagesGroup, read }) {
   

    const [visible, setVisible] = useState(true);

    const unreadNumber =  (typeof (unreadMessagesGroup) === 'object') && Object.values(unreadMessagesGroup)[0]

    useEffect(() => {
        const timeout = setTimeout(() => {
            setVisible(false);
        }, delay);

        return () => clearTimeout(timeout);

    }, [delay, unreadMessages, unreadMessagesGroup])

    return visible && (unreadNumber&&!read || (unreadMessages && unreadMessages.length)) ?

        <Avatar sx={{ bgcolor: 'blue', marginTop: 0, left: '92%', width: 25, height: 25, fontSize: 12, position: 'absolute' }}> {unreadMessages && unreadMessages.length}{unreadNumber}</Avatar>
        :
        <div />
}



export default CheckerUser