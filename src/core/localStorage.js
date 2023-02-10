export async function fetchData(key) {
   return localStorage.getItem(key);
}

export async function setData(key, value) {
   localStorage.setItem(key, value);
}