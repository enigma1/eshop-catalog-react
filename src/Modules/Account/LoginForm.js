import {Redirect} from 'react-router-dom';
import {useStartup, useSequence, useDefined, usePubSub} from '^/Services/useCustomHooks';
import FragmentedString from '%/Common/FragmentedString';
import FormButtons from '%/Common/FormButtons';

import {
  Form,
  FormGroup,
  Label,
  Input,
  Small,
} from '@bootstrap-styled/v4';

const fieldsBase = 'shouldMatch';
const errorStyle = 'border-error';

const act = {
  convertStrings: data => ({
    type: "convertStrings",
    data
  }),
  insertMessages: (data) => ({
    type: "addMessages",
    data
  }),
  login: data => ({
    type: "loginCustomer",
    data
  }),
  getConnection: () => ({
    type: 'getConnectionTokenName'
  }),
  getLocation: {
    type: 'getLastLocation'
  },
  setCustomerData: data => ({
    type: 'setCustomer',
    data
  }),
  fields: {
    shouldMatchEmail: (data) => ({type: 'isValidEmail', data}),
    shouldMatchPassword: (data) => ({type: 'isValidPassword', data}),
  }
};


const LoginForm = ({services, children, name, stateInit}) => {
  const {state, stateDispatch, middleware, view, cStrings, cfg} = useStartup(services, stateInit, name);
  const [apiDispatch, utilsDispatch, customerDispatch, messagesDispatch, historyDispatch] = middleware;

  const {validation, pureFields, connect} = state;
  const {shouldMatchEmail, shouldMatchPassword} = state.fields;

  const getData = ({index, value}) => {
    const entries = {
      shouldMatchEmail:     {email: value, min: cfg.minEmailLength, max: cfg.maxEmailLength},
      shouldMatchPassword:  {password: value, min: cfg.minPasswordLength, max: cfg.maxPasswordLength},
    }
    return entries[index] || {};
  };

  const validateLoginFields = (oldState, newState) => {
    console.log('oldState, newState :', oldState, newState);

    const validEmail = oldState.fields.shouldMatchEmail.toLowerCase() === newState.fields.shouldMatchEmail.toLowerCase();
    const validPassowrd = oldState.fields.shouldMatchPassword === newState.fields.shouldMatchPassword;
    return false;
  }

  const checkConnect = (name, connect) => {
    if(!connect) PubSub.publish('messages', cStrings.errorConnect);
    stateDispatch({connect});
  }

  const setResult = ({name, value}) => {
    view[name.replace(fieldsBase, 'error')] = !value;
    if(!value) return {goto:'END'};
  }

  const loginUser = async data => {
    const {nickName, logged, loginError} = data;
    if(nickName) {
      const convertedStrings = await utilsDispatch(act.convertStrings([
        {str:cStrings.welcomeBack, params:{nickName}},
        {str:cStrings.lastLogin, params:{lastLogin: logged[0]}}
      ]));

      const msgList = convertedStrings.map(msg => ({type: 'success', msg, page: view.lastLink}));
      //console.log('act', act.insertMessages(msgList));
      await messagesDispatch(act.insertMessages(msgList));
      await customerDispatch(act.setCustomerData(data));
      //stateDispatch({type:'reset', data:{redirect: true}});
      view.redirect = true;
    } else {
      PubSub.publish('messages', cStrings.invalidCredentials);
      return {goto:'END'};
    }
  }

  const handleChange = async e => {
    const {name, value} = e.target;
    const {...fields} = state.fields;
    fields[name] = value;
    //const result = await utilsDispatch(act.fields[name](value));
    //view[name.replace(fieldsBase, 'error')] = false;
    //stateDispatch({fields, pureFields: !result});
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

  const handleLogin = (e) => {
    e.preventDefault();
    stateDispatch({trigger: Date.now()});
  }

  usePubSub( () => {
    const tokenName = apiDispatch(act.getConnection());
    return [tokenName, checkConnect]
  });

  useDefined([
    [stateDispatch, {validation: true}],
    [utilsDispatch, act.fields.shouldMatchEmail(getData({index: 'shouldMatchEmail', value: shouldMatchEmail})), value => setResult({name: 'shouldMatchEmail', value})],
    [utilsDispatch, act.fields.shouldMatchPassword(getData({index: 'shouldMatchPassword', value: shouldMatchPassword})), value => setResult({name: 'shouldMatchPassword', value})],
    [historyDispatch, act.getLocation, ({link}) => {view.lastLink=link}],
    [apiDispatch, act.login({email: shouldMatchEmail, password: shouldMatchPassword}), loginUser],
    [stateDispatch, {redirect: !!view.redirect}],
    [stateDispatch, {validation: false},,'END']
  ],[state.trigger]);

  // useSequence([
  //   [apiDispatch, act.getContents, setContents],
  //   [apiDispatch, act.viewShipping(), setView],
  // ],[]);


  const {errorEmail, errorPassword, redirect, lastLink} = view;
  const submitState = (!errorEmail && !errorPassword && !pureFields && connect)?false:true;

  return (<>
    {redirect && <Redirect to={lastLink} />}
    <Loading show={state.validation}>
      <h2>{cStrings.validatingCredentials}</h2>
    </Loading>
    {!state.validation && <>
    <FormGroup>
      <Label htmlFor="shouldMatchEmail">{cStrings.email}</Label>
      <Input className={errorEmail?errorStyle:""} id="shouldMatchEmail" value={shouldMatchEmail} name="shouldMatchEmail" aria-describedby={cStrings.errorEmail} onBlur={(e) => handleFocus(e,false) } onFocus={(e) => handleFocus(e,true)} onChange={handleChange} placeholder={cStrings.emailTip} />
      {errorEmail && <Small id="emailHelpBlock" className="form-text text-muted invalid-feedback">{cStrings.errorEmail}</Small>}
    </FormGroup>
    <FormGroup>
      <Label htmlFor="shouldMatchPassword">{cStrings.password}</Label>
      <Input className={errorPassword?errorStyle:""} id="shouldMatchPassword" value={shouldMatchPassword} type="password" name="shouldMatchPassword" onBlur={(e) => handleFocus(e,false) } onFocus={(e) => handleFocus(e,true)} onChange={handleChange} placeholder={cStrings.passwordTip} aria-describedby="passwordHelpBlock" />
      {errorPassword && <Small id="passwordHelpBlock" className="form-text text-muted">{cStrings.errorPassword}</Small>}
      <Small id="passwordHelpBlock" className="form-text text-muted">{cStrings.passwordHelpBlock}</Small>
    </FormGroup>
    <FormButtons handlers={{allowSubmit:handleLogin}} submitState={submitState} submitString={cStrings.login}></FormButtons>
    {children}
    </>}
  </>)
}

LoginForm.defaultProps = {
  name: LoginForm.name,
  services: ['api', 'utils', 'customer', 'messages', 'history'],
  stateInit: {connect: true, validation: false, pureFields: true, fields: {
    shouldMatchEmail: '',
    shouldMatchPassword: ''
  }}
}

export default LoginForm;
