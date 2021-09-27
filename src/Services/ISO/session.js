import utils from './utils'

const sessionLabel = 'session'
const sessionID = 'sID';

const initialize = () => {
  let stored;
  try {
    stored = JSON.parse(localStorage.getItem(sessionLabel));
    if(!stored) throw 'No Session'
  } catch(e) {
    stored = setSession();
  }
  return stored;
}

const getTokenName = () => sessionLabel;
const getSession = () => initialize();

const setSession = (data={}) => {
  data.ts = Date.now();
  const sessionData = JSON.stringify(data);
  localStorage.setItem(sessionLabel, sessionData);
  PubSub.publish(getTokenName(), true);
  return data;
}

const getSessionID = () => getSession().sID;

const session = {
  getTokenName,
  initialize,
  getSessionID,
  getSession,
  setSession
};

export default session;
