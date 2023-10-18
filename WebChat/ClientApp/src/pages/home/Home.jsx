import * as React from 'react';
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import {useNavigate, useParams} from "react-router-dom";
import Chat from "../../components/chat/Chat";
import {useEffect, useState} from "react";
import {apiEndpoint} from "../../api";
import AddContact from "../../components/addContact/AddContact";
import NewGroup from "../../components/newGroup/NewGroup";

const Home = () => {
    const [user, setUser] = useState({});
    const [addContact, setContact] = useState(false);
    const [addGroup, setGroup] = useState(false);
    const {param} = useParams();

    useEffect(() => {
        apiEndpoint('account/me').fetch().then(res => setUser(res.data));
    }, [])

    return (
        <>
            <Grid container spacing={2} sx={{height: '93vh', minHeight: '400px', overflow: 'hidden'}}>
                <Grid item sm={3} sx={{border: '2px solid #f3f3f3'}}>
                    <Typography variant={'h5'} align={'center'} pb={2}
                                component={'div'}>
                        All Chats
                    </Typography>
                    <ButtonGroup variant="outlined" color={'success'} fullWidth>
                        <Button onClick={() => setContact(true)}>Add Contact</Button>
                        <Button onClick={() => setGroup(true)}>New Group</Button>
                    </ButtonGroup>
                    <ChatWrap chats={user.chats} param={param}/>
                    <AddContact open={addContact} setOpen={setContact}/>
                    <NewGroup open={addGroup} setOpen={setGroup}/>
                </Grid>
                <Grid item sm={9} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    {param ?
                        <Chat chatId={param}/> :
                        <Typography variant={'body1'} align={'center'} color={'text.secondary'}
                                    py={1} px={2}
                                    sx={{borderRadius: '10px', background: '#eaeaea'}}
                                    component={'div'}>
                            Select chat to start messaging
                        </Typography>
                    }
                </Grid>
            </Grid>
        </>
    )
}

const ChatWrap = ({chats, param}) => {
    const navigate = useNavigate();

    if (!chats)
        return (<></>);

    return (
        <List sx={{width: '100%', bgcolor: 'background.paper'}}>
            {chats.map(chat =>
                <div key={chat.id}>
                    <ListItem alignItems="flex-start" button
                              selected={+param === chat.id}
                              onClick={() => navigate(`/${chat.id}`)}
                              secondaryAction={
                                  <div style={{
                                      width: 'fit-content',
                                      height: '25px',
                                      display: `${'none'}`,
                                      background: '#2085ec',
                                      color: 'white',
                                      borderRadius: '20px',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      padding: '0 8px'
                                  }}>0</div>
                              }>
                        <ListItemAvatar>
                            <Avatar alt={chat.name ?? chat.users[0].fullName} src=" "/>
                        </ListItemAvatar>
                        <ListItemText
                            primary={chat.name ?? chat.users[0].fullName}
                            secondary={
                                <React.Fragment>
                                    {chat.type === 0 && <Typography
                                        sx={{display: 'inline'}}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {chat.messages[chat.messages.length - 1]?.user?.fullName}
                                    </Typography>}
                                    <Typography
                                        component="div"
                                        variant="oulined"
                                        color="text.secondary"
                                        noWrap
                                    >
                                        {chat.messages[chat.messages.length - 1]?.text ?? "No Messages Yet"}
                                    </Typography>
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                    <Divider component="li"/>
                </div>
            )}
        </List>
    )
}

export default Home;