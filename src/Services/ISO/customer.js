const customerLabel = 'customer'

const initialize = () => {
  let stored;
  try {
    stored = JSON.parse(localStorage.getItem(customerLabel));
    if(!stored) throw 'No Customer'
  } catch(e) {
    stored = setCustomer();
  }
  return stored.cData || {};
}

const getTokenName = () => customerLabel;
const getCustomer = () => initialize();

const setCustomer = (data={}) => {
  const cInfo = {
    ts: Date.now(),
    cID: data.cID,
    cData: data
  }
  const customerData = JSON.stringify(cInfo);
  localStorage.setItem(customerLabel, customerData);
  PubSub.publish(getTokenName(), true);
  return data;
}

const unsetCustomer = () => {
  const data = {ts: Date.now()};
  const customerData = JSON.stringify(data);
  localStorage.setItem(customerLabel, customerData);
}

const isLoggedIn = () => getCustomer().cID;

const customer = {
  getTokenName,
  initialize,
  isLoggedIn,
  getCustomer,
  setCustomer,
  unsetCustomer
};

export default customer;
