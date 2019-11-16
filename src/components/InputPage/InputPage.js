import React, { useState } from 'react';

import { postData } from '../../utils/network';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

import { Grid, Cell } from "styled-css-grid";

import {
    Link
} from "react-router-dom";

const useStyles = makeStyles(theme => ({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: '#244e7b',
        alignContent: 'center',
        justifyContent: 'center',
        color: 'white'
    },
    gridCellCentered: {
        justifyContent: 'center',
        alignContent: 'center',
        display: 'grid',
    },
    textField: {
        '& label, & input': {
            color: 'white',
        },
        '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.23)',
        },
        '& .MuiOutlinedInput-root.Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white',
                borderWidth: '2px',
            },
        },
        '& .MuiFormLabel-root.Mui-focused': {
            color: 'white',
        },
        '& .MuiOutlinedInput-root:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.87)',
            }
        }
    },
    links: {
        '& a': {
            color: 'white',
        },
        '& a:visited': {
            color: 'white'
        }
    }
}));

const InputPage = () => {
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    let classes = useStyles();

    let inputRef = React.createRef();

    const addGuest = async () => {
        setSending(true);
        setSuccess(false);
        setError(false);

        let inputElement = inputRef.current;
        let guestIdNumber = inputRef.current.value;
        let response;
        try {
            response = await postData('https://entrance-monitor-server.herokuapp.com/addGuest', { guestId: guestIdNumber });
        }
        catch (e) {
            setError(true);
        }
        setSending(false);
        if (response == null || !response.success)
            setError(true);
        else
            setSuccess(true);

        inputElement.value = "";

        // console.log(response);
    };

    return (
        <React.Fragment>
            <Grid className={classes.container} columns='1fr auto 1fr' rows='1fr auto auto 1fr' areas={['nav title .', '. form hiddenSubmit', '. loader .', '. . .']}>
                <Cell area="nav" className={classes.links}>
                    <Link to="/viewGuests"> View Guests </Link> <br />
                    <Link to="/viewExpected"> Expected </Link>
                </Cell>
                <Cell area="title">
                    Entrance Monitoring System
                </Cell>
                <Cell area="form">
                    <form onSubmit={(e) => { e.preventDefault(); addGuest(); }}>
                        <TextField
                            id="outlined-required"
                            label="Guest ID"
                            // defaultValue="Hello World"
                            className={classes.textField}
                            margin="normal"
                            variant="outlined"
                            inputRef={inputRef}
                            autoFocus
                        />
                        {/* <input ref={inputRef} autoFocus /> */}
                    </form>
                </Cell>
                <Cell area="hiddenSubmit" onClick={() => addGuest()}>

                </Cell>
                <Cell area="loader" className={classes.gridCellCentered}>
                    {
                        error ?
                            (
                                <div style={{ color: 'red' }}> <ErrorOutlineIcon /> </div>
                            )
                            : null
                    }
                    {
                        sending ?
                            (
                                <CircularProgress color="inherit" />
                            )
                            : null
                    }
                    {
                        success ?
                            (
                                <div style={{ color: 'lime' }}>
                                    <CheckCircleOutlineIcon />
                                </div>
                            )
                            : null
                    }
                </Cell>
            </Grid>

        </React.Fragment>
    );
};

export default InputPage;