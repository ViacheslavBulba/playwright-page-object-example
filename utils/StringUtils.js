export function getDateAndTimeInString() {
  return (new Date()).toLocaleString().replace(/(:|\/)/g, '-').replace(/,/g, '').replace(/\s/g, '_');
}

export function getTime() {
  return new Date().toLocaleTimeString();
}

export function getDate() {
  return (new Date().toLocaleDateString()).replace(/(\/)/g, '_');
}