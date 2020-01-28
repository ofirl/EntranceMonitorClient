import React, { useRef } from 'react';
import { postData } from '../../utils/network';

const LoginPage = ({ verify }) => {
    let inputRef = useRef();
    let submit = () => {
        postData("https://entrance-monitor.azurewebsites.net/token", { password: inputRef.current.value })
            .then(() => verify());
    };

    return (
        <div>
            login

            <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
                <input ref={inputRef} type="input" />
            </form>
        </div>
    );
};

export default LoginPage;