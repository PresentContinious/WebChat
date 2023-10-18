import {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import * as React from "react";
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import {GroupMessage, Message} from "../messageWrap/MessageWrap";
import {apiEndpoint} from "../../api";
import {launchError, launchToast} from "../layout/Layout";
import {messageTypes} from "../../imports/text";
import {HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import Avatar from "@mui/material/Avatar";
import EditChat from "../editChat/EditChat";

const Chat = ({chatId}) => {
    const [chat, setChat] = useState({messages: [], users: []});
    const [userId, setUserId] = useState('');
    const [connection, setConnection] = useState(null);
    const [message, setMessage] = useState('');
    const [editChat, setEdit] = useState(false);
    const [canEdit, setCanEdit] = useState(false);

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl('https://localhost:44481/api/hub')
            .configureLogging(LogLevel.Information)
            .build();

        setConnection(newConnection);

        apiEndpoint('chat/get').fetchById(chatId).then(res => {
            setChat(res.data.chat);
            setUserId(res.data.userId);
            setCanEdit(res.data.canEdit);
        });
    }, [chatId])

    useEffect(() => {
        if (connection && connection.state === "Disconnected") {
            connection.start()
                .then(() => connection.on('ReceiveMessage', newChat => {
                    if (chat.id === newChat.id)
                        setChat(newChat)
                }))
                .catch(e => console.log('Connection failed: ', e));

            return () => {
                if (connection.state !== 'Disconnected') {
                    connection.stop();
                }
            };
        }
    }, [connection]);

    const sendMessage = () => {
        if (message.length < 1) {
            launchToast('Please enter a message', messageTypes.warning);
            return;
        }

        if (connection._connectionStarted) {
            apiEndpoint('chat/message')
                .post({message, chatId})
                .then(res => {
                    connection.invoke("SendMessage", res.data.chat);
                    setUserId(res.data.userId);
                    setCanEdit(res.data.canEdit);
                    setMessage('');
                })
                .catch(err => launchError(err));
        } else {
            console.log('No connection to server yet.');
        }
    }

    return (
        <>
            <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                margin: '0 20px 20px',
            }}>
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0',
                    borderBottom: '1px solid gray',
                    marginBottom: '10px'
                }}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 15}}>
                        <Avatar alt={chat.name ?? chat.users.filter(u => u.id !== userId)[0]?.fullName} src=" "/>
                        <Typography
                            variant={'h5'}>{chat.name ?? chat.users.filter(u => u.id !== userId)[0]?.fullName}
                        </Typography>
                    </div>
                    {canEdit && <div style={{fontSize: 24, cursor: 'pointer', display: 'flex', alignItems: 'center'}}
                                     onClick={() => setEdit(chat)}>
                        <ion-icon name="create-outline"></ion-icon>
                    </div>}
                </div>
                {chat.messages.length === 0 ?
                    <div style={{display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center'}}>
                        <Typography variant={'body1'} align={'center'} color={'text.secondary'}
                                    py={1} px={2}
                                    sx={{borderRadius: '10px', background: '#eaeaea'}}
                                    component={'div'}>
                            Send First Message
                        </Typography>
                    </div> :
                    <MapMessages data={chat.messagesByDate} userId={userId} group={chat.type === 0}/>}
                <TextField
                    sx={{position: 'absolute', bottom: '0px'}}
                    fullWidth
                    label="Write a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    InputProps={{
                        endAdornment: <div style={{cursor: 'pointer'}} onClick={sendMessage}><SendIcon/></div>
                    }}
                    multiline
                    maxRows={4}
                />
                <EditChat open={editChat} setOpen={setEdit}/>
            </div>
        </>
    )
}

const MapMessages = ({data, userId, group}) => {
    const mapData = () => {
        const components = [];

        for (const key in data) {
            components.push(
                <div key={key} style={{display: 'flex', justifyContent: 'center'}}>
                    <Typography component={'div'} variant={'outlined'}>
                        <div style={{
                            background: '#262626',
                            color: 'white',
                            padding: '5px 10px',
                            opacity: .5,
                            borderRadius: 20,
                            fontSize: 12
                        }}>
                            {new Date(key).toDateString()}
                        </div>
                    </Typography>
                </div>
            );
            if (group)
                data[key].map(value => components.push(<GroupMessage message={value} key={value.id} userId={userId}/>));
            else
                data[key].map(value => components.push(<Message message={value} key={value.id} userId={userId}/>));
        }

        return components;
    }

    return (
        <>
            <div style={{height: 620, overflow: 'scroll'}}>
                {mapData()}
            </div>
        </>
    )
}

export default Chat;