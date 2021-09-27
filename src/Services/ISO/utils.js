import {getItem as getConfigItem} from './config'

const utilsLabel = 'utils'

const getTokenName = () => utilsLabel;

const comparisonTypes = {
  jsonCompare: (a,b) => JSON.stringify(a)===JSON.stringify(b),
  keysCompare: (a,b) => {
    const ak = Object.keys(a).sort();
    const bk = Object.keys(b).sort();
    return JSON.stringify(ak)===JSON.stringify(bk)
  },
  shallowCheckFromLeft: (a,b) => {
    return Object.entries(a).every((entry, key) => {
      return (b[key] === entry);
    })
  }
};
const compareObjects = (a,b, type=jsonCompare) =>
  comparisonTypes[type]?comparisonTypes[type](a,b):false;

const getRandomID = ({selection='a#', size=16}) => {
  const patterns = {
    'a': 'abcdefghijklmnopqrstuvwxyz',
    'A': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    '#': '0123456789',
    '-': '-_',
    '!': '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\',
    'x': '0123456789abcdef',
    'X': '0123456789ABCDEF',
    '0': '01',
    'd': Date.now()
  }

  let result = '';
  let combo = [...selection].map(entry => patterns[entry]);
  let comboString = combo.join('');
  for(let i = 0; i<size; i++) {
    result += comboString[Math.floor(Math.random() * (i?comboString.length:combo[0].length))];
  }
  return result;
}

const getParamsFromQuery = (query, param=null) => {
  const result = query.slice(1).split('&').reduce((acc, s) => {
    const [k, v] = s.split('=')
    return Object.assign(acc, {[k]: v})
  }, {});
  if( param ) {
    return result[param];
  }
  return result;
}

const isValidEmail = ({email, min, max}) => {
  if( typeof email !== 'string'||
    email.length < min ||
    email.length > max
  ) return false;

  const filterChars = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
  const matches = email.match(filterChars);
  return Array.isArray(matches)?matches[0]:false;
}

const isValidName = ({name, min, max}) => {
  if(
    typeof name !== 'string'||
    name.length < min ||
    name.length > max
  ) return false;

  if(name.length < min || name.length > max) return false;

  const filterChars = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")/
  const matches = name.match(filterChars);
  return Array.isArray(matches)?true:false;
}

const isValidPassword = ({password, min, max}) => {
  return(
    typeof password === 'string' &&
    password.length >= min &&
    password.length <= max
  );
}

const safeStringFiltering = (s, r='-') => {
  if(!s) return s;
  const filterChars = /([^a-z0-9-_]+)/gi;
  return s.replace(filterChars, r);
}

const getUniqueID = (prefix, sep='*') => {
  return [prefix, Date.now()].filter(Boolean).join(sep);
}

const validateImages = ({images, name, id}) => {
  const {imagesServer} = getConfigItem('mediaServers');
  const notFoundFile = "/images/image-not-available.jpg";

  if(!Array.isArray(images) || !images.length) {
    return [{src: `${imagesServer}${notFoundFile}`, alt: name}];
  }

  for(let i=0; i<images.length; i++) {
    if(!images[i].src) images[i].src = notFoundFile;
    if(!images[i].alt) images[i].alt = name;
    images[i].src = `${imagesServer}${images[i].src}`;
  }
  return images;
}

const getLocationID = ({id}) => {
  return safeStringFiltering(getParamsFromQuery(location.search, id))
}
const splitUniqueID = (id, index=0, sep='*') => id.split(sep)[index];


// const convertString = ({str, params}) => {
//   const matchPattern=/\$\{(\w+)\}/g;
//   const matches = str.matchAll(matchPattern);
//   const segments = [];
//   let offset=0;
//   for (const match of matches) {
//     segments.push(str.substr(offset, match.index))
//     segments.push(params[match[1]])
//     offset = match.index + match[0].length;
//   }

//   offset<str.length && segments.push(str.substr(offset));

//   // console.log('-----', segments.join(""))
//   return segments.join("");
// }

const convertStrings = (stringsArray, matchPattern=/\$\{(\w+)\}/g) => {
  if(!Array.isArray(stringsArray)) throw `Error: invalid data type on convertStrings got ${data}`;

  const resultArray = stringsArray.map(({str, params}) => {
    const matches = str.matchAll(matchPattern);
    const segments = [];
    let offset=0;
    for (const match of matches) {
      segments.push(str.substr(offset, match.index-offset))
      segments.push(params[match[1]])
      offset = match.index + match[0].length;
    }
    offset<str.length && segments.push(str.substr(offset));
    return segments.join("");

  });
  return resultArray;
}

// const myFunc = () => '<a href="/specials">specials</a>';
// const test = "Welcome back ${name1} to our basics this time ${name2} offers advanced tutorials enabling ${users} to succeed";
// console.log('----->>', convertStrings([
//   {str: test, params: {name1: 'moi', name2: 'toi', users: myFunc()}}
// ] ));
// throw 'stop';

export default {
  getTokenName,
  compareObjects,
  getRandomID,
  getUniqueID,
  validateImages,
  getLocationID,
  splitUniqueID,
  getParamsFromQuery,
  isValidEmail,
  isValidPassword,
  isValidName,
  convertStrings
}
