import React from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

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

const SortMenu = (props) => {
  const {anchorSortMenu, setAnchorSortMenu, setSortBy, sortBy} = props;

  const handleSortByClicked = (event) => {
    setAnchorSortMenu(event.currentTarget);
  };

  const handleCloseSortMenu = () => {
    setAnchorSortMenu(null);
  };

  const sortByText = {
    'rating': 'Rating Tertinggi',
    'lowest-fee': 'Harga Terendah',
    'highest-fee': 'Harga Tertinggi'
  }
  return (
    <div style={{display: 'flex'}}>
      <div style={{margin: '60px 10px 0 0'}}>Urutkan:</div>
      <div className='sort-button' onClick={handleSortByClicked}>
        <h5>{sortByText[sortBy]}</h5>
        <ArrowDropDownIcon/>
      </div>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorSortMenu}
        keepMounted
        open={Boolean(anchorSortMenu)}
        onClose={handleCloseSortMenu}
      >
        <StyledMenuItem onClick={() => {setSortBy('lowest-fee'); handleCloseSortMenu()}}>
          <ListItemText primary="Harga Terendah" />
          <ListItemIcon/>
        </StyledMenuItem>
        <StyledMenuItem onClick={() => {setSortBy('highest-fee'); handleCloseSortMenu()}}>
          <ListItemText primary="Harga Tertinggi" />
          <ListItemIcon/>
        </StyledMenuItem>
        <StyledMenuItem onClick={() => {setSortBy('rating'); handleCloseSortMenu()}}>
          <ListItemText primary="Rating Tertinggi" />
          <ListItemIcon/>
        </StyledMenuItem>
      </StyledMenu>
    </div>
  )
}

export default SortMenu;