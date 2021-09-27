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
    data: 'PersonalPayment'
  },
  getTotals: {
    type: 'getTotalDetails'
  },
}

const PaymentOptions = ({group, options, total, setPayment}) => options
  .filter(entry => entry.status && (!entry.value || entry.value < total))
  .map((entry, idx) => {
    const key = [Cash.name.toLowerCase(), entry.id, idx].join('-')
    const value = <Strong><Price>{entry.value}</Price></Strong>
    return (
      <InputGroup key={key} className="custom-control custom-radio">
        <Input id={key} onClick={() => setPayment(entry)} name={group} type="radio" className="custom-control-input"></Input>
        <Label className="custom-control-label" htmlFor={key}>
          <FragmentedString string={entry.text} params={{value}}></FragmentedString>
        </Label>
      </InputGroup>
    )
  });


const Personal = ({modData, setPayment, group, service}) => {
  const {state, stateDispatch, apiDispatch} = useStartup(service);

  const setPaymentOption = (entry) => {
    setPayment(entry);
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
      <PaymentOptions setPayment={setPaymentOption} total={total} options={costs} group={group}></PaymentOptions>
    </Fieldset>
  }</>)
}

Personal.defaultProps = {
  name: Personal.name,
  group: 'payment',
  service: 'checkout'
}

export default Personal;
