import React, { useState } from "react";
import styled from "styled-components";
import { categories } from '../../Constants/categories'; 
import MenuIcon from '@material-ui/icons/Menu';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const DropDownContainer = styled("div")`
`;

const DropDownHeader = styled("div")`
  display: flex;
  background: #ffffff;
  cursor: pointer;
`;

const DropDownListContainer = styled("div")`
  display: flex;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  width: 80vw;
  height: 80vh;
  overflow: scroll;
`;

const DropDownList = styled("ul")`
  padding: 15px;
  margin: 0;
  background: #ffffff;
  box-sizing: border-box;
`;

const ListItem = styled("li")`
  list-style: none;
  margin-bottom: 0.8em;
  cursor: pointer;
`;

const QuickButton = styled("div")`
  margin: 1px 24px;
  cursor: pointer;
`;

const CategoriesSelect = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggling = () => setIsOpen(!isOpen);

  const onOptionClicked = value => () => {
    setSelectedOption(value);
    setIsOpen(false);
    console.log(selectedOption);
  };

  const handleGroupCategories = () => {
    const groupedCategories = []
    let temp = [];
    Object.keys(categories).map((category, idx) => {
      temp.push({key: category, value: categories[category]})
      if (idx % 2 === 1){
        groupedCategories.push(temp);
        temp = [];
      }
    })
    return groupedCategories;
  }

  const renderDropDownList = (header, options) => {
    return (
      <>
        <h4>{header}</h4>
        {options.map(option => (
          <ListItem onClick={onOptionClicked(option)} key={Math.random()}>
            {option}
          </ListItem>
        ))}
      </>
    )
  }

  const renderDropDownRow = (categoryGroup) => {
    return (
      <DropDownList>
        {
          categoryGroup.map(category => {
            return renderDropDownList(category.key, category.value);
          })
        }
      </DropDownList>
    )
  }

  return (
    <>
      <DropDownContainer>
        <div style={{display: 'flex'}}>
          <DropDownHeader onClick={toggling}>
            <MenuIcon/>
            <div style={{margin: '1px 8px'}}>Semua Kategori</div>
            <ExpandMoreIcon/>
          </DropDownHeader>
          <QuickButton>Peralatan Dapur</QuickButton>
          <QuickButton>Peralatan Makan & Minum</QuickButton>
          <QuickButton>Peralatan Masak</QuickButton>
          <QuickButton>Elektronik Dapur</QuickButton>
          <QuickButton>Ruang Makan</QuickButton>
          <QuickButton>Penyimpanan Makanan</QuickButton>
        </div>
        {isOpen && (
          <DropDownListContainer>
            {
              handleGroupCategories().map(categoryGroup =>
                renderDropDownRow(categoryGroup)
              )
            }
          </DropDownListContainer>
        )}
      </DropDownContainer>
    </>
  );
}

export default CategoriesSelect; 