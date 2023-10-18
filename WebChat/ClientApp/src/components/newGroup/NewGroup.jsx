import ModalWindow from "../modalWindow/ModalWindow";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import {apiEndpoint} from "../../api";
import TextField from "@mui/material/TextField";
import {Autocomplete} from "@mui/material";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {launchError, launchToast} from "../layout/Layout";
import {useNavigate} from "react-router-dom";
import {messageTypes} from "../../imports/text";

const NewGroup = ({open, setOpen}) => {
    const [contacts, setContacts] = useState([]);
    const [name, setName] = useState('');
    const [selectedContacts, setSelectedContacts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        apiEndpoint('account/contacts').fetch().then(res => setContacts(res.data));
    }, [])

    const add = () => {
        if (contacts.length < 2) {
            launchToast('Select minimum 2 users', messageTypes.warning)
            return;
        }

        apiEndpoint('chat/new').post({name, contacts: selectedContacts})
            .then(() => {
                setOpen(false);
                navigate(0);
            }).catch(err => launchError(err))
    }

    return (
        <ModalWindow isOpen={open} setOpen={setOpen}>
            <Typography variant={'h5'} align={'center'} mb={2}>Add New Group</Typography>
            <Grid container spacing={3}>
                <Grid item sm={12}>
                    <TextField fullWidth label={'Name'} value={name} onChange={e => setName(e.target.value)}/>
                </Grid>
                <Grid item sm={12}>
                    <Autocomplete
                        limitTags={3}
                        multiple
                        onChange={(e, value) => setSelectedContacts(value)}
                        renderInput={(params) => <TextField {...params} label="Members"/>}
                        options={contacts}/>
                </Grid>
                <Grid item sm={12} align={'center'}>
                    <Button variant={'contained'} onClick={add}>Add</Button>
                </Grid>
            </Grid>
        </ModalWindow>
    )
}

export default NewGroup;