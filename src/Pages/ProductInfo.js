import {useStartup, useSequence, useSequenceOnce, useDefined} from '^/Services/useCustomHooks';
import Header from '%/Common/Header';
import Footer from '%/Common/Footer';
import PageTitle from '%/Common/PageTitle';
import ProductData from '%/ProductInfo/ProductData';
import ProductBuyForm from '%/ProductInfo/ProductBuyForm';
import ProductImages from '%/ProductInfo/ProductImages';
import ProductDetails from '%/ProductInfo/ProductDetails';
import {Container} from '@bootstrap-styled/v4';

const act = {
  setLocation: {
    type: 'setLastLocation'
  },
  getByID: id => {
    return {
      type: 'getByID',
      data: {id}
  }},
  getPathID: {
    type: 'getLocationID',
    data: {id: 'products_id'}
  }
};

// Transform helpers
const transform = {
  headings: ({id, name}) => ({id, title: name}),
  images:  ({id, name, images}) => ({id, name, images}),
  features: ({id, model, vendor_sku, seller_tag, fields, last_modified}) =>
    ({id, model, last_modified,
      sku: vendor_sku,
      tag: seller_tag,
      dimensions: fields?.dimensions,
      weight: fields?.weight
    }),
  details: ({id, name, desc, date_created, last_modified}) =>
    ({id, name, desc, date_created, last_modified})
}

const ProductInfo = ({services, name}) => {
  const {state, stateDispatch, middleware, view} = useStartup(services, {}, name);
  const [apiDispatch, utilsDispatch, historyDispatch] = middleware;

  const setProduct = (pData) => {
    const transforms = {};
    for(let i in transform) {
      transforms[i] = transform[i](pData);
    }
    stateDispatch({pData, ...transforms})
  };

  const setPathID = (id) => {view.id = id};

  useSequenceOnce([
    [historyDispatch, act.setLocation],
    [utilsDispatch, act.getPathID, setPathID],
    [stateDispatch],
  ])

  useDefined([
    [apiDispatch, act.getByID(view.id), setProduct],
    [stateDispatch, {ready: true}],
  ],[view.id])

  const {headings, images, features, details, pData, ready} = state;

  return(<>
    <Container>
      <Header></Header>
      <Loading show={!ready}>
        <h2 className="vh-100">Loading Product</h2>
      </Loading>
      {ready && <>
        <PageTitle headings={headings}></PageTitle>
        <div className="d-flex flex-column flex-lg-row bd-highlight">
          <ProductImages images={images}></ProductImages>
          <ProductData pData={features}></ProductData>
          <ProductBuyForm pData={pData}></ProductBuyForm>
        </div>
        <ProductDetails details={details}></ProductDetails>
      </>}
      <Footer></Footer>
    </Container>
  </>)
}

ProductInfo.defaultProps = {
  name: ProductInfo.name,
  services: ['api', 'utils', 'history']
}

export default ProductInfo;
