import React from 'react';
import './Footer.css';

const Footer = () => {
  
  return (
    <div className='footer-wrapper'>
      <img
        src={require('../../Assets/images/logo.png')}
        alt=''
        style={{height: '50px'}}
      />
      <p style={{color: '#57946C'}}>
        Ⓒ 2021. Mohamad Fernanda & Rachmat Akbar Panuja. All Right Reserved
      </p>
    </div>
  )
}

export default Footer;