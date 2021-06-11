import { Grid } from '@material-ui/core';
import React from 'react';
import { formattedCurrency } from '../../Constants/format';
import StarIcon from '@material-ui/icons/Star';
import './ItemCard.css';

const ItemCard = (props) => {
  const {
    image,
    title,
    price,
    source,
    rating
  } = props;

  return (
    <Grid item xs={3}>
      <div className='item-card'>
        <img
          src={image}
          className='image-thumbnail'
          alt=''
          />
        <div className='item-content'>
          <div className='item-title'>{title}</div>
          <div className='item-rating'>
            <StarIcon style={{color: '#FFC107'}}/>
            {`${rating}/5`}
          </div>
          <div className='item-price'>{formattedCurrency(price)}</div>
          <img className='item-source' src={require(`../../Assets/images/${source}.png`)} alt=''/>
        </div>
      </div>
    </Grid>
  )
}

export default ItemCard;