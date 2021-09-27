import {useStartup, useSequence, useDefined, usePubSub} from '^/Services/useCustomHooks'
import AlertMessage from '%/Common/AlertMessage'

const act = {
  getMessages: {
    type: "getMessages"
  },
  clearMessages:  {
    type: "setMessages",
    data: []
  },
  setMessages: data => ({
    type: "setMessages",
    data
  })
};

const DisplayMessages = ({messages}) => <>
  {messages && messages.map((entry, index) =>
    <AlertMessage key={index} color={entry.type} trigger={Date.now()}>{entry.msg}</AlertMessage>
  )}
</>

const Messages = ({service, name, children, location}) => {
  const {state, stateDispatch, apiDispatch, view} = useStartup(service, {messages:[]}, name);
  const {messages, trigger} = state;

  const update = (name, message) => {
    const savedMessages = [];
    const path = location.pathname;
    const entries = Array.isArray(message)?message:[message];

    const allMessages = entries.filter(entry => {
      if(typeof entry === 'object' && entry.page && entry.page !== path) {
        savedMessages.push(entry);
        return false;
      }
      return true;
    })

    const messages = allMessages.map(entry => {
      if(typeof entry === 'string') {
        return {type: 'danger', msg: entry};
      }
      return entry;
    })

    if(savedMessages.length > 0) {
      view.savedMessages = savedMessages;
      stateDispatch({trigger: JSON.stringify(savedMessages)});
    } else if(messages.length > 0) {
      stateDispatch({messages});
    }
  }

  usePubSub( () => {
    const tokenName = Promise.resolve('messages');
    return [
      [tokenName, update]
    ]
  });

  useDefined([
    [apiDispatch, act.setMessages(view.savedMessages)],
  ],[trigger])

  useSequence([
    [apiDispatch, act.getMessages, messages => ({messages})],
    [stateDispatch],
    [apiDispatch, act.clearMessages],
  ],[]);

  return(<>
    <DisplayMessages messages={messages} />
    <div>{children}</div>
  </>);
}

Messages.defaultProps = {
  name: Messages.name,
  service: 'messages',
  location
}

export default Messages;
