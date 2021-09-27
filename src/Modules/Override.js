import {useRef, useContext, useEffect} from 'react';
import {useStartup, usePubSub} from '^/Services/useCustomHooks';
// import SpecialPrice from '%/SpecialPrice';

const Override = React.createContext();

//export const PriceProvider = PriceControl.Provider;
//export const PriceConsumer = PriceControl.Consumer;

const shouldReplace = (props, params) => {
  if(!params) return true;

  let track = Object.assign({}, props);
  const result = params.split('.')
    .reduce((difference, current) => {
      if(!track[current]) {
        difference++;
      } else {
        track = track[current];
      }
      return difference;
    }, 0);

  return result === 0;
}

export const switchComponentFor = (OriginalComponent) => {
  return (props) => {
    const {state, stateDispatch} = useStartup({
      Switcher: OriginalComponent,
      params: OriginalComponent.defaultProps,
      context: useContext(Override) || {},
    });
    const originalNodeRef = useRef();

    const clickHandler = e => {
      console.log("click happened on child's ref", e);
    }

    //!view.context && setContext();
    const changeRemoteComponent = (eventName, context) => {
      //const OverrideComponent = await import(`^/Pages/${name}`);
      //lazy(() => import(`./Pages/${name}`).catch(() => import('^/Pages/Error')));
      //OverrideComponent && context && (view.context = useContext(context));
      //context && (view.context = useContext(context));
      context && stateDispatch({context: useContext(context)});
    }

    const changeComponent = (NewComponent, params) => {
      if(state.Switcher?.name === NewComponent.name) return;
      stateDispatch({
        Switcher: NewComponent,
        params
      })
      //view.Switcher = NewComponent;
      //params && (view.params = params);
      //stateDispatch();
    }

    usePubSub( () => {
      const getToken = Promise.resolve('switchComponent');
      return [
        [getToken, changeRemoteComponent]
      ]
    });

    useEffect( () => {
      //let stateComponent = view.Switcher;
      let stateComponent = state.Switcher;
      const {componentReplacement, extra, replaceWhen} = state.context;
      componentReplacement && shouldReplace(props, replaceWhen) && (stateComponent = componentReplacement);
      changeComponent(stateComponent, extra)
    }, [state.context.componentReplacement && state.context.componentReplacement.name])

    // useEffect( () => {
    //   const cref = originalNodeRef.current;
    //   if( cref.textContent && !cref.onclick) {
    //     console.log('cref', cref)
    //     cref.onclick = (e) => clickHandler(e);
    //   }
    //   //console.log('filtered re-render', originalNodeRef)
    // }, [])

    useEffect( () => {
      const cref = originalNodeRef.current;
      if( cref && !cref.onclick) {
        cref.onclick = (e) => clickHandler(e);
      }
    });

    //const Switcher = () => state.Switcher({...props, nodeRef: originalNodeRef})
    const Switcher = state.Switcher;
    const modedProps = Object.assign({nodeRef: originalNodeRef}, props);
    return <Switcher {...modedProps} />
  }
}

export default Override;
