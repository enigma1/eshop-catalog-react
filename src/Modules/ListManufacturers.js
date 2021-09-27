import {useStartup, useSequence} from '^/Services/useCustomHooks';
import ListManufacturerCard from '%/ListingProducts/ListManufacturerCard';
import ListProducts from '%/ListProducts';
import PageTitle from '%/Common/PageTitle';
import {H3, P} from '@bootstrap-styled/v4';

const act = {
  getByID: id => ({
    type: "getByID",
    data:{id}
  }),
  viewProducts: (id,limit) => ({
    type: "viewProducts",
    data: {
      cmd: `view=by-manufacturer&key=["manufacturers_id","${id}"]&limit=${limit}`
    }
  }),
  viewManufacturers: {
    type: "viewManufacturers",
    data: {
      cmd: `view=listing`
    }
  },
  getSuffix: {type: 'getRandomID'},
};

const ManufacturersList = ({manufacturers, suffix}) => <>
  {manufacturers.map( (entry, idx) =>
    <ListManufacturerCard key={[idx,suffix].join('-')} cardData={entry.value}></ListManufacturerCard>
  )}
</>;

const viewInit = (mData) => ({pData:[], mData, suffix:0, manufacturers:[]})

const ListManufacturers = ({name, mid, viewInit, services}) => {
  const {state, stateDispatch, middleware, view, cStrings, cfg} = useStartup(services, {}, name);
  const [apiDispatch, utilsDispatch] = middleware;
  const id = mid?mid:0;
  const limit = cfg.productsPerManufacturer || 6;

  const setSuffix = (suffix) => {
    if(mid) {
      stateDispatch({suffix})
      return {goto: 'MID'}
    }
  }

  const setAll = data => {
    if(data && data.rows) {
      const newState = viewInit(cStrings.root)
      newState.manufacturers = data.rows;
      stateDispatch(newState);
      return {goto: 'END'}
    } else {
      return {abort: true}
    }
  }

  const setManufacturer = data => data && data.id && stateDispatch({mData: data})

  const setProducts = data => {
    data && data.rows && stateDispatch({
      pData: data.rows.sort((i,j) => +i.value.sort - +j.value.sort)
    })
  }

  const staging = () => {
    const newState = {ready: true};
    Object.assign(newState, mid?{manufacturers:[]}:{});
    //console.log('final', state, newState)
    stateDispatch(newState);
  }

  useSequence([
    [stateDispatch, {ready: false}],
    [utilsDispatch, act.getSuffix, setSuffix],
    [apiDispatch, act.viewManufacturers, setAll],
    [apiDispatch, act.getByID(id), setManufacturer, 'MID'],
    [apiDispatch, act.viewProducts(id, limit), setProducts],
    [staging,,,'END'],
  ],[mid])

  const style = {
    minHeight: "80px",
    //backgroundImage: 'url(/images/processors-banner.png)'
    backgroundColor: '#AA5588'
  }

  //const {mData, pData, } = view;
  const {manufacturers=[], suffix=0, ready, mData={}, pData=[]} = state;

  return (<>{ready && <>
    <PageTitle headings={{title:mData.name}}></PageTitle>
    <P className="d-block text-light p-4" style={style}>{mData.desc}</P>
    <ListProducts products={pData}></ListProducts>
    <ManufacturersList manufacturers={manufacturers} suffix={suffix} />
  </>}</>);
}

ListManufacturers.defaultProps = {
  name: ListManufacturers.name,
  services: ['api', 'utils'],
  viewInit
}

export default ListManufacturers;
