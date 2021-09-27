import {useStartup, useSequence} from '^/Services/useCustomHooks'
import {
  InputGroup,
  Label,
  Select,
  Option
} from '@bootstrap-styled/v4';

const act = {
  getUniqueID: {type: 'getRandomID'}
};

const Quantities = ({entries=[]}) => [...Array(entries).keys()].map(id =>
  <Option key={id} value={id+1}>{id+1}</Option>
);

const ProductQuantity = ({name, limit, qtyHandler, service}) => {
  const {state, stateDispatch, apiDispatch, cfg, cStrings} = useStartup(service, {}, name);

  const qtyLimit = limit || cfg.maxQuantityPerItem;

  const changeQuantity = (e) => {
    qtyHandler(e.target.value);
    stateDispatch();
  }

  const setQty = (maxQty) => {
    stateDispatch({maxQty});
  }

  const setLabel = (labelID) => {
    stateDispatch({labelID});
  }

  useSequence([
    [apiDispatch, act.getUniqueID, setLabel],
    [setQty, qtyLimit],
  ])

  const {labelID, maxQty} = state;

  return(<>
    <InputGroup className="justify-content-center">
      <Label htmlFor={labelID} className="input-group-text align-self-center m-0 h-100">{cStrings.title}</Label>
      <Select value={qtyHandler()} id={labelID} onChange={changeQuantity}>
        <Quantities entries={maxQty} />
      </Select>
    </InputGroup>
  </>);
}

ProductQuantity.defaultProps = {
  name: ProductQuantity.name,
  limit: 10,
  service: 'utils'
}
export default ProductQuantity;
