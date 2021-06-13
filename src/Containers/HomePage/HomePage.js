import React from 'react';
import './HomePage.css';

const HomePage = () => {
  
  return (
    <div className='home-page-wrapper'>
      <div className='home-banner-wrapper'>
        <div style={{color: 'white', fontSize: '52px', fontWeight: 600}}>
          MILIKI PERALATAN
        </div>
        <div style={{color: 'white', fontSize: '52px', fontWeight: 600}}>
          DAPUR YANG ANDA
        </div>
        <div style={{color: 'white', fontSize: '52px', fontWeight: 600}}>
          INGINKAN SEKARANG
        </div>
        <p style={{color: 'white'}}>
          Anda bisa mencari peralatan dapur sesuai dengan keinginan dan rekomendasi dari kami.
        </p>
        <div className='home-redirect-button'>
          <p>Cari Sekarang</p>
        </div>
      </div>
    </div>
  )
}

export default HomePage;