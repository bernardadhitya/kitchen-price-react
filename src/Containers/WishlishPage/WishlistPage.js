import { Grid } from '@material-ui/core';
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router';
import IconEmpty from '../../Assets/icons/IconEmpty';
import ItemCard from '../../Components/ItemCard/ItemCard';
import { formattedCurrency, formattedDescription } from '../../Constants/format';
import { getAllProductsInWishlist } from '../../firebase';
import './WishlistPage.css';

const WishlistPage = () => {
  const history = useHistory();

  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const feetchedItems = await getAllProductsInWishlist();
      setItems(feetchedItems);
    }
    fetchData();
  }, []);

  const renderJobCards = () => {
    return items.length > 0 ? (
      <div style={{margin: '0 30px'}}>
        <Grid container>
          { items.map(item => {
              const { image, title, price, source, rating, product_id } = item;
              return <ItemCard
                image={image}
                title={title}
                price={price}
                source={source}
                rating={rating}
                productId={product_id}
              />
          }) }
        </Grid>
      </div>
    ) : (
      <h3 style={{marginLeft: '40px'}}>No data</h3>
    )
  }

  return (
    <div style={{margin: '20px 40px'}}>
      <h1 style={{margin: '160px 0 40px 40px'}}>Wishlist</h1>
      { 
        items.length > 0 ? 
          renderJobCards() :
          <div style={{
            marginTop: '120px',
            textAlign: 'center',
            alignItems: 'center',
            paddingLeft: '30%',
            paddingRight: '30%',
          }}>
            <img
              src={require('../../Assets/images/logo-big-empty.png')}
              style={{height: '250px'}}
              alt=''
            />
            <div style={{height: '20px'}}></div>
            <p>
            Anda belum menandai produk favorit anda. 
            </p>
          </div>
      }
    </div>
  )
}

export default WishlistPage;