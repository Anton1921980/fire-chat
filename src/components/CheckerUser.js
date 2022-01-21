import React, { useEffect, useState } from 'react'
import { Avatar } from '@mui/material';



function CheckerUser({ delay, unreadMessages, }) {
    // console.log("delay: ", delay);
    // console.log("unreadMessages: ", unreadMessages);

    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setVisible(false);
        }, delay);

        return () => clearTimeout(timeout);

    }, [delay,unreadMessages]);

    return visible ?

        <Avatar sx={{ bgcolor: 'blue', marginTop: 0, left: '92%', width: 25, height: 25, fontSize: 12, position: 'absolute' }}> {unreadMessages.length}</Avatar>
        // <div>222</div>
        :
        <div/>;
};



export default CheckerUser