import {Redirect} from 'react-router-dom';
import {useStartup, useSequence, useDefined, usePubSub} from '^/Services/useCustomHooks';
import AddressBookForm from '%/Account/AddressBookForm';
import FragmentedString from '%/Common/FragmentedString';
import FormButtons from '%/Common/FormButtons';

import {
  Fieldset,
  Legend,
  Form,
  FormGroup,
  Label,
  Input,
  Small,
} from '@bootstrap-styled/v4';

const fieldsBase = 'shouldMatch';
const errorStyle = 'is-invalid';

const act = {
  create: data => ({
    type: "createAccount",
    data
  }),
  getConnection: () => ({
    type: 'getConnectionTokenName'
  }),
  setCustomerData: (data) => ({
    type: 'setCustomer',
    data
  }),
  convertStrings: data => ({
    type: "convertStrings",
    data
  }),
  insertMessages: (data) => ({
    type: "addMessages",
    data
  }),
  getLocation: {
    type: 'getLastLocation'
  },
  fields: {
    shouldMatchEmail: (data) =>
      ({type: 'isValidEmail', data}),
    shouldMatchEmail2: (data) =>
      ({type: 'isValidEmail', data}),
    shouldMatchPassword: (data) =>
      ({type: 'isValidPassword', data}),
    shouldMatchNickName: (data) =>
      ({type: 'isValidName', data}),
  }
};

const Specials = str => `<a href="/specials">${str}</a>`;

const CreateAccountForm = ({services, children, name, stateInit}) => {
  const {state, stateDispatch, middleware, view, cStrings, cfg} = useStartup(services, stateInit, name);

  const [apiDispatch, utilsDispatch, customerDispatch, messagesDispatch, historyDispatch] = middleware;

  const {trigger, validation, pureFields, connect} = state;
  const {shouldMatchEmail, shouldMatchEmail2, shouldMatchNickName, shouldMatchPassword} = state.fields;

  const initialize = () => {

  }

  const getData = ({index, value}) => {
    const entries = {
      shouldMatchEmail:     {email: value, min: cfg.minEmailLength, max: cfg.maxEmailLength},
      shouldMatchEmail2:    {email: value, min: cfg.minEmailLength, max: cfg.maxEmailLength},
      shouldMatchPassword:  {password: value, min: cfg.minPasswordLength, max: cfg.maxPasswordLength},
      shouldMatchNickName:  {name: value, min: cfg.minNameLength, max: cfg.maxNameLength}
    }
    return entries[index] || {};
  };

  const checkConnect = (name, connect) => {
    if(!connect) PubSub.publish('messages', cStrings.errorConnect);
    stateDispatch({connect});
  }

  const checkEmailMatch = () => {
    if(shouldMatchEmail !== shouldMatchEmail2) {
      view['errorEmail'] = view['errorEmail2'] = true;
      return {goto:'END'};
    }
  }

  const setResult = ({name, value}) => {
    view[name.replace(fieldsBase, 'error')] = !value;
    if(!value) return {goto:'END'};
  }

  const handleChange = async (e) => {
    const {name, value} = e.target;
    const {...fields} = state.fields;
    fields[name] = value;
    stateDispatch({fields});
  }

  const handleFocus = async (e, mode) => {
    const {name, value} = e.target;
    if(!mode) {
      const data = getData({index: name, value});
      const result = await utilsDispatch(act.fields[name](data));
      view[name.replace(fieldsBase, 'error')] = !result;
      stateDispatch({pureFields: mode});
    }
  }

  const createUser = async data => {
    const {nickName, error} = data;

    if(nickName) {
      const convertedStrings = await utilsDispatch(act.convertStrings([
        {str:cStrings.welcome, params:{nickName}},
        {str:cStrings.demoShop, params:{nickName, page:Specials(cStrings.specials)}}
      ]));

      const msgList = convertedStrings.map(msg => ({type: 'success', msg, page: view.lastLink}));
      await messagesDispatch(act.insertMessages(msgList));
      await customerDispatch(act.setCustomerData(data));
      view.redirect = true;

    } else if(error) {
      PubSub.publish('messages', cStrings.invalidCredentials);
      return {goto:'END'};
    }
  }

  const handleAddressBook = (value) => {
    console.log('ab call received', value )
  }

  const handleCreate = (e) => {
    e.preventDefault();
    stateDispatch({trigger: Date.now()});
  }

  usePubSub( () => {
    const tokenName = apiDispatch(act.getConnection());
    return [tokenName, checkConnect]
  });

  // useDefined([
  //   [utilsDispatch, act.fields.shouldMatchEmail(getData({index: 'shouldMatchEmail', value: shouldMatchEmail})), value => setResult({name: 'shouldMatchEmail', value})],
  // ],[state.change]);

  useDefined([
    [stateDispatch, {validation: true}],
    [utilsDispatch, act.fields.shouldMatchEmail(getData({index: 'shouldMatchEmail', value: shouldMatchEmail})), value => setResult({name: 'shouldMatchEmail', value})],
    [utilsDispatch, act.fields.shouldMatchEmail(getData({index: 'shouldMatchEmail', value: shouldMatchEmail2})), value => setResult({name: 'shouldMatchEmail2', value})],
    [,,checkEmailMatch],
    [utilsDispatch, act.fields.shouldMatchPassword(getData({index: 'shouldMatchPassword', value: shouldMatchPassword})), value => setResult({name: 'shouldMatchPassword', value})],
    [utilsDispatch, act.fields.shouldMatchNickName(getData({index: 'shouldMatchNickName', value: shouldMatchNickName})), value => setResult({name: 'shouldMatchNickName', value})],
    [historyDispatch, act.getLocation, ({link}) => {view.lastLink=link}],
    [apiDispatch, act.create({email: shouldMatchEmail, password: shouldMatchPassword, nickName: shouldMatchNickName}), createUser],
    //[customerDispatch, act.setCustomerData(view.customerData), setRedirect],
    //[stateDispatch, {type:'reset', data:{redirect: true}},,!!view.redirect],
    [stateDispatch, {redirect: !!view.redirect}],
    [stateDispatch, {validation: false},,'END']
  ],[trigger]);

  useSequence([
    [,,initialize],
  ],[])

  const {errorEmail, errorEmail2, errorNickName, errorPassword, redirect, lastLink} = view;
  const submitState = (!errorEmail && !errorPassword && !pureFields && connect)?false:true;

  return (<>
    {redirect && <Redirect to={lastLink} />}
    <Loading show={validation}>
      <h2>{cStrings.validatingCredentials}</h2>
    </Loading>
    {!validation && <>
      <Fieldset className="p-3 border">
        <Legend className="width-auto">{cStrings.mainFields}</Legend>
        <div className="form-row">
          <FormGroup className="col-md-6">
            <Label htmlFor="shouldMatchEmail">{cStrings.email}</Label>
            <Input className={errorEmail?errorStyle:""} id="shouldMatchEmail" value={shouldMatchEmail} name="shouldMatchEmail" aria-describedby={cStrings.errorEmail} onBlur={(e) => handleFocus(e,false) } onFocus={(e) => handleFocus(e,true)} onChange={handleChange} placeholder={cStrings.emailTip} />
            {errorEmail && <Small className="form-text text-muted invalid-feedback">{cStrings.errorEmail}</Small>}
          </FormGroup>
          <FormGroup className="col-md-6">
            <Label htmlFor="shouldMatchEmail2">{cStrings.emailRetype}</Label>
            <Input className={errorEmail2?errorStyle:""} id="shouldMatchEmail2" value={shouldMatchEmail2} name="shouldMatchEmail2" aria-describedby={cStrings.errorEmailRetype} onBlur={(e) => handleFocus(e,false) } onFocus={(e) => handleFocus(e,true)} onChange={handleChange} placeholder={cStrings.emailTipRetype} />
            {errorEmail2 && <Small className="form-text text-muted invalid-feedback">{cStrings.errorEmailRetype}</Small>}
          </FormGroup>
        </div>
        <div className="form-row">
          <FormGroup className="col-md-6">
            <Label htmlFor="shouldMatchPassword">{cStrings.password}</Label>
            <Input className={errorPassword?errorStyle:""} id="shouldMatchPassword" value={shouldMatchPassword} type="password" name="shouldMatchPassword"  aria-describedby={cStrings.passwordHelpBlock} onBlur={(e) => handleFocus(e,false) } onFocus={(e) => handleFocus(e,true)} onChange={handleChange} placeholder={cStrings.passwordTip} />
            {errorPassword && <>
              <Small id="passwordHelpBlock" className="form-text text-muted invalid-feedback">{cStrings.errorPassword}</Small>
              <Small className="form-text text-muted invalid-feedback">{cStrings.passwordHelpBlock}</Small>
            </>}
          </FormGroup>
          <FormGroup className="col-md-6">
            <Label htmlFor="shouldMatchNickName">{cStrings.nickName}</Label>
            <Input className={errorNickName?errorStyle:""} id="shouldMatchNickName" value={shouldMatchNickName} name="shouldMatchNickName" aria-describedby={cStrings.errorNickName} onBlur={(e) => handleFocus(e,false) } onFocus={(e) => handleFocus(e,true)} onChange={handleChange} placeholder={cStrings.nickNameTip} />
            {errorNickName && <Small className="form-text text-muted invalid-feedback">{cStrings.errorNickName}</Small>}
          </FormGroup>
        </div>
      </Fieldset>
      <AddressBookForm handlers={{verify:handleAddressBook}} trigger={state.trigger}></AddressBookForm>
      <FormButtons handlers={{allowSubmit:handleCreate}} submitState={submitState}></FormButtons>
      {children}
    </>}
  </>)
}

CreateAccountForm.defaultProps = {
  name: CreateAccountForm.name,
  services: ['api', 'utils', 'customer', 'messages', 'history'],
  stateInit: {connect: true, validation: false, pureFields: true, fields: {
    shouldMatchEmail: '',
    shouldMatchEmail2: '',
    shouldMatchNickName: '',
    shouldMatchPassword: '',
  }}
}
export default CreateAccountForm;
