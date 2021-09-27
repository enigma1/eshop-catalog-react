import {useEffect} from 'react';
import {useStartup} from '^/Services/useCustomHooks';
import {Alert} from '@bootstrap-styled/v4';

const AlertMessage = ({name, color, trigger, children, service, stateInit}) => {
  const {state, stateDispatch, cfg} = useStartup(service, stateInit, name);
  const {timeout} = cfg;
  const persist = (ready) => stateDispatch({ready});

  let timerID = null;
  const startTimer = () => {
    timerID = setTimeout(() => {
      persist(false);
      timerID = null;
    }, timeout);
  }

  useEffect(() => {
    !state.ready && persist(true);
    startTimer();

    return(() => {
      timerID && clearTimeout(timerID);
    })
  }, [trigger])

  return (<>{state.ready &&
    <Alert className="mb-1" onClick={()=>persist(false)} color={color}>{children}</Alert>
  }</>);
}

AlertMessage.defaultProps = {
  name: AlertMessage.name,
  service: 'none',
  stateInit: {isOpen: false}
}

export default AlertMessage;