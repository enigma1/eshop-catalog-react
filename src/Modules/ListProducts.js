// import { withRouter } from 'react-router';
import {useSequence, useCfg, useStartup, usePubSub} from '^/Services/useCustomHooks';

import PropTypes from 'prop-types';

import ListProductCard from '%/ListingProducts/ListProductCard';
import PageSplitter from '%/Common/PageSplitter';
import ListFilter from '%/ListingProducts/ListFilter';

import {
  Collapse,
  InputGroup,
} from '@bootstrap-styled/v4';

const act = {
  getSuffix: {
    type: 'getRandomID'
  }
}

const sortOptions = [
  {id: 'relevant', value: 'Relevance', sort: products => products},
  {id: 'popular', value: 'Most Popular', sort: products => products},
  {id: 'recent', value: 'Recently Added', sort: products => products.sort((i,j) => j['id'].localeCompare(i['id']))},
  {id: 'low2high', value: 'Low to High', sort: products => products.sort((i,j) => Number(i.price) - Number(j.price))},
  {id: 'high2low', value: 'High to Low', sort: products => products.sort((i,j) => Number(j.price) - Number(i.price))}
];

const ListItems = ({items, suffix}) => items.map( (entry, idx) =>
  <ListProductCard key={[idx, suffix].join('-')} cardData={entry}></ListProductCard>
);

const ListProducts = ({service, name, products, respond, children}) => {
  const cfg = useCfg(name);
  const {pagesSplitter, minItemsToFilter} = cfg;
  const initState = {
    itemsPerPage: pagesSplitter[0].id,
    itemsFilter: sortOptions[0].id,
    suffix:0, pageIndex: 0,
    pData: products
  };
  const {state, stateDispatch, apiDispatch, view} = useStartup(service, initState, name, {trigger:0, xProducts:[]});

  const setSuffix = (suffix) => {
    stateDispatch({suffix});
  }

  const pageHandler = (pageIndex) => {
    stateDispatch({pageIndex: pageIndex-1, ready: true});
  }

  const setItemsPerPage = (e) => {
    stateDispatch({itemsPerPage: e.target.value, ready: true});
  };

  const setItemsFilter = (e) => {
    stateDispatch({itemsFilter: e.target.value, ready: true});
  };

  const getProductsSource = () => {
    if(!view.xProducts.length) return products;

    let result = [];
    Object.assign(result, view.xProducts);
    view.xProducts = [];
    return result;
  }

  const processProducts = (productsPromised) => {
    let pData, result = {};
    try {
      const newProducts = productsPromised().map(entry => entry.value || entry);
      pData = newProducts.sort((i,j) => +i.sort - +j.sort);
    } catch(error) {
      pData = ListProducts.defaultProps.products;
      result = {error};
    }

    // Also short for current settings
    //...
    stateDispatch({pData});
    return result;
  }

  // Set external items then prepare trigger then force render
  const setProductsFromExternalSource = (...args) => {
    let [eventName, items] = args;
    console.log(eventName, items)
    view.xProducts = items;
    view.trigger = Date.now();
    stateDispatch();
  }

  const setProductsResult = (result) => {
    if(result.error) {
      console.log('Error occured', result);
    }
  }

  usePubSub( () => {
    const tunnels = [];
    for(const tunnel of respond) {
      tunnels.push([Promise.resolve(tunnel), setProductsFromExternalSource])
    }
    return tunnels;
  });

  useSequence([
    [apiDispatch, act.getSuffix, setSuffix],
    [processProducts, getProductsSource, setProductsResult],
    [stateDispatch, {ready: true}]
  ], [products, view.trigger])

  const {pData, itemsFilter, itemsPerPage, pageIndex, suffix} = state;
  sortOptions.find(i => i.id === itemsFilter).sort(pData);
  const shouldShowFilters = pData.length>minItemsToFilter;
  const count = parseInt(itemsPerPage);
  const start = pageIndex*count;
  const items = pData.slice(start, start+count);
  let totalPages = parseInt((pData.length-1)/count);
  totalPages && ++totalPages;

  const pageData = {
    id: 'listItemsPerPage',
    title: 'Show',
    handler: setItemsPerPage,
    values: pagesSplitter,
    defaultValue: itemsPerPage
  }

  const sortData = {
    id: 'filterItemsBy',
    title: 'Sort By',
    handler: setItemsFilter,
    values: sortOptions,
    defaultValue: itemsFilter
  }

  const splitData = {
    previous: pageIndex > 0,
    next: pageIndex < totalPages-1,
    current: pageIndex+1,
    handler: pageHandler,
    values: [...Array(totalPages).keys()].map(v=>++v)
  }

  return (<>
    {children}
    {state.ready && <>
      <Collapse isOpen={shouldShowFilters}>
        <InputGroup className="align-items-stretch align-items-center bg-heading">
          <div className="d-flex flex-grow-1 justify-content-md-end p-2">
            <ListFilter filterData={pageData} className="d-flex"></ListFilter>
            <ListFilter filterData={sortData} className="d-flex ml-2"></ListFilter>
          </div>
        </InputGroup>
      </Collapse>
      <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-3">
        <ListItems suffix={suffix} items={items}></ListItems>
      </div>
      <Collapse isOpen={totalPages}>
        <PageSplitter split={splitData}></PageSplitter>
      </Collapse>
      </>}
  </>)
}

ListProducts.defaultProps = {
  name: ListProducts.name,
  respond: [],
  products: [],
  service: 'utils',
};

ListProducts.propTypes = {
  respond: PropTypes.array,
  products: PropTypes.array
};

export default ListProducts;
//export default withRouter(ListProducts);
