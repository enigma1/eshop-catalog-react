import {useSequence, useStartup} from '^/Services/useCustomHooks';
import ListCategoryCard from '%/ListingProducts/ListCategoryCard';

const act = {
  getCategories: id => ({
    type: "viewCategories",
    data: {
      cmd: `view=listing&key=["parent_id","${id}"]`
    }
  }),
  getSuffix: {type: 'getRandomID'}
};

const SubCategories = ({categories, suffix}) => <>
  {categories.map( (entry, idx) =>
    <ListCategoryCard key={[idx, suffix].join('-')} cardData={entry.value}></ListCategoryCard>
  )}
</>

const viewInit = () => ({categories: [], suffix: 0})

const ListCategories = ({name, cid, viewInit, services, children}) => {
  const {state, stateDispatch, middleware, cStrings} = useStartup(services, viewInit(), name);
  const [apiDispatch, utilsDispatch] = middleware;
  const id = cid?cid:cStrings.root.id;

  const setSuffix = (suffix) => {
    stateDispatch({suffix});
  }

  const setCategories = (categories) => {
    if(categories && categories.rows) {
      stateDispatch({categories: categories.rows});
    }
  }

  useSequence([
    [utilsDispatch, act.getSuffix, setSuffix],
    [apiDispatch, act.getCategories(id), setCategories],
  ], [cid]);

  const {categories, suffix} = state;

  return (<>
    {children}
    <section className="row row-cols-1">
      <SubCategories categories={categories} suffix={suffix} />
    </section>
  </>)
}

ListCategories.defaultProps = {
  name: ListCategories.name,
  services: ['api', 'utils'],
  viewInit
}

export default ListCategories;
