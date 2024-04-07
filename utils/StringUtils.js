export function getDateAndTimeInString() {
  return (new Date()).toLocaleString().replace(/(:|\/)/g, '-').replace(/,/g, '').replace(/\s/g, '_');
}