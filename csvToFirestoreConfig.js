module.exports = {
  path: 'indonesia_marketplace_kitchenware.csv', // Your CSV file name
  firebase: {
    credential: 'serviceAccount.json', // Your service account file name
    collection: 'products', // target Collection in Firestore
  },
  mapper: (dataFromCSV) => { // Mapper Method as optional field
    return dataFromCSV // Return data for saving in Firestore
  }
}