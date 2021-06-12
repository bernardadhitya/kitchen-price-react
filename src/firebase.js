import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';
import { firebaseConfig, supabaseConfig } from './env';
import { getJobRatingByRatingList } from './Constants/rating';
import { createClient } from '@supabase/supabase-js'
import { getAllCategories, categories } from './Constants/categories';
import { allMarketplaces } from './Constants/marketplaces';
import stringSimilarity from 'string-similarity';

var _ = require('lodash');

firebase.initializeApp(firebaseConfig);
const fireAuth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage().ref();

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
  const user = await db.collection('users').add(userData);
  await db.collection('wishlists').doc(user.id).set({user_id: user.id, wishlist: []});
  return user;
}

export const uploadImage = async (file, job) => {
  storage.child(`/${job.id}/${file.name}`).put(file);
}

export const createJobPost = async (jobData, image) => {
  const currentUser = await fetchCurrentUser();
  const job = await db.collection('jobs').add({
    ...jobData,
    provider: {
      id: currentUser.user_id,
      name: currentUser.name
    },
    status: 'ACTIVE-JOB'
  });
  await uploadImage(image, job);
}

export const getImageUrlByImageRef = async (imageRef) => {
  const response = await imageRef.getDownloadURL().then((url) => {
    return url;
  }).catch(function (error) {
    console.log(error)
  });
  return response;
}

export const getImageByJobId = async (jobId) => {
  const doc = await db.collection('jobs').doc(jobId).get();
  if (doc.data().filePath === '') return '';
  const fpath = '/' + jobId + '/' + doc.data().filePath;
  const response = await storage.child(fpath).getDownloadURL().then((url) => {
    return url;
  }).catch(function (error) {
    return '';
  });
  return response;
}

export const getAllJobs = async () => {
  const getAllId = async () => {
    const responses = await db.collection('jobs').where('status', '==', 'ACTIVE-JOB').get();
    const data = responses.docs.map(doc => doc.id);
    return data;
  }
  const allId = await getAllId();
  const getAllPost = async (jobIds) => {
    return Promise.all(
      jobIds.map(async (jobId) => {
        const jobPost = await getJobById(jobId);
        const imageUrl = await getImageByJobId(jobId);
        const jobRating = getJobRatingByRatingList(jobPost.ratings || {});
        return { ...jobPost, imageUrl, jobRating };
      })
    );
  };
  const allJobs = await getAllPost(allId);
  return allJobs;
}

export const getAllJobsInWishlist = async () => {
  const response = await getWishlistByCurrentUserId();
  const allId = response.wishlist;
  const getAllPost = async (jobIds) => {
    return Promise.all(
      jobIds.map(async (jobId) => {
        const jobPost = await getJobById(jobId)
        const imageUrl = await getImageByJobId(jobId)
        return { ...jobPost, imageUrl };
      })
    );
  };
  const allJobs = await getAllPost(allId);
  return allJobs;
}

export const getJobsByUserId = async (userId) => {
  const getAllId = async () => {
    const responses = await db.collection('jobs').where('provider.id', '==', userId).get();
    const data = responses.docs.map(doc => doc.id);
    return data;
  }
  const allId = await getAllId();
  const getAllPost = async (jobIds) => {
    return Promise.all(
      jobIds.map(async (jobId) => {
        const jobPost = await getJobById(jobId)
        const imageUrl = await getImageByJobId(jobId)
        return { ...jobPost, imageUrl };
      })
    );
  };
  const allJobs = await getAllPost(allId);
  return allJobs;
}

export const getJobsByUserIdAndStatus = async (userId, status) => {
  const getAllId = async () => {
    const responses = await db.collection('jobs')
      .where('status', '==', status)
      .where('provider.id', '==', userId)
      .get();
    const data = responses.docs.map(doc => doc.id);
    return data;
  }
  const allId = await getAllId();
  const getAllPost = async (jobIds) => {
    return Promise.all(
      jobIds.map(async (jobId) => {
        const jobPost = await getJobById(jobId)
        const imageUrl = await getImageByJobId(jobId)
        return { ...jobPost, imageUrl };
      })
    );
  };
  const allJobs = await getAllPost(allId);
  return allJobs;
}

export const updateJobPost = async (jobId, data) => {
  const response = await db.collection('jobs').doc(jobId).update({status: data})
  return response;
}

export const getJobsByCurrentUserId = async () => {
  const fetchedCurrentUser = await fetchCurrentUser();
  if (!fetchedCurrentUser) return [];
  const fetchedJobsByCurrentUser = await getJobsByUserId(fetchedCurrentUser.user_id);
  return fetchedJobsByCurrentUser;
}

export const getJobsByCurrentUserIdAndStatus = async (status) => {
  const fetchedCurrentUser = await fetchCurrentUser();
  if (!fetchedCurrentUser) return [];
  const fetchedJobsByCurrentUser = status === 'ALL' ?
    await getJobsByUserId(fetchedCurrentUser.user_id) :
    await getJobsByUserIdAndStatus(fetchedCurrentUser.user_id, status);
  return fetchedJobsByCurrentUser;
}

export const getAllProducts = async (filters) => {
  const {
    minPrice,
    maxPrice,
    selectedCategories,
    selectedMarketplaces,
    selectedRating
  } = filters;

  console.log('filters:', filters);

  let { data: priorityProducts } = await supabase
  .from('products')
  .select('*')
  .not('image', 'is', null)
  .gte('price', minPrice)
  .lte('price', maxPrice)
  .in('category', selectedCategories)
  .in('source', selectedMarketplaces)
  .gte('rating', selectedRating)

  let { data: products } = await supabase
  .from('products')
  .select('*')
  .is('image', null)
  .gte('price', minPrice)
  .lte('price', maxPrice)
  .in('category', selectedCategories)
  .in('source', selectedMarketplaces)
  .gte('rating', selectedRating)

  let allProducts = [...priorityProducts, ...products];
  let groupedProducts = []

  while (allProducts.length > 0) {
    groupedProducts.push(allProducts.splice(0,20))
  }

  console.log(groupedProducts);

  return groupedProducts;
}

const getProductsByCategory = async (category, filters) => {
  const {
    minPrice,
    maxPrice,
    selectedCategories,
    selectedMarketplaces,
    selectedRating
  } = filters;

  let { data: priorityProducts } = await supabase
  .from('products')
  .select('*')
  .eq('category', category)
  .not('image', 'is', null)
  .gte('price', minPrice)
  .lte('price', maxPrice)
  .in('category', selectedCategories)
  .in('source', selectedMarketplaces)
  .gte('rating', selectedRating)

  let { data: products } = await supabase
  .from('products')
  .select('*')
  .eq('category', category)
  .is('image', null)
  .gte('price', minPrice)
  .lte('price', maxPrice)
  .in('category', selectedCategories)
  .in('source', selectedMarketplaces)
  .gte('rating', selectedRating)

  return [...priorityProducts, ...products]
}

const getProductsByTitle = async (searchString, filters) => {
  const {
    minPrice,
    maxPrice,
    selectedCategories,
    selectedMarketplaces,
    selectedRating
  } = filters;

  let { data: priorityProducts } = await supabase
  .from('products')
  .select('*')
  .ilike('title', `%${searchString}%`)
  .not('image', 'is', null)
  .gte('price', minPrice)
  .lte('price', maxPrice)
  .in('category', selectedCategories)
  .in('source', selectedMarketplaces)
  .gte('rating', selectedRating)

  let { data: products } = await supabase
  .from('products')
  .select('*')
  .ilike('title', `%${searchString}%`)
  .is('image', null)
  .gte('price', minPrice)
  .lte('price', maxPrice)
  .in('category', selectedCategories)
  .in('source', selectedMarketplaces)
  .gte('rating', selectedRating)

  return [...priorityProducts, ...products]
}

const getProductsByTopic = async (topic, filters) => {
  const {
    minPrice,
    maxPrice,
    selectedCategories,
    selectedMarketplaces,
    selectedRating
  } = filters;

  let allProducts = []

  const getAllPriorityProductsByTopic = async () => {
    await Promise.all(
      categories[topic].map(async (category) => {
        let { data } = await supabase
          .from('products')
          .select('*')
          .eq('category', category)
          .not('image', 'is', null)
          .gte('price', minPrice)
          .lte('price', maxPrice)
          .in('category', selectedCategories)
          .in('source', selectedMarketplaces)
          .gte('rating', selectedRating)
        allProducts.push(...data);
        return category
      })
    );
  }

  const getAllProductsByTopic = async () => {
    await Promise.all(
      categories[topic].map(async (category) => {
        let { data } = await supabase
          .from('products')
          .select('*')
          .eq('category', category)
          .is('image', null)
          .gte('price', minPrice)
          .lte('price', maxPrice)
          .in('category', selectedCategories)
          .in('source', selectedMarketplaces)
          .gte('rating', selectedRating)
        allProducts.push(...data);
        return category
      })
    );
  }

  await getAllPriorityProductsByTopic();
  await getAllProductsByTopic();

  console.log(allProducts);

  return allProducts;
}

export const getProductsByQueries = async (queries, filters) => {
  const { query: searchString, category = '', topic } = queries;
  
  let allProducts = []

  if (!!topic) {
    console.log('called');
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

  console.log(groupedProducts);

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

  console.log(currentProduct);
  console.log(productsByCategory);

  const similarProducts = productsByCategory
    .map(product => {
      return {
        product,
        similarityScore: stringSimilarity.compareTwoStrings(currentProduct.title, product.title)
      }
    })
    .filter(product => product.similarityScore >= 0.7)
    .sort((a, b) => b.similarityScore - a.similarityScore)

  console.log(similarProducts);
  
  return similarProducts;
}

const defaultFilter = {
  minPrice: 0,
  maxPrice: Math.pow(10,10),
  selectedCategories: getAllCategories(),
  selectedMarketplaces: allMarketplaces,
  selectedRating: 0
}

export const getJobsByQueries = async (queries) => {
  const { query: searchString, minPrice, maxPrice } = queries;
  const getAllId = async () => {
    const searchByString = !!searchString || searchString === '' ? db.collection('jobs')
      .orderBy('title')
      .startAt(searchString)
      .endAt(searchString + '\uf8ff')
      .get()
      : undefined;
    const searchByMinPrice = !!minPrice ? db.collection('jobs')
      .where('fee', '>=', parseInt(minPrice))
      .get()
      : undefined;
    const searchByMaxPrice = !!maxPrice ? db.collection('jobs')
      .where('fee', '<=', parseInt(maxPrice))
      .get()
      : undefined;

    const [stringSnapshot, minPriceSnapshot, maxPriceSnapshot] = await Promise.all([
      searchByString,
      searchByMinPrice,
      searchByMaxPrice
    ]);

    const searchByStringArray = !!stringSnapshot ? stringSnapshot.docs : [];
    const searchByMinPriceArray = !!minPriceSnapshot ? minPriceSnapshot.docs : [];
    const searchByMaxPriceArray = !!maxPriceSnapshot ? maxPriceSnapshot.docs : [];
        
    const allSearch = [searchByStringArray, searchByMinPriceArray, searchByMaxPriceArray]
      .filter(snapshot => snapshot.length > 0);

    const responses = _.intersectionBy(...allSearch, 'id');

    const data = responses.map(doc => doc.id);
    return data;
  }
  const allId = await getAllId();
  const getAllPost = async (jobIds) => {
    return Promise.all(
      jobIds.map(async (jobId) => {
        const jobPost = await getJobById(jobId)
        const imageUrl = await getImageByJobId(jobId)
        const jobRating = getJobRatingByRatingList(jobPost.ratings || {});
        return { ...jobPost, imageUrl, jobRating };
      })
    );
  };
  const allJobs = await getAllPost(allId);
  return allJobs;
}

export const getUserById = async (userId) => {
  const response = await db.collection('users').doc(userId).get();
  const responseId = response.id;
  const responseData = response.data();
  return { user_id: responseId, ...responseData };
}

export const getJobById = async (jobId) => {
  const response = await db.collection('jobs').doc(jobId).get();
  const responseId = response.id;
  const responseData = response.data();
  return { job_id: responseId, ...responseData };
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

export const getJobProviderByJobId = async (jobId) => {
  const job = await getJobById(jobId);
  return job.provider;
}

export const createRequestPost = async (requestData) => {
  const currentUser = await fetchCurrentUser();
  const jobProvider = await getJobProviderByJobId(requestData.job_id);
  await db.collection('requests').add({
    ...requestData,
    requester: {
      id: currentUser.user_id,
      name: currentUser.name
    },
    provider: jobProvider,
    status: 'WAITING-CONFIRMATION'
  });
}

export const getRequestById = async (requestId) => {
  const response = await db.collection('requests').doc(requestId).get();
  const responseId = response.id;
  const responseData = response.data();
  return { request_id: responseId, ...responseData };
}

export const updateRequestStatusNextStage = async (requestId, status) => {
  const updatedStatus = {
    'WAITING-CONFIRMATION': 'WAITING-PAYMENT',
    'WAITING-PAYMENT': 'WAITING-PROGRESS',
    'WAITING-PROGRESS': 'IN-PROGRESS',
    'IN-PROGRESS': 'DONE',
  }
  await db.collection('requests').doc(requestId).update({ status: updatedStatus[status] })
}

export const updateRequestStatusToRejected = async (requestId) => {
  await db.collection('requests').doc(requestId).update({ status: 'REJECTED' })
}

export const getRequestsByStatus = async (user_id, status, role='business') => {
  const getAllRequestsAsBusiness = async () => {
    const response = await db.collection('requests')
    .where('requester.id', '==', user_id)
    .get();
    return response;
  }

  const getRequestsAsBusinessByStatus = async () => {
    const response = await db.collection('requests')
    .where('status', '==', status)
    .where('requester.id', '==', user_id)
    .get();
    return response;
  }

  const getAllRequestsAsService = async () => {
    const response = await db.collection('requests')
    .where('provider.id', '==', user_id)
    .get();
    return response;
  }

  const getRequestsAsServiceByStatus = async () => {
    const response = await db.collection('requests')
    .where('status', '==', status)
    .where('provider.id', '==', user_id)
    .get();
    return response;
  }

  const getAllIds = async () => {
    const data = status === 'ALL' ?
    (role === 'business' ? await getAllRequestsAsBusiness() : await getAllRequestsAsService()) :
    (role === 'business' ? await getRequestsAsBusinessByStatus() : await getRequestsAsServiceByStatus()); 

    const requests = data.docs.map(doc => {
      const responseId = doc.id;
      const responseData = doc.data();
      return { request_id: responseId, ...responseData }
    });

    const requestIds = requests.map(doc => ({request_id: doc.request_id, job_id: doc.job_id}));
    return requestIds
  }

  const allIds = await getAllIds();

  const getAllRequests = async (requestIds) => {
    return Promise.all(
      requestIds.map(async (requestId) => {
        const { request_id, job_id } = requestId;
        const request = await getRequestById(request_id);
        const imageUrl = await getImageByJobId(job_id);
        return { ...request, imageUrl };
      }));
  };
  const allRequests = await getAllRequests(allIds);
  return allRequests;
}

export const getWishlistByCurrentUserId = async () => {
  const currentUser = await fetchCurrentUser();
  const response = await db.collection('wishlists').doc(currentUser.user_id).get();
  const responseId = response.id;
  const responseData = response.data();
  return { wishlist_id: responseId, ...responseData };
}

export const addToWishlist = async (jobId) => {
  const currentUserWishlist = await getWishlistByCurrentUserId();
  const { user_id, wishlist } = currentUserWishlist;
  const tempWishlist = wishlist;
  tempWishlist.push(jobId);
  const newWishlist = await db.collection('wishlists').doc(user_id).update({
    wishlist: tempWishlist
  });
  return newWishlist;
}

export const removeFromWishlist = async (jobId) => {
  const currentUserWishlist = await getWishlistByCurrentUserId();
  const { user_id, wishlist } = currentUserWishlist;
  const tempWishlist = wishlist.filter(job => job !== jobId);
  const newWishlist = await db.collection('wishlists').doc(user_id).update({
    wishlist: tempWishlist
  });
  return newWishlist;
}

export const rateJob = async (rating, jobId, requestId) => {
  let ratingFromRequest = {}
  ratingFromRequest[requestId] = rating;

  const job = await db.collection('jobs')
    .doc(jobId)
    .get();
  await db.collection('requests')
    .doc(requestId)
    .update({rating});
  await db.collection('jobs')
    .doc(jobId)
    .update({
      ratings: !!job.ratings ? {
          ...job.ratings,
          ...ratingFromRequest
        } : {
          ...ratingFromRequest
        }
    });
}

export const getJobRating = async (jobId) => {
  const response = await db.collection('jobs').doc(jobId).get();
  const data = response.data();
  const ratingList = data.ratings || {};
  let totalRating = 0;
  for (const raterId in ratingList){
    totalRating = totalRating + ratingList[raterId]
  }
  const rating = totalRating / Object.keys(ratingList).length;
  const length = Object.keys(ratingList).length
  return { rating, length }
}

