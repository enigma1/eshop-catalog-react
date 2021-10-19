//import React from 'react';
//import ReactDOM from 'react-dom';

import './globals.js';
import {Helmet} from "react-helmet";

import {isoImporter} from '^/Services/storeContext';

import Config from "^/Config/";
import App from './App';
import BootstrapProvider from '@bootstrap-styled/provider/lib/BootstrapProvider';
import webTheme from '^/Style/webTheme';

const Startup = () => {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    isoImporter().then( (data) => {
      Object.entries(data).forEach( entry => {
        const [,service] = Object.entries(entry)[1];
        if(service.ifc.initialize && typeof service.ifc.initialize === 'function' ) {
          service.ifc.initialize();
        }
      });
      setReady(true);
    });
  },[])
  return (<>{ready &&
    <Config>
      <BootstrapProvider theme={webTheme}>
        <App />
        {/*         <React.StrictMode><App /></React.StrictMode> */}
      </BootstrapProvider>
    </Config>
  }</>)
}

const Main = () => {
  if('serviceWorker' in navigator) {
    console.log('Notice: service-worker supported');
  }

  return(<>
    <Helmet>
      <base href="/" />
      <meta charSet="utf-8" />
      <title>The mini health store in ReactJS</title>
      <meta name="description" content="The Mini Health Store in React demostrating e-commerce capabilities" />
      <link rel="stylesheet" type="text/css" href="/bootstrap.min.css" />
      <link rel="stylesheet" type="text/css" href="/styles.css" />
    </Helmet>
    <Startup></Startup>
  </>)
};

// console.log('unstable dev testing', ReactDOM.unstable_createRoot);
// ReactDOM.unstable_createRoot(document.getElementById("root")).render(<Main />);
// ReactDOM.unstable_createRoot(domNode).render(main(), document.getElementById('root'));
ReactDOM.render(Main(), document.getElementById('root'));
