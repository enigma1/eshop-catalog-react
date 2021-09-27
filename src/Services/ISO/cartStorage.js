import convert from 'convert-units';
import {getItem} from '^/Config/';
import api from './api';
import utils from './utils'

const cartName = 'shopping-cart'

const initialize = () => {
  let stored;
  try {
    stored = JSON.parse(localStorage.getItem(cartName));
    if(!stored) throw 'Empty cart'
  } catch(e) {
    stored = setCart();
  }
  return stored;
}

const getTokenName = () => 'cart';

const getCart = () => initialize();

const setCart = (data={contents:{}}) => {
  data.ts = Date.now();
  const cartData = JSON.stringify(data);
  localStorage.setItem(cartName, cartData);
  PubSub.publish(getTokenName(), true);
  return data;
}

const makeSignature = () => utils.getRandomID('a#', 12);
const addCartItem = async ({id, price, qty=1, attrs={}}) => {
  // attrs = {color: 'red', size: 'small'};
  let existingSignature;
  const signature = JSON.stringify(Object.entries(attrs).sort((i,j) => {
    return [...i].join('-') > [...j].join('-');
  }));

  const existing = getCart();
  for( const i in existing.contents) {
    if(existing.contents[i].id === id && existing.contents[i].signature === signature) {
      existingSignature = i;
      break;
    }
  }

  if(existingSignature) {
    existing.contents[existingSignature].qty =
      +qty + +existing.contents[existingSignature].qty;
  } else {
    const item = await api.getByID({id});
    if(item.error || !item.id) {
      return {error: true, text: 'invalid response received'};
    }
    const images = utils.validateImages(item);
    const uid = makeSignature(id, attrs);
    existing.contents[uid] = {
      id: item.id,
      name: item.name,
      image: images && images[0],
      attrs,
      qty: +qty,
      price: +price,
      fields: item.fields || {},
      signature
    };
  }
  //delete existing.id;
  return setCart(existing);
}

const addCartMulti = (items) => {
  for(let i=0; i<items.length; i++) addCarttem(items[i])
}

const deleteCartItem = ({uid}) => {
  const existing = getCart();
  if(!existing.contents[uid]) return false;

  delete existing.contents[uid];
  return setCart(existing);
}

const getContents = () => getCart().contents;

const changeQuantity = ({uid, qty}) => {
  const existing = getCart();
  if(!existing.contents[uid]) return false;
  existing.contents[uid].qty = (+qty > 1)?parseInt(+qty):1;
  return setCart(existing);
}

const sortUp = (a,b) => a-b;
const sortDown = (a,b) => b-a;

const getTotalDetails = () => {
  const {fields} = getItem(cartName);
  const contents = getContents();
  let [count, total, unique, totalWeight] = Array(4).fill(0);
  const volume = Array(3).fill(0);

  for(const [key, value] of Object.entries(contents) ) {
    total += +value.qty*+value.price;
    count += +value.qty;
    unique++;
    const {weight, dimensions} = value.fields;
    if(weight && weight.unit != fields.weight.unit) {
      totalWeight += convert(weight.value)
        .from(weight.unit)
        .to(fields.weight.unit)
    }
    if(dimensions) {
      const xyz = dimensions.value.split('x').map(dim => +dim*+value.qty);
      xyz.sort(sortDown);
      volume.sort(sortUp);
      const [x,y,z] = xyz;
      if(dimensions.unit != fields.dimensions.unit) {
        volume[0] += convert(x).from(dimensions.unit).to(fields.dimensions.unit)
        volume[1] += convert(y).from(dimensions.unit).to(fields.dimensions.unit)
        volume[2] += convert(z).from(dimensions.unit).to(fields.dimensions.unit)
      } else {
        volume[0] += x
        volume[1] += y
        volume[2] += z
      }
    }
  }
  return {
    count, total, unique,
    totalWeight, weightUnit: fields.weight.unit,
    totalVolume: volume.join('x'), dimensionsUnit: fields.dimensions.unit
  };
}

const cartStorage = {
  getTokenName,
  initialize,
  getTotalDetails,
  getContents,
  addCartItem,
  deleteCartItem,
  addCartMulti,
  changeQuantity,
};

export default cartStorage;
