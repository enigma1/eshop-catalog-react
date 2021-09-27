const messagesLabel = 'messages'
const getTokenName = () => messagesLabel;

const initialize = () => {
  let stored;
  try {
    stored = JSON.parse(localStorage.getItem(messagesLabel));
    if(!stored) throw 'No Messages'
  } catch(e) {
    stored = setMessages();
  }
  return stored.mData?stored.mData:[];
}

const getMessages = () => initialize();
const setMessages = (data=[]) => {
  if(data && !Array.isArray(data)) {
    throw `Error: invalid data type on setMessages got ${JSON.stringify(data)}`
  }
  const mInfo = {
    ts: Date.now(),
    mData: data || []
  }
  const messagesData = JSON.stringify(mInfo);
  localStorage.setItem(messagesLabel, messagesData);
  PubSub.publish(getTokenName(), []);
  return data;
}

const addMessages = (data) => {
  if(!Array.isArray(data)) {
    throw `Error: invalid data type on addMessages got ${data}`
  }
  const currentList = getMessages();
  const updatedList = [...currentList, ...data]
  setMessages(updatedList);
}

const messages = {
  getTokenName,
  addMessages,
  getMessages,
  setMessages,
  initialize
};

export default messages;