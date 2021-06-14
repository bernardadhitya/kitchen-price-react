import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import ItemCard from '../../Components/ItemCard/ItemCard';
import { getNews, getRecommendedProducts } from '../../firebase';
import './HomePage.css';

const HomePage = () => {

  const [items, setItems] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedItems = await getRecommendedProducts();
      const fetchedNews = await getNews();
      setItems(fetchedItems);
      setNews(fetchedNews);
    }
    fetchData();
  }, []);

  const renderNewsCard = (article) => {
    const { title, url, description, urlToImage, source: { name: sourceName } } = article;
    return (
      <Grid item xs={3}>
        <a style={{textDecoration: 'none', color: '#000000'}} href={url}>
          <div className='news-card'>
            <div className='news-image'>
              <img
                src={urlToImage || require('../../Assets/images/logo-bw.png')}
                className={urlToImage ? 'news-thumbnail' : 'news-thumbnail-empty'}
                alt=''
              />
            </div>
            <div className='news-content'>
              <div className='news-title'>{title}</div>
              <p>{description}</p>
              <p>By <span style={{color: '#57946C'}}>{sourceName}</span></p>
            </div>
          </div>
        </a>
      </Grid>
    )
  }

  const renderNewsCards = () => {
    if (news.length === 0) return;
    return news.splice(0,4).map(article => renderNewsCard(article));
  }

  const renderRecommendedItemCards = () => {
    if (items.length === 0) return;
    return items.map(item => {
      const { image, title, price, source, rating, product_id} = item;
      return (
        <ItemCard
          image={image}
          title={title}
          price={price}
          source={source}
          rating={rating}
          productId={product_id}
        />
      )
    })
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
      <div style={{margin: '40px'}}>
        <h1 style={{textAlign: 'center'}}>Rekomendasi untuk Anda</h1>
        <Grid container>
          {renderRecommendedItemCards()}
        </Grid>
      </div>
      <div style={{margin: '40px'}}>
        <h1 style={{textAlign: 'center'}}>Berita dan Artikel</h1>
        <Grid container>
          {renderNewsCards()}
        </Grid>
      </div>
    </div>
  )
}

export default HomePage;