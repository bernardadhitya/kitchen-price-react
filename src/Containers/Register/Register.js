import React, { useState } from 'react';
import './Register.css';
import { Grid, TextField } from '@material-ui/core';
import { signUp } from '../../firebase';
import { useHistory } from 'react-router-dom';
import { fetchCurrentUser } from '../../firebase';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const history = useHistory();

  const handleRegister = async () => {
    await signUp(email, password, username);

    setTimeout(handleAuthentication, 2000);
  }

  const handleAuthentication = async () => {
    const currentUser = await fetchCurrentUser();
    if (currentUser) {
      history.push('/home');
    } else {
      window.alert('Wrong email/password. Please try again');
    }
  }

  return (
    <div className='login-page'>
      <div className='login-card'>
        <h3>Registrasi</h3>
        <div className="form-item">
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                id="user-name"
                label="Username"
                variant="outlined"
                fullWidth="true"
                value={username}
                onChange={(e) => {setUsername(e.target.value)}}
              />
            </Grid>
          </Grid>
        </div>
        <div className="form-item">
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            fullWidth="true"
            value={email}
            onChange={(e) => {setEmail(e.target.value)}}
          />
        </div>
        <div className="form-item">
          <TextField
            id="password"
            label="Password"
            variant="outlined"
            type="password"
            fullWidth="true"
            value={password}
            onChange={(e) => {setPassword(e.target.value)}}
          />
        </div>
        <p>
          Dengan mengklik “Daftar”, Anda setuju dengan <span style={{color:'#6AB484'}}>ketentuan</span> dan <span style={{color:'#6AB484'}}>kebijakan</span> privasi dari Dapurzilla
        </p>
        <div
          className="form-item"
          onClick={() => handleRegister()}
        >
          <div className="login-btn">
            Daftar
          </div>
        </div>
      </div>
    </div>
  )
};

export default Register;