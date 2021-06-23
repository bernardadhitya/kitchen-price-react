import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ItemCard from '../../Components/ItemCard/ItemCard';
import { allMarketplaces } from '../../Constants/marketplaces';
import { getNews, getRecommendedProducts } from '../../firebase';
import './HomePage.css';

const HomePage = () => {

  const history = useHistory();

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

  const renderSupportedMarketplaces = () => {
    return (
      <div style={{
        width: '100%',
        textAlign: 'center',
        alignContent: 'center',
        backgroundColor: '#D9D9D9',
        margin: '20px 0'
      }}>
        <div style={{height: '50px'}}></div>
        <h1>Supported Marketplace</h1>
        <div style={{height: '20px'}}></div>
        <Grid container>
        {
          allMarketplaces.map(marketplace => {
            return (
              <Grid item xs={4}>
                <img
                  src={require(`../../Assets/images/${marketplace}.png`)}
                  style={{height: '40px', margin: '40px 20px'}}
                  alt=''
                />
              </Grid>
            )
          })
        }
        </Grid>
        <div style={{height: '50px'}}></div>
      </div>
    )
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
        <div
          className='home-redirect-button'
          onClick={() => history.push({
            pathname: '/search',
            state: {
              filterModalOpen: true
            }
          })}
        >
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
      {renderSupportedMarketplaces()}
    </div>
  )
}

export default HomePage;