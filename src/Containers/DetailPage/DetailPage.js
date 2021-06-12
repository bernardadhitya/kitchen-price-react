import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getProductById, getSimilarProductsByProductId } from '../../firebase';
import './DetailPage.css';
import StarIcon from '@material-ui/icons/Star';
import { Grid } from '@material-ui/core';
import { formattedCurrency } from '../../Constants/format';

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
                <img src={require(`../../Assets/images/${product.source}.png`)} style={{height:'30px'}}/>
                <div className='similar-item-title'>{product.title}</div>
              </div>
            </Grid>
            <Grid item xs={2}>
              <div className='center-wrapper'>
                <div>{product.category}</div>
                <div className='similar-item-rating'>
                  <StarIcon style={{color: '#FFC107'}}/>
                  {`${product.rating}/5`}
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

  return (
    <>
      {renderSimilarProducts()}
    </>
  )

}
export default DetailPage;