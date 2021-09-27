import * as isoServices from '^/Config/isoServices.json';
import {useReducer, isTrueObject} from '^/Services/useCustomHooks';
import utils from '!/utils';

// Interface Services Object (ISO)
const ISO = {};

// Action Handlers
// 1. Default State Handling
// - Passing an empty state causes a render phase
// - Passing a reset request causes a render phase
// - State differences will cause a render phase
// - If callback function returns true skip render phase
// - If callback function returns false do render phase
// Examples:
// StateDispatch() -> forces render phase
// StateDispatch({ready:true}) -> forces render phase
// StateDispatch(data: {ready:true}) ->
//   Compares current/new states and renders only if different (shallow object compare on payload part)
// StateDispatch({type: callbackRender(currentState, newState)}) ->
//   true = overrides any other state setting, skips state merge and skips render phase
//   false = for a render phase regardless of state difference.
const defaultActionHandler = () => (state, action) => {
  if(!action) return {...state};

  const {type, data} = action;
  const payload = (!type && !data)
    ?Object.assign({}, action)
    :Object.assign({}, data);

  // If state reset is requested reset with payload initialization
  if(type === 'reset') return {...payload};

  // Check if render-phase must be skipped callback and shallow check
  if(
    (typeof type === 'function' && type(state, payload)) ||
    (data && utils.compareObjects(payload, state, 'shallowCheckFromLeft'))
  ) {
    return state;
  }

  // Render with full state update
  return {...state, ...payload};
}

// 2. API/middleware handling
const serviceActionHandler = (entry) => (action) => {
  const {ifc} = entry;
  const {type, data} = action;
  if(ifc && type && !ifc[type]) throw `function [${type}] not defined in service [${ifc.getTokenName()}]. Make sure you are using the right dispacher and the action is spelled correctly`
  const params = !data || (isTrueObject(data)?Object.assign({}, data):data);
  action.resolver(
    (ifc && ifc[type])
      //?ifc[type](Object.assign({}, data))
      ?ifc[type](params)
      :undefined
  );
}

// Reducers regular/state and service/API
const defaultReducer = (reducer, state, initialState) => useReducer(reducer, state, initialState);
const serviceReducer = (reducer) => useReducer(reducer);

// Types of reducers
const reducerTypes = {
  statefull: {
    reducer: defaultReducer,
    actionHandler: defaultActionHandler
  },
  ifc: {
    reducer: serviceReducer,
    actionHandler: serviceActionHandler
  },
}

const createReducer = (name) => {
  if(!ISO[name]) {
    name !== 'common' && console.log(`%cwarning: No ISO for service [${name}] found`, 'color: #ffff55')
    ISO[name] = {};
  }
  if(ISO[name].build) return;
  // Process action and context
  const redType = ISO[name].ifc?reducerTypes.ifc:reducerTypes.statefull;
  ISO[name].contextReducer = redType.reducer;
  ISO[name].reducer = redType.actionHandler(ISO[name]);
  ISO[name].build = true;
}

export const getContext = (name, stateSchema, stateFunction) => {
  createReducer(name);
  const {reducer, contextReducer} = ISO[name];
  return contextReducer(reducer, stateSchema, stateFunction);
}

export const getStore = () => ISO;

export const isoImporter = () => {
  const services = isoServices.default;
  const promisedServices = Object.entries(services).map( async service => {
    const data = await import(`^/Services/ISO/${service[1].ifc}`);
    return { [service[0]]: {ifc: data.default}};
  });

  return Promise.all(promisedServices).then(data => {
    data.forEach((entry) => {Object.assign(ISO, entry)})
    return getStore();
  })
}

const storeContext = {
  getContext,
  getStore,
};

export default storeContext;
