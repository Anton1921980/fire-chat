import React from 'react';
import Carousel from 'react-material-ui-carousel'
import { Paper, Button, Container, Grid } from '@mui/material'

function CarouselEx(props) {
    const items = [
        {
            name: "Fire_Chat",
            description: "Chat with all users, including Registeredd andd Incognito, you can choose any user to chat personally",
            color: "#64ACC8",
            // href: 'https://github.com/'
        },
        {
            name: "Registered",
            description: "Chat with users, who signed in with Google account, feel free to choose any user to chat personally",
            color: "#7D85B1",
            
        },
        {
            name: "Incognito",
            description: "Chat with users who as Incognoto, pick any user to chat personally, but if you want to be privat sign in as Incognoto",
            color: "#CE7E78",
            
        },

    ]

    return (
        <Container style={{ width: '70vh', height:'50vh', marginTop: '25vh'}}>
        <div >
            <Carousel 
            animation={'slide'}
            indicatorIconButtonProps={{
                style: {
                    padding: '5px',   
                    color: '#1976d2'       
                }
            }}
            activeIndicatorIconButtonProps={{
                style: {
                    backgroundColor: 'lightGrey' // 2
                }
            }}
           
            >
                {
                    items.map((item, i) => <Item key={i} item={item} />)
                }
            </Carousel>
         </div>
         </Container>
    )
}

function Item(props) {
    return (
        <Paper style={{ width: '50vh', height:'20vh',boxShadow:'none',marginLeft:50}}>
            <h2>{props.item.name}</h2>
            <p style={{marginTop: '3vh'}}>{props.item.description}</p>
{/* 
            <Button className="CheckButton">
                Check it out!
            </Button> */}
        </Paper>
    )
}

export default CarouselEx