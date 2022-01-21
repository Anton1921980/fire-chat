import React, { useEffect, useState } from 'react'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';

function Checker({ delay,  user, message }) {

    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setVisible(false);
          }, delay);
      
         return () => clearTimeout(timeout);   


      
    }, [delay]);

    return visible ? <div>
        <div
            sx={{
                position: 'absolute',
                width: 100,
                height: 50,
                backgroundColor: user.uid === message.uid ? 'green' : 'red',
                bottom: '90%',
                color: 'grey',

            }}
        >
            <CheckOutlinedIcon sx={{ color: user.uid === message.uid ? 'green' : 'blue', }} />
            <CheckOutlinedIcon sx={{ color: user.uid === message.uid ? 'green' : 'blue', position: 'relative', right: 10 }} />
        </div>
    </div> :
        <div />;
};



export default Checker
