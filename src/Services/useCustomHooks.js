import {useReducer as reactReducer, useEffect, useRef, useContext} from 'react';
import {getContext, getStore} from '^/Services/storeContext';
import {Cfg, CStrings} from '^/Config/';

const monoDeps = (deps) => {
  if( !deps || !Array.isArray(deps) || !deps.length) return [];
  return deps.map(item => typeof item ==='object'?JSON.stringify(item):item);
}

// Public functions
export const isTrueObject = inp => typeof inp === 'object' && !Array.isArray(inp);
export const isStringArray = inp => typeof inp === 'string' || Array.isArray(inp);

export const useServiceContext = (input={}) => {
  let result, context, initialState;

  if(isTrueObject(input)) {
    context = 'common'
    initialState = input;
    result = getContext(context, initialState || {}, initialState && (() => initialState));
  } else {
    context = Array.isArray(input)?input:[input];
    const contextMap = context.map(entry => getContext(entry));
    result = contextMap.length>1?contextMap:contextMap[0];
  }
  return result;
}

// executes before first render
export const useOnce = (f) => {
  const rendered = useRef(false);
  if(!rendered.current) {
    rendered.current = true;
    f();
  }

  // const [rendered, setInitialRender] = useState(false);
  // useEffect(() => setInitialRender(true), [rendered]);
  // !rendered && f();
}

export const useMountEffect = (mount, f=()=>{}, types=[]) => {
  const deps = monoDeps(types);
  useEffect(() => {
    mount.current = true;
    f();
    return () => {
      mount.current = false
    };
  }, deps);
};

export const usePubSub = (generate) => {
  const pubTokens = useRef([]);
  useEffect(() => {
    let tunnels = generate();
    !Array.isArray(tunnels[0]) && (tunnels = [tunnels]);
    for(const[pToken, handler] of tunnels) {
      pToken && pToken.then(token => {
        pubTokens.current.push(
          PubSub.subscribe(token, handler)
        );
      })
    }
    return () => {
      for(const token of pubTokens.current) {
        PubSub.unsubscribe(token);
      };
    }
  }, []);
}

const useMount = () => {
  const mount = useRef(true);
  useEffect(() => {
    return () => {
      mount.current = false
    };
  }, []);
  return mount;
};

const defaultReducer = (reducer, initialState, mount) => {
  const [state, setState] = reactReducer(reducer, initialState);
  const error = `Component no longer mounted`;
  const dispatch = (action) => mount.current && setState(action);
  return mount.current?[state, dispatch]:[{error},()=>({error})];
}

export const useReducer = (reducer, initialState) => {
  const mount = useMount();
  if(initialState) return defaultReducer(reducer, initialState, mount);

  return action => {
    if(!action) throw `Error: action passed is undefined`;
    if(!mount.current) {
      const error = `Component no longer mounted, cannot perform action ${action.type}`;
      return () => Promise.resolve({error});
    }
    const dispatcherPromise = new Promise((rs) => action.resolver = rs);
    reducer(action);
    return dispatcherPromise.then(data => data);
  }
}

//export const useView = (schema) => useRef(schema);
export const useCfg = (config) => useContext(Cfg)[config] || {};
export const useStrings = (section) => useContext(CStrings)[section] || {};
export const useStartup = (context='common', schema={}, params, view={}) => {

  // Initialize state
  const [state, stateDispatch] = useServiceContext(
    isTrueObject(context)?context:schema
  );

  // Initialize API
  const apiDispatch = isStringArray(context)
    ?useServiceContext(context)
    :()=>Promise.resolve('Nothing todo - No API service was configured');

  // Initialize View
  const rendered = useRef(false);
  if(!rendered.current) {
    rendered.current = {
      view: isTrueObject(context)?schema:view
    }
  }

  const inpParams = (typeof params === 'string')
    ?{config: params, strings: params}
    :{config: params && params.config, strings: params && params.strings}

  const {config, strings} = inpParams;

  return {
    state,
    stateDispatch,
    apiDispatch: Array.isArray(apiDispatch)?undefined:apiDispatch,
    middleware: Array.isArray(apiDispatch)?apiDispatch:[],
    view: rendered.current.view,
    cfg: useCfg(config),
    cStrings: useStrings(strings)
  };
}

/*
export const useStartup = (context='common', schema={}, params) => {
  // Initialize state
  const [state, stateDispatch] = useServiceContext(
    isTrueObject(context)?context:undefined
  );

  // Initialize API
  const apiDispatch = isStringArray(context)
    ?useServiceContext(context)
    :()=>Promise.resolve('Nothing todo - No API service was configured');

  // Initialize View
  const rendered = useRef(false);
  if(!rendered.current) {
    rendered.current = {
      view: schema
    }
  }

  const inpParams = (typeof params === 'string')
    ?{config: params, strings: params}
    :{config: params && params.config, strings: params && params.strings}

  const {config, strings} = inpParams;

  return {
    state,
    stateDispatch,
    apiDispatch: Array.isArray(apiDispatch)?undefined:apiDispatch,
    middleware: Array.isArray(apiDispatch)?apiDispatch:[],
    view: rendered.current.view,
    cfg: useCfg(config),
    cStrings: useStrings(strings)
  };
}
*/

export const resolveRequest = (dispatch, api) => {
  return (async (api) => await dispatch(api))(api);
}

export const dispatchSequencer = async (requests) => {
  let result, lastResult, gotoStep;
  for(const [dispatch, rqData, callback, anchor] of requests) {

    if(gotoStep && gotoStep !== anchor) continue;
    if(typeof anchor === 'boolean' && !anchor) continue;

    const params = rqData || lastResult;

    if(dispatch) {
      result = callback
      ?(await callback(await dispatch(params)) || {})
      :(result = await dispatch(params) || {});
    } else if(callback) {
      result = callback(lastResult);
    }

    const {abort, goto} = lastResult = result || {};

    if(abort) break;
    gotoStep = goto;
  }
}

export const useSequenceOnce = (requests) => {
  const rendered = useRef(false);
  if(!rendered.current) {
    rendered.current = true;
    dispatchSequencer(requests);
  }
};

export const useSequence = (requests, types = []) => {
  const deps = monoDeps(types);
  useEffect(()=> {
    dispatchSequencer(requests);
  }, (types !== 'render')?deps:undefined);
};

export const useDefined = (requests, deps, condition) => {
  useEffect(() => {
    if(deps.every((value) => value !== condition)) {
      dispatchSequencer(requests);
    }
  }, deps);
}

export const useEffectJSON = (f, types = []) => {
  const deps = monoDeps(types);
  useEffect(()=> {
    f();
  }, deps);
};
