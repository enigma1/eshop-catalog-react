const configName = 'config'

export const getItem = (name) => {
  let stored;
  try {
    stored = JSON.parse(localStorage.getItem(configName));
    if(!stored || !stored[name]) throw 'No Config';
  } catch(e) {
    throw 'No Config';
  }
  return stored[name];
}

const config = {
  getItem
};

export default config;
