import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getProductById, getSimilarProductsByProductId } from '../../firebase';
import './DetailPage.css';
import StarIcon from '@material-ui/icons/Star';
import { Grid } from '@material-ui/core';
import { formattedCurrency } from '../../Constants/format';
import IconPrice from '../../Assets/icons/IconPrice';

const DetailPage = () => {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [similarItems, setSimilarItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedItem = await getProductById(id);
      const fetchedSimilarItems = await getSimilarProductsByProductId(id);
      setItem(fetchedItem);
      setSimilarItems(fetchedSimilarItems);
    }
    fetchData();
  }, []);

  const renderSimilarProducts = () => {
    return similarItems.map(similarItem => {
      const { product } = similarItem
      return (
        <div className='similar-item-wrapper'>
          <Grid container>
            <Grid item xs={5}>
              <div className='center-wrapper'>
                <img
                  src={require(`../../Assets/images/${product.source}.png`)}
                  style={{height:'30px'}}
                  alt=''
                />
                <div className='similar-item-title'>{product.title}</div>
              </div>
            </Grid>
            <Grid item xs={2}>
              <div className='center-wrapper'>
                <div>{product.category}</div>
                <div className='similar-item-rating'>
                  {
                    product.rating !== 0 ? <>
                      <StarIcon style={{color: '#FFC107'}}/>
                      {`${product.rating}/5`}
                      </>: null
                  }
                </div>
              </div>
            </Grid>
            <Grid item xs={2}>
              <div className='center-wrapper'>
                <div className='similar-item-price'>{formattedCurrency(product.price)}</div>
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className='center-wrapper'>
                <a href={product.url}>
                  <div className='similar-item-redirect-button'>
                    <h4>Cek Sekarang</h4>
                  </div>
                </a>
              </div>
            </Grid>
          </Grid>
        </div>
      )
    })
  }

  const renderItemDetails = () => {
    if (item === null || similarItems.length === 0) return;
    return (
      <div className='item-detail-wrapper'>
        <h3 className='item-detail-title'>{item.title}</h3>
        <div style={{marginTop: '20px'}}>
          <Grid container>
            <Grid item xs={3}>
              <img
                src={item.image || require('../../Assets/images/logo-bw.png')}
                className={item.image ? 'item-detail-image' : 'item-detail-image-empty'}
                alt=''
              />
            </Grid>
            <Grid item xs={6}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <IconPrice/>
                <div style={{width: '10px'}}></div>
                <div className='item-detail-price'>
                  {`${formattedCurrency(similarItems[0].product.price)} - ${formattedCurrency(similarItems[similarItems.length - 1].product.price)}`}
                </div>
              </div>
              <p style={{marginRight: '36px'}}>
                {`${item.title} dijual dengan harga ${item.price} di ${item.source}. Ada ${similarItems.length} barang yang serupa dengan barang yang anda cari, di ${[...new Set(similarItems.map(similarItem => similarItem.product.source))].length} marketplace yang berbeda.`}
              </p>
              <p style={{marginRight: '36px'}}>
                Silahkan melihat lebih lanjut untuk mendapatkan penawaran menarik. 
              </p>
            </Grid>
            <Grid item xs={3}>
              <div className='item-detail-offer-pane'>
                <div className='item-detail-offer-pane-header'>
                  Penawaran Terbaik
                </div>
                <div style={{padding: '20px'}}>
                  <img
                    src={require(`../../Assets/images/${item.source}.png`)}
                    style={{height: '30px', marginBottom: '10px'}}
                    alt=''
                  />
                  <div>{item.category}</div>
                  <div className='similar-item-rating'>
                    {
                      item.rating !== 0 ? <>
                        <StarIcon style={{color: '#FFC107'}}/>
                        {`${item.rating}/5`}
                        </>: null
                    }
                  </div>
                  <div className='similar-item-price'>{formattedCurrency(item.price)}</div>
                  <a href={item.url}>
                    <div className='similar-item-redirect-button'>
                      <h4>Cek Sekarang</h4>
                    </div>
                  </a>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    )
  }

  return (
    <>
      {renderItemDetails()}
      <h4 style={{margin: '40px 80px'}}>Bandingkan Penawaran Lain</h4>
      {renderSimilarProducts()}
    </>
  )

}
export default DetailPage;