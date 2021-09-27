const cacheName = 'server-cache'
const getTokenName = () => cacheName;

const initialize = () => {
  let stored;
  try {
    stored = JSON.parse(localStorage.getItem(cacheName));
    if(!stored) throw 'Empty Cache'
  } catch(e) {
    stored = setCache();
  }
  return stored;
}

const getCache = () => initialize();
const get = id => getCache()[id];

const setCache = (data={}) => {
  const cachedData = JSON.stringify(data);
  localStorage.setItem(cacheName, cachedData);
  return data;
}

const insert = (id, data) => {
  const cachedData = getCache();
  delete data._rev;
  cachedData[id] = data;
  return setCache(cachedData);
}

const insertDelayed = async (id, data) => {
  const result = await data.json();
  insert(id, result);
  return result;
}

const serverCache = {
  getTokenName,
  initialize,
  get,
  insert,
  insertDelayed
}

export default serverCache;