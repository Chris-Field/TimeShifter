export function formatDatetimeForTaskArray( datetime ) {
  if (typeof datetime === 'string') {
    datetime = new Date(datetime);
  }
  return (`${zeroPaddedDate(datetime)} at ${zeroPaddedtime(datetime)}`);
}


export function zeroPaddedDate( datetime ) {
  const year = datetime.getFullYear();
  // 0-pad the month; need to add 1 because it's 0-indexed
  const month = ('0' + (datetime.getMonth()+1)).slice(-2);
  // 0-pad the day
  const day = ('0' + datetime.getDate()).slice(-2)

  return (`${year}-${month}-${day}`);
}


export function zeroPaddedtime( datetime ){
  // 0-pad the hour
  const hour = ('0' + datetime.getHours()).slice(-2);
  // 0-pad the minute
  const minute = ('0' + datetime.getMinutes()).slice(-2);
  return (`${hour}:${minute}`);
}