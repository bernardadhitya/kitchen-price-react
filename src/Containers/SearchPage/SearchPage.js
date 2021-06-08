import {
  Grid,
  makeStyles,
  Modal,
  TextField,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import React, {useState, useEffect} from 'react';
import { useHistory, useLocation } from 'react-router';
import { formattedCurrency, formattedDescription } from '../../Constants/format';
import { getAllJobs, getJobsByQueries, getProductsByQueries } from '../../firebase';
import qs from 'query-string';
import './SearchPage.css';
import StarIcon from '@material-ui/icons/Star';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { withStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';

var _ = require('lodash');

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

const SearchPage = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const [items, setItems] = useState([]);
  const [sortBy, setSortBy] = useState('most-recent');
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState(1);

  const queries = qs.parse(location.search);

  const searchQuery = queries.query;

  useEffect(() => {
    const fetchData = async () => {
      const fetchedItems = _.isEmpty(queries) ? 
        await getAllJobs() : await getProductsByQueries(queries);
      // const sortedItems = fetchedItems.sort((x,y) => {
      //   const sortByConditions = {
      //     'rating': y['jobRating']['rating'] - x['jobRating']['rating'],
      //     'most-recent': y['dateCreated'] - x['dateCreated'],
      //     'lowest-fee': x['fee'] - y['fee'],
      //     'highest-fee': y['fee'] - x['fee']
      //   }
      //   return sortByConditions[sortBy];
      // })
      setItems(fetchedItems);
    }
    fetchData();
  }, [location, sortBy]);

  const handleSortByClicked = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickItem = (job_id) => {
    history.push(`/business/${job_id}`);
  }

  const renderSortByMenu = () => {
    const sortByText = {
      'rating': 'Rating Tertinggi',
      'most-recent': 'Terbaru',
      'lowest-fee': 'Harga Terendah',
      'highest-fee': 'Harga Tertinggi'
    }
    return (
      <div>
        <div className='filter-button' onClick={handleSortByClicked}>
          <h5>{`Urutkan: ${sortByText[sortBy]}`}</h5>
        </div>
        <StyledMenu
          id="customized-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <StyledMenuItem onClick={() => {setSortBy('most-recent'); handleClose()}}>
            <ListItemText primary="Terbaru" />
            <ListItemIcon/>
          </StyledMenuItem>
          <StyledMenuItem onClick={() => {setSortBy('lowest-fee'); handleClose()}}>
            <ListItemText primary="Harga Terendah" />
            <ListItemIcon/>
          </StyledMenuItem>
          <StyledMenuItem onClick={() => {setSortBy('highest-fee'); handleClose()}}>
            <ListItemText primary="Harga Tertinggi" />
            <ListItemIcon/>
          </StyledMenuItem>
          <StyledMenuItem onClick={() => {setSortBy('rating'); handleClose()}}>
            <ListItemText primary="Rating Tertinggi" />
            <ListItemIcon/>
          </StyledMenuItem>
        </StyledMenu>
      </div>
    )
  }

  const renderItemCard = (job) => {
    const {
      product_id,
      image,
      title,
      url,
      price,
      source,
      rating
    } = job;

    return (
      <Grid item xs={3}>
        <div className='job-card'>
          <img
            src={image}
            className='image-thumbnail'
            alt=''
            />
          <div className='job-content'>
            <div className='job-title'>{title}</div>
            <div className='job-rating'>
              <StarIcon style={{color: '#FFC107'}}/>
              {`${rating}/5`}
            </div>
            <div className='job-price'>{formattedCurrency(price)}</div>
            <img className='job-source' src={require(`../../Assets/images/${source}.png`)} alt=''/>
          </div>
        </div>
      </Grid>
    )
  }

  const renderItemCards = () => {
    return items.length > 0 ? (
      <Grid container>
        { items[page-1].map(item => renderItemCard(item)) }
      </Grid>
    ) : (
      <div style={{margin: '40px 0 0 40px'}}>
        <h3>Tidak menemukan pekerjaan</h3>
      </div>
    )
  }

  const handleFilterByPrice = (tempMinPrice, tempMaxPrice) => {
    setOpenModal(false);
    history.push({
      search: `?query=${!!searchQuery || ''}${!!tempMinPrice ? `&minPrice=${tempMinPrice}` : ''}${!!tempMaxPrice ? `&maxPrice=${tempMaxPrice}` : ''}`,
      pathname: '/business/'
    })
  }

  const renderModalBody = () => {
    let tempMinPrice = null;
    let tempMaxPrice = null;
    return (
      <div className={classes.paper}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <h4>Harga</h4>
          </Grid>
          <Grid item xs={6}>
            <TextField
              type="number"
              label="Min Harga"
              variant="outlined"
              fullWidth
              onChange={e => {tempMinPrice = e.target.value}}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              type="number"
              label="Max Harga"
              variant="outlined"
              fullWidth
              onChange={e => {tempMaxPrice = e.target.value}}
            />
          </Grid>
          <Grid item xs={12}>
            <div className='filter-submit-button'>
              <h4
                style={{
                  cursor: 'pointer'
                }}
                onClick={() => {
                  handleFilterByPrice(tempMinPrice, tempMaxPrice);
                }}
              >
                Cari
              </h4>
            </div>
          </Grid>
        </Grid>
      </div>
    )
  }


  return (
    <div style={{margin: '20px 100px'}}>
      {
        !!searchQuery &&
        <h1 style={{margin: '140px 0 0 40px'}}>Pencarian untuk <span style={{color: '#3183CD'}}>{searchQuery}</span></h1>
      }
      <Grid container>
        <Grid item xs={3}>
          <div className='filter-button' onClick={() => setOpenModal(true)}>
            <h5>Harga</h5>
          </div>
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={3}>
          <div style={{float: 'right', marginRight: '30px'}}>
            {renderSortByMenu()}
          </div>
        </Grid>
      </Grid>
      {renderItemCards()}
      <Pagination
        count={Math.ceil(items.length)}
        shape="rounded"
        page={page}
        onChange={(event, value) => setPage(value)}
      />
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        className={classes.modal}
      >
        {renderModalBody()}
      </Modal>
    </div>
  )
}

export default SearchPage;