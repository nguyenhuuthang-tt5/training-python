import React, { useState, useCallback } from 'react'
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import styled from '@emotion/styled';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const MyButton = styled(Button)({
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    fontSize: '1rem'
});

const MyTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#FF8E53',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#FF8E53',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'white',
        },
        '&:hover fieldset': {
            borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#FF8E53',
        },
    },
    marginBottom: 24
})

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {login, user} = useAuth();

    const handleSubmit = useCallback(e => {
        e.preventDefault();
        if(username ?? password)
            login({username, password})
    }, [username, password, login])

    if (user) {
        return <Navigate to='/dashboard' replace />;
    }

    return (
        <div className="min-vh-100 d-flex justify-content-center align-items-center">
            <form className='login-form bg-white' onSubmit={handleSubmit}>
                <h3 className='mb-4 text-center'>Login</h3>
                <MyTextField value={username} autoComplete="on" onChange={(e) => setUsername(e.target.value)} label="Username" variant="standard" size='medium' fullWidth />
                <MyTextField value={password} autoComplete="on" onChange={(e) => setPassword(e.target.value)} label="Password" variant="standard" size='medium' fullWidth type='password' />
                <MyButton variant='text' type='submit' fullWidth>Login</MyButton>
            </form>
        </div>
    )
}

export default LoginPage