import {useEffect} from 'react';
import {useStartup, useSequence} from '^/Services/useCustomHooks'

import {
  InputGroup,
  Select,
  Option,
  Label,
} from '@bootstrap-styled/v4';

const errorStyle = 'border-error';

const act = {
  getUniqueID: {type: 'getRandomID'}
};


const OptionsList = ({options=[]}) =>
  options.map((value, index) => {
    let dValue = value;
    let dPrice;
    if(typeof value === 'object') {
      dValue = value.name;
      dPrice = value.price;
    }
    return (
      <Option key={index} value={dValue} data-price={value.price}>{dValue}</Option>
    );
  })

const ProductOption = ({service, name, optionName, optionHandler, optionRef, children=optionName}) => {
  const {state, stateDispatch, apiDispatch, cStrings} = useStartup(service, {}, name);

  const setError = (selectError) => {
    stateDispatch({selectError});
  }

  const changeOption = (e) => {
    const selectPrice = e.target.options[e.target.selectedIndex].getAttribute("data-price");
    const selectOption = e.target.value;
    stateDispatch({
      selectError: false,
      selectOption,
      selectPrice
    })
    optionHandler(children, selectOption, selectPrice);
  }

  const initializeState = () => {
    if(!state.optionData) {
      stateDispatch({
        optionData: optionHandler(children),
      })
    } else {
      return {goto: 'END'}
    }
  };

  const setLabel = (labelID) => {stateDispatch({labelID})}

  const processErrors = () => {
    const action = state.selectError?'add':'remove';
    optionRef.current.classList[action](errorStyle);
  }

  // Initialization
  useEffect(() => {
    optionRef.current.setError = setError;
    return () => {
      optionRef.current && delete optionRef.current.setError;
    }
  },[]);

  // On Option Change
  useSequence([
    [initializeState],
    [apiDispatch, act.getUniqueID, setLabel],
    [stateDispatch, {selectError: false},,'END'],
  ], [state.selectOption])

  // On Error Handling
  useSequence([
    [processErrors]
  ], [state.selectError])

  const {labelID, optionData, selectOption} = state;

  return(
    <section className="mb-2" ref={optionRef}>
      <InputGroup>
        <Label htmlFor={labelID} className="input-group-text align-self-center m-0 h-100 w-33">{children}</Label>
        <Select id={labelID} value={selectOption} onChange={changeOption} className="flex-fill no-select">
          <Option>{cStrings.defaultChoice}</Option>
          <OptionsList options={optionData} />
        </Select>
      </InputGroup>
    </section>
  );
}

ProductOption.defaultProps = {
  name: ProductOption.name,
  service: 'utils'
}

export default ProductOption;
