import ModalWindow from "../modalWindow/ModalWindow";
import Typography from "@mui/material/Typography";
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Avatar from "@mui/material/Avatar";
import FormControlLabel from '@mui/material/FormControlLabel';
import {Radio} from "@mui/material";
import RadioGroup from '@mui/material/RadioGroup';
import {apiEndpoint} from "../../api";
import {launchError, launchSuccess} from "../layout/Layout";

const EditChat = ({open, setOpen}) => {
    const handleToggle = (event, member) => {
        apiEndpoint('account/role').post({role: event.target.value, userId: member.userId, chatId: open.id})
            .then(res => launchSuccess(res)).catch(err => launchError(err));
    };

    if (!open)
        return (<></>);

    return (
        <>
            <ModalWindow isOpen={open} setOpen={setOpen}>
                <Typography variant={'h5'} component={'div'} align={'center'} mb={5}>Edit Chat</Typography>
                <List sx={{width: '100%', maxWidth: 1000, bgcolor: 'background.paper'}}
                      subheader={<ListSubheader>Users</ListSubheader>}>
                    {open.members.map((member) =>
                        <ListItem key={member.id}>
                            <ListItemIcon>
                                <Avatar src={" "} alt={member.user.fullName}/>
                            </ListItemIcon>
                            <ListItemText primary={member.user.fullName}/>
                            <div style={{marginLeft: 50, display: 'flex', gap: 30}}>
                                <RadioGroup
                                    id={'Ratio' + member.userId}
                                    defaultValue={member.role}
                                    onChange={(e) => handleToggle(e, member)}
                                >
                                    {member.role !== 0 ?
                                        <>
                                            <FormControlLabel control={<Radio/>} label={"Banned"} value={3}/>
                                            <FormControlLabel control={<Radio/>} label={"Admin"} value={1}/>
                                        </>
                                        : <FormControlLabel control={<Radio disabled/>} label={"Creator"} value={0}/>}
                                </RadioGroup>
                            </div>
                        </ListItem>
                    )}
                </List>
            </ModalWindow>
        </>
    )
}

export default EditChat;
