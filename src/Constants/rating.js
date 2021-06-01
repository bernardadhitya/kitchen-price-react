export const getJobRatingByRatingList = (ratingList) => {
  let totalRating = 0;
  const length = Object.keys(ratingList).length
  if (length === 0) return { rating: 0, length }
  for (const raterId in ratingList){
    totalRating = totalRating + ratingList[raterId]
  }
  const rating = totalRating / Object.keys(ratingList).length;
  return { rating, length }
}