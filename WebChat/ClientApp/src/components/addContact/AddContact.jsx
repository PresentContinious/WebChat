import ModalWindow from "../modalWindow/ModalWindow";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {apiEndpoint} from "../../api";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {launchError} from "../layout/Layout";
import Button from "@mui/material/Button";

const AddContact = ({open, setOpen}) => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const add = () => {
        apiEndpoint('account/chat').post(username).then(() => {
            setOpen(false);
            navigate(0);
        }).catch(err => launchError(err));
    }

    return (
        <>
            <ModalWindow isOpen={open} setOpen={setOpen}>
                <Typography variant={'h4'} mb={2} align={'center'} component={'div'}>Add Contact</Typography>
                <TextField fullWidth label={'Username'} value={username}
                           onChange={e => setUsername(e.target.value)}/>
                <div style={{margin: '20px 0', textAlign: 'center'}}>
                    <Button variant={'contained'} onClick={add}>Add</Button>
                </div>
            </ModalWindow>
        </>
    )
}

export default AddContact;