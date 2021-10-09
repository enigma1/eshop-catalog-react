## EShop Catalog in ReactJS

Front End Catalog for ecommerce shops

Built with [React JS](http://facebook.github.io/react/)

This is the first part of the eshop. There are 4 parts total
 - Supports products, categories, manufacturers, accounts
 - Connects with a back end for data communication

Brief description of folders usage in this tree

The pages folder holds the basic html and main components
Individual sections can be found in the the Modules folder
The Services folder is utilized by each component via a custom reducer
Arbitrary Communication among components can be established with the standard react read properties or context or an external global library in few cases for specific subscriptions. State management is customized see the state management section below

#### State Management

- storeContext.js - action handling and state control
- useCustomHooks.js - custom hooks, custom reducers

#### Services

- api.js Communication with the back-end
- cartStorage.js - Shopping Cart support
- checkout.js - Checkout support
- currency.js - Dynamic currency calculation
- serverCache.js - Caches back-end data
- customer.js - Customer related services

#### Configuration

- Layout Configuration is retrieved from the back-end and stored in local storage during startup
- Page Routing is ln the routing.json section

#### Installation
- npm i

### Scripts
- npm run serve - run in dev mode
- npm run build - build in dev mode
- npm run build:production - build for production