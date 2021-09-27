import {backEnd} from '^/Config/backEnd';
import serverCache from './serverCache';

const apiLabel = 'api'
const getTokenName = () => apiLabel;

const FIXED_CONNECTION_TIMEOUT = 5000;

let API_CONNECTION_TIMEOUT = FIXED_CONNECTION_TIMEOUT;
const API_PERIODIC_CHECK = 10000;

let periodicTimer = null;

const getConnectionTokenName = () => 'api.connection';


const prepare = (method='GET') => {
  return {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    // credentials: 'include',
    mode: 'cors',
    cache: 'no-cache',
    referrerPolicy: 'no-referrer',
  };
};

const connectionError = path => ({
  json: () => {
    PubSub.publish(getConnectionTokenName(), false);
    let cachedData = serverCache.get(path);
    if(!cachedData) cachedData = {serverError: `No response on ${path}`};
    if(!periodicTimer) periodicTimer = setInterval(checkConnect, API_PERIODIC_CHECK);
    return Promise.resolve(cachedData);
  }
});

const timer = (timeout, resolve, errorParams) => setTimeout((params) => {
  resolve(params);
}, timeout, {...errorParams});

const process = (rq, errorParams, timeout=API_CONNECTION_TIMEOUT) => {
  let timerID = null;
  const timerPromise = new Promise((resolve) => {
    timerID = timer(timeout, resolve, errorParams);
  });
  return Promise.race([fetch(rq), timerPromise]).then( (data) => {
    timerID && clearTimeout(timerID);
    return data;
  });
}

const cachedFetched = path => serverCache.get(path);

const commonFetch = async (path, cache, sCache) => {
  let result = sCache?cachedFetched(path):undefined;
  if(result) return result;

  const rqData = prepare();
  if(cache) delete rqData.cache;
  const fullPath = `${backEnd.url}${path}`;
  const rq = new Request(fullPath, rqData);
  result = await process(rq, connectionError(path));
  return serverCache.insertDelayed(path, result);
  // return await result.json();
  // const result2 = await result.json();
  // return result2;
  //return result.json();
}

const uncachedFetch = async (cmd) => {
  const rqData = prepare();
  const fullPath = `${backEnd.url}${cmd}`;
  const rq = new Request(fullPath, rqData);
  const result = await process(rq, connectionError(cmd), FIXED_CONNECTION_TIMEOUT);
  return await result.json();
}

// Interface methods
const checkConnect = async () => {
  const response = await uncachedFetch(`/test`);
  console.log('checkConnect', response);
  if(response.success) {
    PubSub.publish(getConnectionTokenName(), true);
    clearInterval(periodicTimer);
    periodicTimer = null;
    API_CONNECTION_TIMEOUT = FIXED_CONNECTION_TIMEOUT;
  } else {
    API_CONNECTION_TIMEOUT = 1;
  }

  return response;
}

const commonPost = async(cmd, data) => {
  //console.log('rq', cmd, data);
  const rqData = prepare('POST');
  const fullPath = `${backEnd.url}${cmd}`;
  rqData.body = JSON.stringify(data);
  //console.log(rqData)
  const rq = new Request(fullPath, rqData);
  const result = await process(rq, connectionError(cmd), FIXED_CONNECTION_TIMEOUT);
  return await result.json();
}

// Customer API
const loginCustomer = (data) => commonPost('/login-customer', data);
const createAccount = (data) => commonPost('/create-account', data);
const createAddressBookEntry = (data) => commonPost('/create-address-book-entry', data);

// Products API
const searchInProducts = (data) => commonPost('/search-in-products', data);
const viewShipping = ({cmd, cache=true, sCache=false}) => commonFetch(`/shipping-views/?${cmd}`, cache, sCache);
const viewPayment = ({cmd, cache=true, sCache=false}) => commonFetch(`/payment-views/?${cmd}`, cache, sCache);
const viewTotal = ({cmd, cache=true, sCache=false}) => commonFetch(`/total-views/?${cmd}`, cache, sCache);

const viewManufacturers = ({cmd, cache=true, sCache=false}) => commonFetch(`/manufacturers-views/?${cmd}`, cache, sCache);
const viewCategories = ({cmd, cache=true, sCache=false}) => commonFetch(`/categories-views/?${cmd}`, cache, sCache);
const viewProducts = ({cmd, cache=true, sCache=false}) => commonFetch(`/products-views/?${cmd}`, cache, sCache);
const getByID = ({id, cache=true, sCache=false}) => commonFetch(`/get-by-id/?id=${id}`, cache, sCache);

const api = {
  getTokenName,
  getConnectionTokenName,
  createAccount,
  createAddressBookEntry,
  loginCustomer,
  searchInProducts,
  checkConnect,
  viewManufacturers,
  viewCategories,
  viewProducts,
  viewShipping,
  viewPayment,
  viewTotal,
  getByID
}

export default api;