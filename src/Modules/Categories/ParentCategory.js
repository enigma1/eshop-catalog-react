import {useStartup, useSequence, useStrings} from '^/Services/useCustomHooks';
import ListCategories from '%/Categories/ListCategories';
import ListProducts from '%/ListProducts';
import {H3, P} from '@bootstrap-styled/v4';

const act = {
  getByID: id => ({
    type: "getByID",
    data: {id}
  }),
  getProductsCount: id => ({
    type: "getProductsCount",
    data: {id}
  }),
  getProducts: (id, limit) => ({
    type: "viewProducts",
    data: {
      cmd: `view=by-category&key="${id}"&limit=${limit}`
    }
  })
};

const viewInit = (cData) => ({
  cData,
  pData: []
})

const ParentCategory = ({name, cid, viewInit, service}) => {
  const cStrings = useStrings(name);
  const {state, stateDispatch, apiDispatch, view, cfg} = useStartup(service, viewInit(cStrings.root), name);
  const id = cid?cid:state.cData.id;

  const setInitial = () => {
    if(!cid) {
      stateDispatch({type: 'reset', data:viewInit(cStrings.root)})
      return {goto: 'END'}
    }
  }

  const setCategory = data => {
    if(data && data.id) {
      stateDispatch({cData:data})
    }
  }

  const setProducts = data => {
    if(data && data.rows) {
      stateDispatch({pData: data.rows.sort((i,j) => +i.value.sort - +j.value.sort)});
    }
  }

  const setProductsCount = count => {

  }

  useSequence([
    [stateDispatch, {ready: false}],
    [setInitial],
    [apiDispatch, act.getByID(id), setCategory],
    [apiDispatch, act.getProducts(id, cfg.productsPerCategory), setProducts],
    //[apiDispatch, act.getProductsCount(id), setProductsCount],
    [stateDispatch, {ready: true},,'END'],
  ],[cid])

  const style = {
    minHeight: "80px",
    //backgroundImage: 'url(/images/processors-banner.png)'
    backgroundColor: '#777799'
  }

  const {cData, pData} = state;
  const description = ReactHtmlParser(cData.desc);

  return (<>{state.ready && <>
    <H3 className="border p-3 bg-heading text-heading mt-2">{cData.name}</H3>
    <P className="d-block text-light p-4" style={style}>{description}</P>
    <ListProducts products={pData}></ListProducts>
    <ListCategories cid={id}></ListCategories>
  </>}</>);
}

ParentCategory.defaultProps = {
  name: ParentCategory.name,
  service: 'api',
  viewInit
}

export default ParentCategory;
