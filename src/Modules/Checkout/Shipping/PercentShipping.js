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
    data: 'PercentShipping'
  },
  getTotals: {
    type: 'getTotalDetails'
  },
}


const CostOptions = ({group, options, totals, setCost}) => options
  .filter(entry => {
    if(
      !entry.status ||
      (entry.valueMin && entry.valueMin < totals.total) ||
      (entry.weightMin && entry.weightMin < totals.totalWeight) ||
      (entry.weightMax && entry.weightMax > totals.totalWeight)
    ) return false;
    if(entry.volumeMin) {
      const cartVolume = totals.totalVolume.split('x');
      const shouldEnable = entry.volumeMin.split('x').some(value =>
        cartVolume.reduce((acc, v) => {
          return value < v?acc+1:acc;
        }, 0)
      );
      if(!shouldEnable) return false;
    };

    return true;
  })
  .map((entry, idx) => {
    const key = [PercentShipping.name.toLowerCase(), entry.id, idx].join('-')
    const percent = <Strong>{entry.percent}</Strong>
    return (
      <InputGroup key={key} className="custom-control custom-radio">
        <Input id={key} onClick={() => setCost(entry)} name={group} type="radio" className="custom-control-input"></Input>
        <Label className="custom-control-label" htmlFor={key}>
          <FragmentedString string={entry.text} params={{percent}}></FragmentedString>
        </Label>
      </InputGroup>
    )
  });


const PercentShipping = ({modData, setCost, group, service}) => {
  const {state, stateDispatch, apiDispatch} = useStartup(service);

  const setShippingCost = (entry) => {
    const {total} = state.totals;
    setCost(entry, (total*entry.percent)/100);
  };

  const setTotals = (totals) => {
    stateDispatch({totals});
  };

  useSequence([
    [apiDispatch, act.getTotals, setTotals],
    [stateDispatch, {ready: true}],
  ],[])

  const {costs, title} = modData.value;
  const {totals} = state;

  return (<>{state.ready &&
    <Fieldset className="p-3 border">
      <Legend>{title}</Legend>
      <CostOptions setCost={setShippingCost} totals={totals} options={costs} group={group}></CostOptions>
    </Fieldset>
  }</>)
}

PercentShipping.defaultProps = {
  name: PercentShipping.name,
  group: 'shipping',
  service: 'cart'
}

export default PercentShipping;
