import {useEffect, useContext} from 'react';
import {useStartup} from '^/Services/useCustomHooks';

const Loading = ({show=true, name, children}) => {
  const {state, stateDispatch, cfg} = useStartup('common', {}, name);
  const {timeout} = cfg;

  useEffect(() => {
    stateDispatch({ready: false});
    const timer = setTimeout(() => {
      stateDispatch({ready: true});
    }, timeout);

    return () => {
      clearTimeout(timer);
    }
  },[show]);

  return (<>
    {state.ready && show &&
    <div className="d-flex justify-content-center h-100">
      <div className="spinner-border text-dark" role="status">
        <span className="sr-only">{children || 'Loading...'}</span>
      </div>
    </div>
    && children
    }
  </>);
}

Loading.defaultProps = {
  name: Loading.name
}

export default Loading;
