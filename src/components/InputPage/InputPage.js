import React, { useState } from 'react';

import { postData } from '../../utils/network';

import {
    Link
  } from "react-router-dom";

const InputPage = () => {
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    let inputRef = React.createRef();

    const addGuest = async () => {
        setSending(true);
        setSuccess(false);
        setError(false);

        let inputElement = inputRef.current;
        let guestIdNumber = inputRef.current.value;
        let response = await postData('https://entrance-monitor-server.herokuapp.com/addGuest', { guestId: guestIdNumber });
        setSending(false);
        if (!response.success)
            setError(true);
        else
            setSuccess(true);

        inputElement.value = "";

        // console.log(response);
    };

    return (
        <React.Fragment>
            <Link to="/viewGuests"> View Guests </Link> <br /> 
            <Link to="/viewExpected"> Expected </Link> <br/> <br />

            <form onSubmit={(e) => { e.preventDefault(); addGuest(); }}>
                <label style={{ marginRight: '10px' }}>
                    id:
            </label>
                <input ref={inputRef} autoFocus />
                {
                    error ?
                        (
                            <div> error, please try again </div>
                        )
                        : null
                }
                {
                    sending ?
                        (
                            <div className="loader"></div>
                        )
                        : null
                }
                {
                    success ?
                        (
                            <div style={{ color: 'green' }}>
                                success
                    </div>
                        )
                        : null
                }
            </form>
        </React.Fragment>
    );
};

export default InputPage;