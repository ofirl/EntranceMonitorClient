import React, { useState, useEffect } from 'react';

import { postData } from '../../utils/network';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Switch from '@material-ui/core/Switch';

import { Grid, Cell } from "styled-css-grid";

import { Link } from "react-router-dom";

import Axios from 'axios';

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
    },
    indicatorsCell: {
        display: 'grid',
        justifyContent: 'right',
    },
    focusLockCell: {
        display: 'grid',
        justifyItems: 'center',
        alignItems: 'center',
    },
    link: {
        cursor: 'pointer',
        textDecoration: 'underline',
    },
}));

const InputPage = () => {
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [offlineMode, setOfflineMode] = useState(false);
    const [focusLock, setFocusLock] = useState(true);
    let classes = useStyles();

    useEffect(() => {
        let initBacklog = localStorage.getItem('guestsBacklog');
        if (initBacklog && initBacklog.length > 0)
            sendBacklog();
    }, []);

    let inputRef = React.createRef();

    const addGuest = async (data) => {
        setSending(true);
        setSuccess(false);
        setError(false);

        let inputElement = inputRef.current;
        if (data == null)
            data = {
                guestId: inputRef.current.value
            };

        return Axios({
            method: 'post',
            url: 'https://entrance-monitor.azurewebsites.net/addGuest',
            timeout: 5000,
            data,
        })
            .then(function (response) {
                setSending(false);
                if (response.data == null || !response.data.success)
                    setError(true);
                else
                    setSuccess(true);

                inputElement.value = "";
                inputElement.focus();
                if (offlineMode)
                    setOfflineMode(false);

                return response.data;
            })
            .catch((e) => {
                setError(true);
                setOfflineMode(true);
                saveGuestToBacklog({ guestId: data.guestId });
                inputElement.value = "";

                return { success: false };
            })
            .finally(() => {
                setSending(false);
            });
    };

    const saveGuestToBacklog = (guest = {}) => {
        // 2019-12-13 18:57:09.9575+00
        let { guestId } = guest;

        setSending(true);
        setSuccess(false);
        setError(false);

        if (guestId == null)
            guestId = inputRef.current.value;

        let currentBacklog = JSON.parse(localStorage.getItem('guestsBacklog'));
        if (currentBacklog == null)
            currentBacklog = [];

        if (currentBacklog.find((g) => g.guestId === guestId) == null) {
            currentBacklog.push({
                guestId,
                arrival_time: new Date().toISOString(),
            });

            localStorage.setItem('guestsBacklog', JSON.stringify(currentBacklog));
        }

        setSending(false);
        setSuccess(true);
        // setError(false);

        if (inputRef.current)
            inputRef.current.value = "";
    }

    const sendBacklog = () => {
        let currentBacklog = JSON.parse(localStorage.getItem('guestsBacklog'));
        if (currentBacklog == null)
            return;

        let requests = [];
        currentBacklog.forEach(async (g) => {
            requests.push(addGuest(g));
        });

        Axios.all(requests).then(Axios.spread((...responses) => {
            if (responses.every((res) => res && res.success)) {
                localStorage.setItem('guestsBacklog', JSON.stringify([]));
            }
        }));
    }

    const submitForm = (e) => {
        if (e)
            e.preventDefault();

        if (inputRef.current && inputRef.current.value !== "") {
            let match = inputRef.current.value.match(/\D/);
            if (match && match.length > 0) {
                setError(true);
                setSuccess(false);
                return;
            }
        }

        if (offlineMode)
            saveGuestToBacklog()
        else
            addGuest();
    };

    const focusLockHandler = () => {
        if (!focusLock)
            return;

        let inputEle = inputRef.current;

        if (inputEle != null) {
            setTimeout(() => inputEle.focus(), 1);
            console.log('focused!');
        }
    };

    if (focusLock)
        setTimeout(() => focusLockHandler(), 1);

    return (
        <React.Fragment>
            <Grid className={classes.container} columns='1fr auto 1fr' rows='1fr auto auto 1fr' areas={['nav title indicators', 'focusLock form hiddenSubmit', '. loader .', '. . .']}>
                <Cell area="nav" className={classes.links}>
                    <Link to="/client/viewGuests"> View Guests </Link> <br />
                    <Link to="/client/viewExpected"> Expected </Link>
                </Cell>
                <Cell area="title">
                    Entrance Monitoring System
                </Cell>
                <Cell area="form">
                    <form onSubmit={submitForm}>
                        <TextField
                            id="outlined-required"
                            label="Guest ID"
                            // defaultValue="Hello World"
                            className={classes.textField}
                            margin="normal"
                            variant="outlined"
                            inputRef={inputRef}
                            autoFocus
                            disabled={sending}
                            inputProps={{
                                onBlur: focusLockHandler,
                            }}
                        />
                        {/* <input ref={inputRef} autoFocus /> */}
                    </form>
                </Cell>
                <Cell area="indicators" className={classes.indicatorsCell}>
                    <div>
                        {
                            offlineMode ? (
                                <div> Offline, try <span onClick={sendBacklog} className={classes.link}> reconnecting </span> </div>
                            ) : null
                        }
                    </div>
                </Cell>
                <Cell area="focusLock" className={classes.focusLockCell}>
                    <Switch
                        checked={focusLock}
                        onChange={() => setFocusLock(!focusLock)}
                        value="focusLock"
                        color="secondary"
                    />
                </Cell>
                <Cell area="hiddenSubmit" onClick={submitForm}>

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
                                <div style={{ color: `${offlineMode ? 'orange' : 'lime'}` }}>
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