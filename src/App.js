import {useEffect, lazy, Suspense} from 'react';
import {Switch, Route, BrowserRouter as Router} from 'react-router-dom';
import * as routerData from "^/Config/routes.json";
import {useStartup} from '^/Services/useCustomHooks';

const importer = ({component}) =>
  lazy(() => import(`^/Pages/${component}`));

// Switch must immediately precede the Routes
const AllRoutes = ({routes}) => <Switch>{routes}</Switch>

const App = ({service, name}) => {
  const {state, stateDispatch, cStrings} = useStartup(service, {}, name);

  const promisedRoutes = ({routes}) => routes.map((entry, idx) => {
    const props = {...entry, component:importer(entry), key:[idx, entry.path].join('-')};
    return <Route {...props} />
  });

  const setRoutes = () => {
    Promise.all(promisedRoutes(routerData.default)).then(routes => {
      stateDispatch({routes});
    })
  };

  useEffect(() => setRoutes(),[]);
  const {routes} = state;

  return(
    <Router>
      <Suspense fallback={cStrings.fallback}>
        <AllRoutes routes={routes} />
      </Suspense>
    </Router>
  );
}

App.defaultProps = {
  name: App.name,
  service: 'utils'
};

export default App;
