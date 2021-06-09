import { Grid, makeStyles, TextField } from '@material-ui/core';
import React, { useState } from 'react';

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

const FilterModal = (props) => {
  const { handleFilterByPrice } = props;
  const classes = useStyles();

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  
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
            onChange={e => {setMinPrice(e.target.value)}}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            type="number"
            label="Max Harga"
            variant="outlined"
            fullWidth
            onChange={e => {setMaxPrice(e.target.value)}}
          />
        </Grid>
        <Grid item xs={12}>
          <div className='filter-submit-button'>
            <h4
              style={{
                cursor: 'pointer'
              }}
              onClick={() => {
                handleFilterByPrice(minPrice, maxPrice);
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

export default FilterModal;