export const getDateStringFromTimestamp = (timestamp, simplified = false) => {
  const date = new Date(timestamp.seconds * 1000);
  
  const monthsInIndonesia = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
  ];
  const monthsInIndonesiaSimplified = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des'
  ];

  return `${date.getDate()} ${simplified ?monthsInIndonesiaSimplified[date.getMonth()] : monthsInIndonesia[date.getMonth()]} ${date.getFullYear()}`;
}

export const getYearFromTimestamp = (timestamp) => {
  const date = new Date(timestamp.seconds * 1000);
  return date.getFullYear();
}