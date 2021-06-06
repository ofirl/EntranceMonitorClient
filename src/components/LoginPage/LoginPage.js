import React, { useRef } from 'react';
import { postData, SERVER_BASE_URL } from '../../utils/network';

const LoginPage = ({ verify }) => {
    let inputRef = useRef();
    let submit = () => {
        postData(`${SERVER_BASE_URL}/token`, { password: inputRef.current.value })
            .then(() => verify());
    };

    return (
        <div>
            login

            <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
                <input ref={inputRef} type="password" />
                <button type="submit"> login </button>
            </form>
        </div>
    );
};

export default LoginPage;