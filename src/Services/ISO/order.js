import utils from './utils'

const orderLabel = 'order'
const orderID = 'sID';

const initialize = () => {
  let stored;
  try {
    stored = JSON.parse(localStorage.getItem(orderLabel));
    if(!stored) throw 'No order'
  } catch(e) {
    stored = setOrder();
  }
  return stored;
}

const getTokenName = () => orderLabel;
const getOrder = () => initialize();

const setOrder = (data={}) => {
  data.ts = Date.now();
  const orderData = JSON.stringify(data);
  localStorage.setItem(orderLabel, orderData);
  PubSub.publish(getTokenName(), true);
  return data;
}

const getOrderID = () => getOrder().sID;

const order = {
  getTokenName,
  initialize,
  getOrderID,
  getOrder,
  setOrder
};

export default order;
