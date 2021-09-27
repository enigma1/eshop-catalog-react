import * as routerData from "^/Config/routes.json";

const routes = {
  Home: {
    "path": "//",
    "component": "Home",
    "type": "exact"
  },
  Account: {
    "path": "/account",
    "component": "Account",
    "type": "exact"
  },
  Checkout: {
    "path": "/checkout",
    "component": "Checkout",
    "type": "exact"
  },
  CreateAccount: {
    "path": "/create-account",
    "component": "CreateAccount",
    "type": "exact"
  },
  Login: {
    "path": "/login",
    "component": "Login",
    "type": "exact"
  },
  Logout: {
    "path": "/logout",
    "component": "Logout",
    "type": "exact"
  },
  Search: {
    "path": "/search",
    "component": "Search",
    "type": "exact"
  },
  ShoppingCart: {
    "path": "/shopping-cart",
    "component": "ShoppingCart",
    "type": "exact"
  },
  Specials: {
    "path": "/specials",
    "component": "Specials",
    "type": "exact"
  },
  Orders: {
    "path": "/orders",
    "component": "Orders",
    "params": ["oID", "sort"]
  },
  ProductInfo: {
    "path": "/product-info",
    "component": "ProductInfo",
    "params": ["pID", "sort"]
  },
  Categories: {
    "path": "/categories",
    "component": "Categories",
    "params": ["cID"]
  },
  Manufacturers: {
    "path": "/manufacturers",
    "component": "Manufacturers",
    "params": ["mID"]
  },
  Error: {
    "path":"*",
    "component": "Error"
  }
}

const getRoutes = () => routes;

const routing = {
  getRoutes
}

export default routing