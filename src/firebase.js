import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';
import { firebaseConfig, newsApiConfig, supabaseConfig } from './env';
import { createClient } from '@supabase/supabase-js'
import { getAllCategories, categories } from './Constants/categories';
import { allMarketplaces } from './Constants/marketplaces';
import stringSimilarity from 'string-similarity';
import axios from 'axios';

firebase.initializeApp(firebaseConfig);
const fireAuth = firebase.auth();
const db = firebase.firestore();

const supabase = createClient(supabaseConfig.url, supabaseConfig.key)

export const signUp = async (email, password, username) => {
  let userData = {};
  fireAuth.createUserWithEmailAndPassword(email, password)
    .then(async data => {
      userData = await createUser({username, email});
      console.log('SUCCESS SIGN UP');
    })
    .catch(error => console.log('FAILED SIGNUP'));
  return userData;
}

export const signIn = async (email, password) => {
  let userData = {};
  fireAuth.signInWithEmailAndPassword(email, password)
    .then(async () => {
      userData = await getUserByEmail(email);
      console.log('SUCCESS SIGN IN');
    })
    .catch(error => console.log('FAILED SIGNIN'))
  return userData;
}

export const signOut = async () => {
  fireAuth.signOut();
}

export const fetchCurrentUser = async () => {
  const isLoggedIn = fireAuth.currentUser;
  const userData = !!isLoggedIn ? await getUserByEmail(isLoggedIn.email) : null;
  return !!isLoggedIn ? userData[0] : userData;
}

export const getUserByEmail = async (email) => {
  const response = await db.collection('users').where("email", "==", email).get();
  const data = response.docs.map(doc => {
    const responseId = doc.id;
    const responseData = doc.data();
    return { user_id: responseId, ...responseData }
  });
  return data;
}

export const createUser = async (userData) => {
  const user = await db.collection('users').add({ ...userData, history: []});
  await db.collection('wishlists').doc(user.id).set({user_id: user.id, wishlist: []});
  return user;
}

export const getAllProducts = async (filters) => {
  const {
    minPrice,
    maxPrice,
    selectedCategories,
    selectedMarketplaces,
    selectedRating,
    sortBy,
    ascendingOrder
  } = filters;

  let { data: allProducts } = await supabase
  .from('products')
  .select('*')
  .gte('price', minPrice)
  .lte('price', maxPrice)
  .in('category', selectedCategories)
  .in('source', selectedMarketplaces)
  .gte('rating', selectedRating)
  .order(sortBy, { ascending: ascendingOrder })

  let groupedProducts = []

  while (allProducts.length > 0) {
    groupedProducts.push(allProducts.splice(0,20))
  }

  return groupedProducts;
}

const getProductsByCategory = async (category, filters) => {
  const {
    minPrice,
    maxPrice,
    selectedCategories,
    selectedMarketplaces,
    selectedRating,
    sortBy,
    ascendingOrder
  } = filters;

  let { data: products } = await supabase
  .from('products')
  .select('*')
  .eq('category', category)
  .gte('price', minPrice)
  .lte('price', maxPrice)
  .in('category', selectedCategories)
  .in('source', selectedMarketplaces)
  .gte('rating', selectedRating)
  .order(sortBy, { ascending: ascendingOrder })

  return products
}

const getProductsByTitle = async (searchString, filters) => {
  const {
    minPrice,
    maxPrice,
    selectedCategories,
    selectedMarketplaces,
    selectedRating,
    sortBy,
    ascendingOrder
  } = filters;

  let { data: products } = await supabase
  .from('products')
  .select('*')
  .ilike('title', `%${searchString}%`)
  .gte('price', minPrice)
  .lte('price', maxPrice)
  .in('category', selectedCategories)
  .in('source', selectedMarketplaces)
  .gte('rating', selectedRating)
  .order(sortBy, { ascending: ascendingOrder })

  return products
}

const getProductsByTopic = async (topic, filters) => {
  const {
    minPrice,
    maxPrice,
    selectedCategories,
    selectedMarketplaces,
    selectedRating,
    sortBy,
    ascendingOrder
  } = filters;

  let allProducts = []

  const getAllProductsByTopic = async () => {
    await Promise.all(
      categories[topic].map(async (category) => {
        let { data } = await supabase
          .from('products')
          .select('*')
          .eq('category', category)
          .gte('price', minPrice)
          .lte('price', maxPrice)
          .in('category', selectedCategories)
          .in('source', selectedMarketplaces)
          .gte('rating', selectedRating)
          .order(sortBy, { ascending: ascendingOrder })
        allProducts.push(...data);
        return category
      })
    );
  }

  await getAllProductsByTopic();

  return allProducts;
}

export const getProductsByQueries = async (queries, filters) => {
  const { query: searchString, category = '', topic } = queries;
  
  let allProducts = []

  if (!!topic) {
    allProducts = await getProductsByTopic(topic, filters);
  } else {
    const productsByCategory = await getProductsByCategory(category, filters);
    const productByTitle = await getProductsByTitle(searchString, filters);
    allProducts = [...productByTitle, ...productsByCategory];
  }

  let groupedProducts = []

  while (allProducts.length > 0) {
    groupedProducts.push(allProducts.splice(0,20))
  }

  return groupedProducts;
}

export const getProductById = async (productId) => {
  let { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('product_id', productId);

  return data[0];
}

export const getSimilarProductsByProductId = async (productId) => {
  const currentProduct = await getProductById(productId);
  const productsByCategory = await getProductsByCategory(currentProduct.category, defaultFilter);

  const similarProducts = productsByCategory
    .map(product => {
      return {
        product,
        similarityScore: stringSimilarity.compareTwoStrings(currentProduct.title, product.title)
      }
    })
    // .filter(product => product.similarityScore >= 0.7)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0,10)
    .sort((a,b) => a.product.price - b.product.price)
  
  return similarProducts;
}

const defaultFilter = {
  minPrice: 0,
  maxPrice: Math.pow(10,10),
  selectedCategories: getAllCategories(),
  selectedMarketplaces: allMarketplaces,
  selectedRating: 0,
  sortBy: 'rating',
  ascendingOrder: false
}

export const getUserById = async (userId) => {
  const response = await db.collection('users').doc(userId).get();
  const responseId = response.id;
  const responseData = response.data();
  return { user_id: responseId, ...responseData };
}

export const getProfileByUserId = async (userId) => {
  const response = await db.collection('profiles').where("user_id", "==", userId).get();
  const data = response.docs.map(doc => {
      const responseId = doc.id;
      const responseData = doc.data();
      return { profile_id: responseId, ...responseData }
  });
  return data[0];
}

export const createOrUpdateProfile = async (profileData, userId) => {
  const profileExist = await getProfileByUserId(userId);
  let response;
  if(!!profileExist){
    response = await db.collection('profiles').doc(profileExist.profile_id).update(profileData);
  } else {
    response = await db.collection('profiles').add(profileData);
  }
  return response;
}

export const getAllProductsInWishlist = async () => {
  const response = await getWishlistByCurrentUserId();
  const allId = response.wishlist;
  const getAllPost = async (productIds) => {
    return Promise.all(
      productIds.map(async (productId) => {
        return await getProductById(productId)
      })
    );
  };
  const allProducts = await getAllPost(allId);
  return allProducts;
}

export const getWishlistByCurrentUserId = async () => {
  try {
    const currentUser = await fetchCurrentUser();
    const response = await db.collection('wishlists').doc(currentUser.user_id).get();
    const responseId = response.id;
    const responseData = response.data();
    return { wishlist_id: responseId, ...responseData };
  } catch (error) {
    return { wishlist_id: null, wishlist: []}
  }
}

export const addToWishlist = async (productId) => {
  const currentUserWishlist = await getWishlistByCurrentUserId();
  const { user_id, wishlist } = currentUserWishlist;
  const tempWishlist = wishlist;
  tempWishlist.push(productId);
  const newWishlist = await db.collection('wishlists').doc(user_id).update({
    wishlist: tempWishlist
  });
  return newWishlist;
}

export const removeFromWishlist = async (productId) => {
  const currentUserWishlist = await getWishlistByCurrentUserId();
  const { user_id, wishlist } = currentUserWishlist;
  const tempWishlist = wishlist.filter(product => product !== productId);
  const newWishlist = await db.collection('wishlists').doc(user_id).update({
    wishlist: tempWishlist
  });
  return newWishlist;
}

export const getNews = async () => {
  const url = `https://newsapi.org/v2/everything?q=cooking&apiKey=${newsApiConfig.key}&sortBy=popularity&pageSize=100`
  const response = await axios.get(url)
  const data = response.data

  const articles = data.articles

  return articles;
}

export const getUserSearchHistory = async () => {
  try {
    const currentUser = await fetchCurrentUser();
    const response = await db.collection('users').doc(currentUser.user_id).get();
    const responseData = response.data();
    return responseData.history;
  } catch (error) {
    return []
  } 
}

export const addUserSearchHistory = async (productId) => {
  try {
    const product = await getProductById(productId)
    const currentUser = await fetchCurrentUser();
    const currentUserHistory = await getUserSearchHistory();
    await db.collection('users').doc(currentUser.user_id).update({
      history: [
        product,
        ...currentUserHistory
      ]
    })
  } catch (error) {
    return;
  }
}

export const getRecommendedProducts = async () => {
  try {
    const currentUserSearchHistory = await getUserSearchHistory();

    let index = 0;
    let recommendedProducts = [];

    while(recommendedProducts.length < 4){
      const recentSearchedProduct = currentUserSearchHistory[index];
      const recentSearchedProductId = recentSearchedProduct.product_id;
      const products = await getSimilarProductsByProductId(recentSearchedProductId);

      const similarProducts = products
        //.filter(product => product.similarityScore < 1)
        .map(product => product.product)
        .filter(product => product.image !== null);

      recommendedProducts.push(...similarProducts);
      index += 1;
    }
    console.log(recommendedProducts);
    return recommendedProducts.splice(0,4);
  } catch(error) {
    console.log(error);
    const allProducts = await getAllProducts(defaultFilter);
    return allProducts[0].splice(0,4);
  }
}