import { Grid } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { getNews } from '../../firebase';

const NewsPage = () => {

  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      let fetchedNews = await getNews();
      let groupedNews = []
      while (fetchedNews.length > 0) {
        groupedNews.push(fetchedNews.splice(0,21))
      }
      setNews(groupedNews);
    }
    fetchData();
  }, []);

  const renderNewsCard = (article) => {
    const { title, url, description, urlToImage, source: { name: sourceName } } = article;
    return (
      <Grid item xs={4}>
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
    return news[page-1].map(article => renderNewsCard(article));
  }
  
  return (
    <div>
      <h2 style={{margin: '180px 0 20px 100px'}}>Berita & Artikel</h2>
      <div style={{padding: '0 100px'}}>
        <Grid container>
          {renderNewsCards()}
        </Grid>
      </div>
      <div className='pagination-container'>
        <Pagination
          count={Math.ceil(news.length)}
          shape="rounded"
          page={page}
          onChange={(event, value) => setPage(value)}
        />
      </div>
    </div>
  )
}

export default NewsPage;