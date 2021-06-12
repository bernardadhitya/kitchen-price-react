import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getProductById, getSimilarProductsByProductId } from '../../firebase';
import './DetailPage.css';
import StarIcon from '@material-ui/icons/Star';

const DetailPage = () => {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [similarItems, setSimilarItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedItem = await getProductById(id);
      const fetchedSimilarItems = await getSimilarProductsByProductId(id);
      setItem(fetchedItem);
    }
    fetchData();
  }, []);

  return (
    <></>
  )

}
export default DetailPage;