import {createContext, useState} from 'react';
import api from '!/api';
import * as strings from "^/Config/strings.US.json";

const configName = 'config';

const apiGetConfig = async () => {
  const data = await api.getByID({id: 'config'});
  data.ts = Date.now();
  return data;
};

const getConfig = async () => {
  let stored;
  try {
    const current = JSON.parse(localStorage.getItem(configName));
    if(!current) throw 'Empty storage'
    stored = Promise.resolve(current);
  } catch(e) {
    stored = await apiGetConfig();
    if(stored.id === 'config') {
      localStorage.setItem(configName, JSON.stringify(stored));
    }
  }
  return stored;
}

const buildConfig = async () => {
  const ts = Date.now();
  let stored = await getConfig();
  if(stored.id === 'config' && ts - stored.ts > (3600*1000) ) {
    localStorage.removeItem(configName);
    stored = getConfig();
    //const configData = JSON.stringify(data);
    //localStorage.setItem(configName, configData);
  }
  return stored;
}

let configuration;

const Config = ({children}) => {
  const [ready, setReady] = useState(false);

  if( !ready ) {
    buildConfig().then(data => {
      configuration = data;
      setReady(true);
    });
  }

  return (<>{ready &&
    <CStrings.Provider value={strings.default}>
      <Cfg.Provider value={configuration}>
        {children}
      </Cfg.Provider>
    </CStrings.Provider>
  }</>);
}

export const getItem = (itemName) => {
  let result;
  try {
    const configStorage =JSON.parse(localStorage.getItem(configName))
    result = configStorage[itemName];
  } catch {
    result = {}
  }
  return result;
};

export const CStrings = createContext(strings);
export const Cfg = createContext(configuration);
export default Config;
