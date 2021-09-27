import {useDefined, useSequence, useStartup} from '^/Services/useCustomHooks';
import CurrencyGlobeIcon2 from '^/Icons/globe2.svg';

import {
  Label,
  Select,
  Option
} from '@bootstrap-styled/v4';

const act = {
  randomID: {
    type: 'getRandomID'
  },
  getList: {
    type: 'getList'
  },
  change: data => ({
    type: 'change',
    data
  }),
};

const CurrencyOptions = ({options=[]}) => <>
  {options.map((entry, index) => <Option key={index} value={entry}>{entry}</Option>)}
</>

const CurrencySelect = ({services}) => {
  // Initialize
  const {state, stateDispatch, middleware, view} = useStartup(services);
  const [currencyDispatch, utilsDispatch] = middleware;

  const setLabel = (id) => {stateDispatch({labelID:id})};

  const setList = ({exchange, selected}) => {stateDispatch({selected, exchange})};

  // Handlers
  const setCurrency = (e) => {
    stateDispatch({selected: e.target.value, trigger: Date.now()})
  }

  useSequence([
    [utilsDispatch, act.randomID, setLabel],
    [currencyDispatch, act.getList, setList],
  ]);

  useDefined([
    [currencyDispatch, act.change({selected: state.selected})],
  ],[state.trigger])

  // Prepare rendering params
  const {labelID, exchange, selected} = state;

  return (<>
    <Label htmlFor={labelID} className="input-group-text align-self-center m-0">
      <CurrencyGlobeIcon2 width={24} height={24} />
    </Label>
    <Select onChange={setCurrency} value={selected} className="custom-select wh-auto" id={labelID} >
      <CurrencyOptions options={exchange} />
    </Select>
  </>);
}

CurrencySelect.defaultProps = {
  services: ['currency', 'utils']
}

export default CurrencySelect;
