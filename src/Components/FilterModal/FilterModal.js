import { Grid, makeStyles, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import StarIcon from '@material-ui/icons/Star';
import './FilterModal.css';

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '8px',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const FilterModal = (props) => {
  const {
    handleMinPrice,
    handleMaxPrice,
    handleSelectedCategories,
    handleSelectedMarketplaces,
    handleSelectedRating,
    handleCloseModal
  } = props;
  const classes = useStyles();

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMarketplaces, setSelectedMarketplaces] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);

  const [refresh, setRefresh] = useState(0);
  
  const renderCategoryFilters = () => {
    const categoryFilters = [
      'Aksesoris Dapur',
      'Alat Masak Dapur',
      'Bekal',
      'Elektronik Dapur',
      'Penyimpanan Makanan',
      'Peralatan Dapur',
      'Peralatan Makan & Minum',
      'Peralatan Masak',
      'Perlengkapan Cuci Piring',
      'Ruang Makan'
    ]
    return (
      <>
        <h4>1. Alat dapur dengan kategori apa yang sedang Anda cari?</h4>
        <div className='filter-item-wrapper'>
          {
            categoryFilters.slice(0,6).map(categoryFilter => {
              return <div
                className={selectedCategories.includes(categoryFilter) ?
                  'filter-item-selected' : 'filter-item'}
                onClick={() => {
                  if (selectedCategories.includes(categoryFilter)) {
                    let temp = selectedCategories;
                    temp.splice(temp.indexOf(categoryFilter), 1);
                    setSelectedCategories(temp);
                  } else {
                    setSelectedCategories([...selectedCategories, categoryFilter])
                  }
                  setRefresh(refresh + 1);
                }}
              >
                {categoryFilter}
              </div>
            })
          }
        </div>
        <div className='filter-item-wrapper'>
          {
            categoryFilters.slice(6).map(categoryFilter => {
              return <div
                className={selectedCategories.includes(categoryFilter) ?
                  'filter-item-selected' : 'filter-item'}
                onClick={() => {
                  if (selectedCategories.includes(categoryFilter)) {
                    let temp = selectedCategories;
                    temp.splice(temp.indexOf(categoryFilter), 1);
                    setSelectedCategories(temp);
                  } else {
                    setSelectedCategories([...selectedCategories, categoryFilter])
                  }
                  setRefresh(refresh + 1);
                }}
              >
                {categoryFilter}
              </div>
            })
          }
        </div>
      </>
    )
  }

  const renderPriceRangeFilter = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <h4>2. Jangkauan harga dari produk yang Anda cari?</h4>
        </Grid>
        <Grid item xs={3}>
          <TextField
            type="number"
            label="Min Harga"
            variant="outlined"
            fullWidth
            onChange={e => {setMinPrice(e.target.value)}}
          />
        </Grid>
        <Grid item xs={1}>
          <div className='line'></div>
        </Grid>
        <Grid item xs={3}>
          <TextField
            type="number"
            label="Max Harga"
            variant="outlined"
            fullWidth
            onChange={e => {setMaxPrice(e.target.value)}}
          />
        </Grid>
      </Grid>
    )
  }

  const renderRatingFilter = () => {
    const ratingFilters = [5, 4.5, 4, 3.5, 3];
    return (
      <>
        <h4>3. Rating dari produk yang Anda cari?</h4>
        <div className='filter-item-wrapper'>
          {
            ratingFilters.map(ratingFilter => {
              return (
                <div
                  className={selectedRating === ratingFilter ?
                    'filter-item-selected' : 'filter-item'
                  }
                  onClick={() => {
                    if (selectedRating === ratingFilter){
                      setSelectedRating(null);
                    } else {
                      setSelectedRating(ratingFilter);
                    }
                    setRefresh(refresh + 1)
                  }}
                >
                  {ratingFilter !== 5 && '>'}<StarIcon style={{color: '#FFC107'}}/>{ratingFilter}
                </div>
              )
            })
          }
        </div>
      </>
    )
  }

  const renderMarketplaceFilter = () => {
    const marketplaceFilters = [
      'Tokopedia',
      'Shopee',
      'Lazada',
      'Blibli',
      'Bukalapak',
      'JDid'
    ]
    return (
      <>
        <h4>4. Marketplace pilihan untuk mencari produk Anda?</h4>
        <div className='filter-item-wrapper'>
          {
            marketplaceFilters.map(marketplaceFilter => {
              return <div
                className={selectedMarketplaces.includes(marketplaceFilter) ?
                  'filter-item-selected' : 'filter-item'}
                onClick={() => {
                  if (selectedMarketplaces.includes(marketplaceFilter)) {
                    let temp = selectedMarketplaces;
                    temp.splice(temp.indexOf(marketplaceFilter), 1);
                    setSelectedMarketplaces(temp);
                  } else {
                    setSelectedMarketplaces([...selectedMarketplaces, marketplaceFilter])
                  }
                  setRefresh(refresh + 1);
                }}
              >
                {marketplaceFilter}
              </div>
            })
          }
        </div>
      </>
    )
  }

  const handleSubmitFilter = () => {
    handleMinPrice(minPrice);
    handleMaxPrice(maxPrice);
    handleSelectedCategories(selectedCategories);
    handleSelectedMarketplaces(selectedMarketplaces);
    handleSelectedRating(selectedRating);

    handleCloseModal();
  }

  const renderSubmitButton = () => {
    return (
      <Grid container>
        <Grid item xs={3}></Grid>
        <Grid item xs={6}>
          <div
            className='filter-submit-button'
            onClick={() => handleSubmitFilter()}
          >
            <h4>Cari</h4>
          </div>
        </Grid>
        <Grid item xs={3}></Grid>
      </Grid>
    )
  }

  return (
    <div className={classes.paper}>
      {renderCategoryFilters()}
      {renderPriceRangeFilter()}
      {renderRatingFilter()}
      {renderMarketplaceFilter()}
      {renderSubmitButton()}
    </div>
  )
}

export default FilterModal;