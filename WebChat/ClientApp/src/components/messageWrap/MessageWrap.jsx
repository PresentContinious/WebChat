import {makeStyles} from "@mui/styles";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import {formatTime} from "../../imports/text";

const useStyles = makeStyles(() => ({
    root: {
        maxWidth: '400px',
        width: 'fit-content',
        padding: '20px',
        marginBottom: '10px',
        position: 'relative',
        display: 'flex',
        gap: 10
    },
    messageText: {
        whiteSpace: 'pre-line',
    },
    time: {
        display: 'flex',
        gap: '10px',
    },
    small: {
        display: 'flex',
        alignItems: 'end'
    },
    align: {
        display: 'flex',
        width: '100%',
        justifyContent: 'start'
    }
}));

export const GroupMessage = ({message, userId}) => {
    const classes = useStyles();
    const my = message.userId === userId;

    if (my)
        return (<Message message={message} userId={userId}/>)

    return (
        <div className={classes.align}>
            <Paper className={classes.root}>
                <Avatar alt={message.user.fullName} src=" "/>
                <div>
                    <Typography variant="subtitle2" component="div">
                        {message.user.fullName}
                    </Typography>
                    <div className={classes.time}>
                        <Typography variant="body1" className={classes.messageText}>
                            {message.text}
                        </Typography>
                        <Typography variant="caption" color={'text.secondary'} className={classes.small}>
                            <i>{formatTime(message.createdAt)}</i>
                        </Typography>
                    </div>
                </div>
            </Paper>
        </div>
    );
};

export const Message = ({message, userId}) => {
    const classes = useStyles();
    const my = message.userId === userId;

    const styles = {
        justifyContent: 'end',
    }

    return (
        <div className={classes.align} style={my ? styles : {}}>
            <Paper className={classes.root} sx={{background: `${my ? '#f6f6f6' : ''}`}}>
                <div className={classes.time}>
                    <Typography variant="body1" className={classes.messageText}>
                        {message.text}
                    </Typography>
                    <Typography variant="caption" color={'text.secondary'} className={classes.small}>
                        <i>{formatTime(message.createdAt)}</i>
                    </Typography>
                </div>
            </Paper>
        </div>
    );
};