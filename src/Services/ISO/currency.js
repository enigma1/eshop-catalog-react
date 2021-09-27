const currencyName = 'currency'

const schema = {
  ts: null,
  selected: 'USD',
  exchange: {
    USD: [1, '$'],
    CAD: [1.33, '$'],
    GBP: [0.77, '\u00a3'],
    EUR: [0.85, '\u20ac'],
    JPY: [105, '\u00a5'],
    CNY: [6.7, '\uffe5']
  }
}

/*
const exchangeServer = 'https://api.exchangeratesapi.io/latest'

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
    const cachedData = {error: `No response on ${path}`};
    return Promise.resolve(cachedData);
  }
});

const updateExchange = async () => {
  const rqData = prepare();
  const {selected} = getCurrency();
  const fullPath = `${exchangeServer}?base=${selected}`;
  const rq = new Request(fullPath, rqData);
  const result = await process(rq, connectionError(fullPath), FIXED_CONNECTION_TIMEOUT);
  return await result.json();
}
*/

const getTokenName = () => 'currency.setCurrency';

const setCurrency = (data=schema) => {
  data.ts = Date.now();
  const currencyData = JSON.stringify(data);
  localStorage.setItem(currencyName, currencyData);
  PubSub.publish(getTokenName(), true);
  return data;
}

const getCurrency = () => initialize();

// Interface Methods
export const initialize = () => {
  let stored;
  try {
    stored = JSON.parse(localStorage.getItem(currencyName));
    if(!stored) throw 'Empty currency';
  } catch(e) {
    stored = setCurrency();
  }
  return stored;
}

export const change = ({selected}) => {
  const currency = getCurrency();
  if(!currency.exchange[selected]) return;
  currency.selected = selected;
  return setCurrency(currency);
}

export const getList = () => {
  const {selected, exchange} = getCurrency();
  return {
    selected,
    exchange: Object.keys(exchange)
  };
}

export const format = ({price, qty=1}) => {
  const {selected, exchange} = getCurrency();
  const current = exchange[selected];
  price = +price*+qty;
  const converted = (price*current[0]).toFixed(2);
  let result = `${current[1]}${converted}${(current[0] !== 1)?''.concat(' ', selected):''}`;
  //current[0] !== 1 && (result += ' '+selected);
  return result;
}

const currency = {
  initialize,
  change,
  getList,
  format,
  getTokenName
}

export default currency;