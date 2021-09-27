const checkoutName = 'checkout'
const schema = {
  customerID: undefined,
  shipping: {
    selected: undefined,
    cost: undefined,
  },
  payment: {
    selected: undefined,
    cost: undefined,
  },
  totals: {
    subtotal: undefined,
  }
}

const getTokenName = () => checkoutName;

const setCheckout = (data=schema) => {
  data.ts = Date.now();
  const checkoutData = JSON.stringify(data);
  localStorage.setItem(checkoutName, checkoutData);
  PubSub.publish(getTokenName(), true);
  return data;
}

const getCheckout = () => initialize();

// Interface Methods
export const initialize = () => {
  let stored;
  try {
    stored = JSON.parse(localStorage.getItem(checkoutName));
    if(!stored) throw 'Empty currency';
  } catch(e) {
    stored = setCheckout();
  }
  return stored;
}

export const change = ({selected}) => {
  const currency = getCheckout();
  if(!currency.exchange[selected]) return;
  currency.selected = selected;
  return setCheckout(currency);
}

export const getList = () => {
  const {selected, exchange} = getCurrency();
  return {
    selected,
    exchange: Object.keys(exchange)
  };
}

const isLoggedIn = () => getCheckout().customerID;
const getShipping = () => getCheckout().shipping;
const setShipping = (shipping) => {
  const checkout = getCheckout();
  chechout.shipping = shipping;
  checkout.ts = Date.now();
  const checkoutData = JSON.stringify(checkout);
  localStorage.setItem(checkoutName, checkoutData);
  PubSub.publish(getTokenName(), true);
  return data;
}

const getPayment = () => getCheckout().payment;
const setPayment = (payment) => {
  const checkout = getCheckout();
  chechout.payment = payment;
  checkout.ts = Date.now();
  const checkoutData = JSON.stringify(checkout);
  localStorage.setItem(checkoutName, checkoutData);
  PubSub.publish(getTokenName(), true);
  return data;
}

const checkout = {
  isLoggedIn,
  getShipping,
  setShipping,
  getPayment,
  setPayment,
  initialize,
  getTokenName
}

export default checkout;