import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { addToWishlist, getProductById, getSimilarProductsByProductId, getWishlistByCurrentUserId, removeFromWishlist, fetchCurrentUser } from '../../firebase';
import './DetailPage.css';
import StarIcon from '@material-ui/icons/Star';
import { Grid, Snackbar } from '@material-ui/core';
import { formattedCurrency } from '../../Constants/format';
import IconPrice from '../../Assets/icons/IconPrice';
import { Favorite, FavoriteBorder } from '@material-ui/icons';
import MuiAlert from '@material-ui/lab/Alert';

const DetailPage = () => {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [similarItems, setSimilarItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [inWishlist, setInWishlist] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const currentUserWishlist = await getWishlistByCurrentUserId();
      const fetchedItem = await getProductById(id);
      const fetchedSimilarItems = await getSimilarProductsByProductId(id);
      const fetchedCurrentUser = await fetchCurrentUser();
      setInWishlist(currentUserWishlist.wishlist.includes(parseInt(id)));
      setItem(fetchedItem);
      setSimilarItems(fetchedSimilarItems);
      setCurrentUser(fetchedCurrentUser);
    }
    fetchData();
  }, [refresh]);

  const handleAddOrRemoveWishlist = async () => {
    if (!inWishlist){
      await addToWishlist(parseInt(id));
      setSeverity('success');
      setMessage('Produk ini sudah masuk ke wishlist anda');
    } else {
      await removeFromWishlist(parseInt(id));
      setSeverity('error');
      setMessage('Produk ini sudah dihapus dari wishlist anda');
    }
    setOpenSnackbar(true);
    setRefresh(refresh + 1);
  }

  const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const renderSimilarProducts = () => {
    return similarItems.map(similarItem => {
      const { product } = similarItem
      return (
        <div className='similar-item-wrapper'>
          <Grid container>
            <Grid item xs={5}>
              <img
                src={require(`../../Assets/images/${product.source}.png`)}
                style={{height:'30px'}}
                alt=''
              />
              <div style={{height: '10px'}}></div>
              {product.title}
            </Grid>
            <Grid item xs={2}>
              <div>{product.category}</div>
              <div className='similar-item-rating'>
                {
                  product.rating !== 0 ? <>
                    <StarIcon style={{color: '#FFC107'}}/>
                    {`${product.rating}/5`}
                    </>: null
                }
              </div>
            </Grid>
            <Grid item xs={2}>
              <div className='similar-item-price'>{formattedCurrency(product.price)}</div>
            </Grid>
            <Grid item xs={3}>
              <a href={product.url}>
                <div className='similar-item-redirect-button'>
                  <h4>Cek Sekarang</h4>
                </div>
              </a>
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
              <p style={{paddingRight: '48px'}}>
                {`${item.title} dijual dengan harga ${item.price} di ${item.source}. Ada ${similarItems.length} barang yang serupa dengan barang yang anda cari, di ${[...new Set(similarItems.map(similarItem => similarItem.product.source))].length} marketplace yang berbeda.`}
              </p>
              <p style={{paddingRight: '48px'}}>
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
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    {renderActionButtons()}
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    )
  }

  const renderActionButtons = () => {
    return !!currentUser ? 
      <>
        <a href={item.url} style={{width: '85%'}}>
          <div className='similar-item-redirect-button'>
            <h4>Cek Sekarang</h4>
          </div>
        </a>
        <div style={{width: '10px'}}></div>
        <div className='heart-wrapper' onClick={() => handleAddOrRemoveWishlist()}>
          { inWishlist ? 
            <Favorite fontSize='large' color='error'/>
            : <FavoriteBorder fontSize='large' color='error'/>
          }
        </div>
      </> : <>
        <a href={item.url} style={{width: '100%'}}>
          <div className='similar-item-redirect-button'>
            <h4>Cek Sekarang</h4>
          </div>
        </a>
      </>
  }

  const renderSnackbar = () => {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    )
  }

  return (
    <>
      {renderItemDetails()}
      <h4 style={{margin: '40px 80px'}}>Bandingkan Penawaran Lain</h4>
      {renderSimilarProducts()}
      {renderSnackbar()}
    </>
  )

}
export default DetailPage;