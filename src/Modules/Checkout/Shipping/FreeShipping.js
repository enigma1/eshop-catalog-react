import {useSequence, useStartup, usePubSub} from '^/Services/useCustomHooks';
import FragmentedString from '%/Common/FragmentedString';
import Price from '%/Common/Price';
import {
  Strong,
  Fieldset,
  Legend,
  InputGroup,
  Input,
  Label,
} from '@bootstrap-styled/v4';

const act = {
  getByID: {
    type: "getByID",
    data: 'FreeShipping'
  },
  getTotals: {
    type: 'getTotalDetails'
  },
}

const CostOptions = ({group, options, total, setCost}) => options
  .filter(entry => entry.status && (!entry.value || entry.value < total))
  .map((entry, idx) => {
    const key = [FreeShipping.name.toLowerCase(), entry.id, idx].join('-')
    const value = <Strong><Price>{entry.value}</Price></Strong>
    return (
      <InputGroup key={key} className="custom-control custom-radio">
        <Input id={key} onClick={() => setCost(entry)} name={group} type="radio" className="custom-control-input"></Input>
        <Label className="custom-control-label" htmlFor={key}>
          <FragmentedString string={entry.text} params={{value}}></FragmentedString>
        </Label>
      </InputGroup>
    )
  });


const FreeShipping = ({modData, setCost, group, service}) => {
  const {state, stateDispatch, apiDispatch} = useStartup(service);

  const setShippingCost = (entry) => {
    setCost(entry, 0);
  };

  const setTotals = (totals) => {
    const {total} = totals;
    stateDispatch({total});
  };

  useSequence([
    [stateDispatch, {ready: false}],
    [apiDispatch, act.getTotals, setTotals],
    [stateDispatch, {ready: true}],
  ],[])

  const {costs, title} = modData.value;
  const {total} = state;

  return (<>{state.ready &&
    <Fieldset className="p-3 border">
      <Legend>{title}</Legend>
      <CostOptions setCost={setShippingCost} total={total} options={costs} group={group}></CostOptions>
    </Fieldset>
  }</>)
}

FreeShipping.defaultProps = {
  name: FreeShipping.name,
  group: 'shipping',
  service: 'cart'
}

export default FreeShipping;
