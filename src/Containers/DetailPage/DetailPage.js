import { Grid, Snackbar } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { addToWishlist, createRequestPost, getImageByJobId, getJobById, getWishlistByCurrentUserId, removeFromWishlist } from '../../firebase';
import './DetailPage.css';
import MuiAlert from '@material-ui/lab/Alert';
import { Favorite, FavoriteBorder } from '@material-ui/icons';
import { getJobRatingByRatingList } from '../../Constants/rating';
import StarIcon from '@material-ui/icons/Star';

const DetailPage = () => {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [jobRating, setJobRating] = useState({rating: 0, length: 0});

  const [inWishlist, setInWishlist] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const currentUserWishlist = await getWishlistByCurrentUserId();
      const fetchedJob = await getJobById(id);
      const fetchedImageByJobId = await getImageByJobId(id);
      setJob({...fetchedJob, imageUrl: fetchedImageByJobId});
      setInWishlist(currentUserWishlist.wishlist.includes(id));
      setJobRating(getJobRatingByRatingList(fetchedJob.ratings || {}))
    }
    fetchData();
  }, [refresh]);

  const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handleAddOrRemoveWishlist = async () => {
    if (!inWishlist){
      await addToWishlist(id);
      setSeverity('success');
      setMessage('Pekerjaan ini sudah masuk ke wishlist anda');
    } else {
      await removeFromWishlist(id);
      setSeverity('error');
      setMessage('Pekerjaan ini sudah dihapus dari wishlist anda');
    }
    setOpenSnackbar(true);
    setRefresh(refresh + 1);
  }

  return (
    <div style={{margin: '20px 40px'}}>
      <Grid container spacing={3}>
      <Grid item xs={1}></Grid>
        <Grid item xs={6}>
          <img
            src={job ? job.imageUrl : ''}
            className='image-banner'
            alt=''
          />
          <Grid container>
            <Grid item xs={10}>
              <h1>{job ? job.title : ''}</h1>
            </Grid>
            <Grid item xs={2}>
              <div className='heart-wrapper' onClick={() => handleAddOrRemoveWishlist()}>
                { inWishlist ? 
                  <Favorite fontSize='large' color='error'/>
                  : <FavoriteBorder fontSize='large' color='error'/>
                }
              </div>
            </Grid>
          </Grid>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <p>{job ? `${job.startTime} - ${job.endTime}` : ''}</p>
            {
              jobRating.length > 0 ?
                <>
                  <p style={{width: '20px', textAlign: 'center'}}>•</p>
                  <StarIcon fontSize='small' color='primary'/>
                  <p>{`${jobRating.rating} (${jobRating.length})`}</p>
                </>
                : <></>
            }
          </div>
          <h4>Deskripsi Jasa</h4>
          <p>{job ? job.description : ''}</p>
        </Grid>
        
        <Grid item xs={4}>
          
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
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
    </div>
  )

}
export default DetailPage;