import {useStartup, useSequence, useDefined} from '^/Services/useCustomHooks';
import {
  Fieldset,
  Legend,
  Form,
  FormGroup,
  Label,
  Input,
} from '@bootstrap-styled/v4';

const fieldsBase = 'shouldMatch';
const errorStyle = 'border-error';

const act = {
  fields: {
    shouldMatchName: (data) =>
      ({type: 'isValidName', data}),
  }
};

const AddressBookForm = ({service, name, handlers, trigger, stages, stateInit}) => {
  const {state, stateDispatch, apiDispatch, view, cStrings, cfg} = useStartup(service, stateInit, name);

  const {
    shouldMatchFirstName,
    shouldMatchLastName,
    shouldMatchStreetAddress1,
    shouldMatchStreetAddress2,
    shouldMatchCountry,
    shouldMatchState,
  } = state.fields;

  const getData = ({index, value}) => {
    const entries = {
      shouldMatchName:  {name: value, min: cfg.minNameLength, max: cfg.maxNameLength},
    }
    return entries[index] || entries.shouldMatchName;
  };

  const setResult = ({name, value}) => {
    view[name.replace(fieldsBase, 'error')] = !value;
    if(!value) return {goto:'END'};
  }

  const handleFocus = async (e, mode) => {
    const {name, value} = e.target;
    const {...fields} = state.fields;
    fields[name] = value;

    if(!mode) {
      const data = getData({index: name, value});
      const result = await apiDispatch(act.fields.shouldMatchName(data));
      view[name.replace(fieldsBase, 'error')] = !result;
      stateDispatch({pureFields: mode});
    }
  }

  const handleChange = async (e) => {
    const {name, value} = e.target;
    const {...fields} = state.fields;
    fields[name] = value;

    stateDispatch({fields});
  }

  const handleCreate = (e) => {
    e.preventDefault();
    stateDispatch({trigger: Date.now()});
  }

  const createAddress = () => {
    handlers.verify(true);
  }

  const processNames = () => {
    if(stages.length) return;

    ['shouldMatchFirstName',
     'shouldMatchLastName',
     'shouldMatchStreetAddress1',
     'shouldMatchStreetAddress2',
     'shouldMatchCounty',
     'shouldMatchState']
    .forEach((entry) => {
      stages.push([
        apiDispatch,
        act.fields.shouldMatchName(getData({index: entry, value: state[entry]})),
        value => setResult({name: entry, value})
      ]);
    })
  }

  useSequence([
    [,,processNames],
  ],[])

  useDefined([
    [stateDispatch, {validation: true}],
    ...stages,
    // [apiDispatch, act.fields.shouldMatchName({name: shouldMatchFirstName, min: cfg.minNameLength, max: cfg.maxNameLength}), value => setResult({name: 'shouldMatchFirstName', value})],
    // [apiDispatch, act.fields.shouldMatchName({name: shouldMatchLastName, min: cfg.minNameLength, max: cfg.maxNameLength}), value => setResult({name: 'shouldMatchLastName', value})],
    // [apiDispatch, act.fields.shouldMatchName({name: shouldMatchStreetAddress1, min: cfg.minNameLength, max: cfg.maxNameLength}), value => setResult({name: 'shouldMatchStreetAddress1', value})],
    // [apiDispatch, act.fields.shouldMatchName({name: shouldMatchStreetAddress2, min: cfg.minNameLength, max: cfg.maxNameLength}), value => setResult({name: 'shouldMatchStreetAddress2', value})],
    // [apiDispatch, act.fields.shouldMatchName({name: shouldMatchCounty, min: cfg.minPasswordLegtnh, max: cfg.maxNameLength}), value => setResult({name: 'shouldMatchCounty', value})],
    // [apiDispatch, act.fields.shouldMatchName({name: shouldMatchState, min: cfg.minNameLength, max: cfg.maxNameLength}), value => setResult({name: 'shouldMatchState', value})],
    [,,createAddress],
    [stateDispatch, {validation: false},,'END']
  ],[trigger]);



  const {errorFirstName, errorLastName, errorStreetAddress1, errorStreetAddress2} = view;

  return(<section className="mb-2">
    <Fieldset className="p-3 border">
      <Legend className="width-auto">{cStrings.addressFields}</Legend>
      <div className="form-row">
        <FormGroup className="col-md-6">
          <Label htmlFor="shouldMatchFirstName">{cStrings.firstName}</Label>
          <Input className={errorFirstName?errorStyle:""} id="shouldMatchFirstName" value={shouldMatchFirstName} name="shouldMatchFirstName" onBlur={(e) => handleFocus(e,false) } onFocus={(e) => handleFocus(e,true)} onChange={handleChange} />
        </FormGroup>
        <FormGroup className="col-md-6">
          <Label htmlFor="shouldMatchLastName">{cStrings.lastName}</Label>
          <Input className={errorLastName?errorStyle:""} id="shouldMatchLastName" value={shouldMatchLastName} name="shouldMatchLastName" onBlur={(e) => handleFocus(e,false) } onFocus={(e) => handleFocus(e,true)} onChange={handleChange} />
        </FormGroup>
      </div>
      <div className="form-row">
        <FormGroup className="col-md-6">
          <Label htmlFor="shouldMatchStreetAddress1">{cStrings.streetAddress1}</Label>
          <Input className={errorStreetAddress1?errorStyle:""} id="shouldMatchStreetAddress1" value={shouldMatchStreetAddress1} name="shouldMatchStreetAddress1" onBlur={(e) => handleFocus(e,false) } onFocus={(e) => handleFocus(e,true)} onChange={handleChange} />
        </FormGroup>
        <FormGroup className="col-md-6">
          <Label htmlFor="shouldMatchStreetAddress2">{cStrings.streetAddress2}</Label>
          <Input className={errorStreetAddress2?errorStyle:""} id="shouldMatchStreetAddress2" value={shouldMatchStreetAddress2} name="shouldMatchStreetAddress2" onBlur={(e) => handleFocus(e,false) } onFocus={(e) => handleFocus(e,true)} onChange={handleChange} />
        </FormGroup>
      </div>
    </Fieldset>
  </section>)
}

AddressBookForm.defaultProps = {
  name: AddressBookForm.name,
  service: 'utils',
  stages: [],
  stateInit: {validation: false, pureFields: true, fields: {
    shouldMatchFirstName: '',
    shouldMatchLastName: '',
    shouldMatchCounty: '',
    shouldMatchZipCode: '',
    shouldMatchState: '',
    shouldMatchCountry: '',
  }}
}

export default AddressBookForm;
