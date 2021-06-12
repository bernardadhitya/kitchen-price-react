import {
  Grid,
  makeStyles,
  Modal
} from '@material-ui/core';
import React, {useState, useEffect} from 'react';
import { useHistory, useLocation } from 'react-router';
import { getAllProducts, getProductsByQueries } from '../../firebase';
import qs from 'query-string';
import './SearchPage.css';
import Pagination from '@material-ui/lab/Pagination';
import FilterModal from '../../Components/FilterModal/FilterModal';
import FilterListIcon from '@material-ui/icons/FilterList';
import ItemCard from '../../Components/ItemCard/ItemCard';

var _ = require('lodash');

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '8px',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const SearchPage = () => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const [items, setItems] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState(1);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMarketplaces, setSelectedMarketplaces] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);

  const queries = qs.parse(location.search);

  const searchQuery = queries.query;

  useEffect(() => {
    const fetchData = async () => {
      const fetchedItems = _.isEmpty(queries) ? 
        await getAllProducts() : await getProductsByQueries(queries);
      setItems(fetchedItems);
    }
    fetchData();
  }, [location]);

  const renderSortByMenu = () => {
    return (
      <div className='filter-button' onClick={() => setOpenModal(true)}>
        <FilterListIcon style={{marginRight: '8px', color: 'rgba(0,0,0,0.7)'}}/>
        <p>Filter</p>
      </div>
    )
  }

  const renderItemCards = () => {
    return items.length > 0 ? (
      <Grid container>
        { items[page-1].map(item => {
            const { image, title, price, source, rating } = item;
            return (
              <ItemCard
                image={image}
                title={title}
                price={price}
                source={source}
                rating={rating}
              />
            )
        })}
      </Grid>
    ) : (
      <div style={{margin: '40px 0 0 40px'}}>
        <h3>Tidak menemukan barang yang anda cari</h3>
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

  return (
    <div style={{margin: '20px 100px'}}>
      {
        !!searchQuery &&
        <h1 style={{margin: '140px 0 0 40px'}}>Pencarian untuk <span style={{color: '#3183CD'}}>{searchQuery}</span></h1>
      }
      <Grid container>
        <Grid item xs={9}></Grid>
        <Grid item xs={3}>
          <div style={{float: 'right', marginRight: '30px'}}>
            {renderSortByMenu()}
          </div>
        </Grid>
      </Grid>
      {renderItemCards()}
      <div className='pagination-container'>
        <Pagination
          count={Math.ceil(items.length)}
          shape="rounded"
          page={page}
          onChange={(event, value) => setPage(value)}
        />
      </div>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        className={classes.modal}
      >
        <FilterModal
          handleMinPrice={setMinPrice}
          handleMaxPrice={setMaxPrice}
          handleSelectedCategories={setSelectedCategories}
          handleSelectedMarketplaces={setSelectedMarketplaces}
          handleSelectedRating={setSelectedRating}
          handleCloseModal={() => setOpenModal(false)}
        />
      </Modal>
    </div>
  )
}

export default SearchPage;