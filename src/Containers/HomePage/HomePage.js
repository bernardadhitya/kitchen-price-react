import { Grid } from '@material-ui/core';
import React from 'react';
import './HomePage.css';

const HomePage = () => {

  const renderNewsCard = () => {
    return (
      <Grid item xs={3}>
        <div className='news-card'>
          <div className='news-image'>
            <img
              src={require('../../Assets/images/logo-bw.png')}
              className={'news-thumbnail-empty'}
              alt=''
            />
          </div>
          <div className='news-content'>
            <div className='news-title'>Lorem Ipsum</div>
            <p>Ex duis laboris excepteur duis labore ipsum id commodo et consequat ad Lorem id dolore. Nostrud ipsum ut consequat duis nostrud eiusmod Lorem non exercitation adipisicing proident adipisicing proident. Labore reprehenderit qui exercitation duis duis nisi nulla occaecat pariatur cillum. Nostrud ullamco duis reprehenderit in qui amet qui.</p>
          </div>
        </div>
      </Grid>
    )
  }
  
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
      <div style={{textAlign: 'center', margin: '40px'}}>
        <h1>Berita dan Artikel</h1>
        <Grid container>
          {renderNewsCard()}
          {renderNewsCard()}
          {renderNewsCard()}
          {renderNewsCard()}
        </Grid>
      </div>
    </div>
  )
}

export default HomePage;