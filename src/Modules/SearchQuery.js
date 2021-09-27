import {useStartup} from '^/Services/useCustomHooks';
import SearchHelpIcon from '^/Icons/question-square.svg';

import {
  Collapse,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  Select,
  Option,
  ButtonGroup,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from '@bootstrap-styled/v4';

const act = {
  searchInProducts: (data) => ({
    type: "searchInProducts",
    data
  })
};

const signalResults = (data) => {
  PubSub.publish('SearchQuery.signalResults', data);
}

const viewInit = () => ({help: false, pastSearches: [], fields: {keywords:''}});

const SearchQuery = ({service, viewInit, name, children}) => {
  const {state, stateDispatch, apiDispatch, cStrings} =
    useStartup(service, viewInit(), name);

  const getCriteria = () => {
    const criteria = Object.assign({}, state.fields);
    criteria.limit = 10;
    return criteria;
  }

  const searchForProducts = async () => {
    const {fields} = state;
    fields.keywordsError = fields.keywords.length < 2;
    stateDispatch({fields});

    if(!fields.keywordsError) {
      stateDispatch({ready: false})
      const criteria = getCriteria();
      const result = await apiDispatch(act.searchInProducts(criteria));
      signalResults(result.items || result);
    } else {
      PubSub.publish('messages', cStrings.emptyCriteria);
    }
    stateDispatch({ready: true})
  }

  const toggleHelp = () => {
    stateDispatch({help: !state.help})
  }

  const handleChange = (e) => {
    const {name, type, checked, value} = e.target;
    const {fields} = state;
    fields[name] = type === 'checkbox'?checked:value;
    stateDispatch({fields});
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const {fields, pastSearches} = state;
    pastSearches.push(fields);
    pastSearches.length>10 && pastSearches.shift();
    stateDispatch({pastSearches});
    searchForProducts(fields);
  }

  const handleKeyDown = (event, callback) => {
    if (event.key === 'Enter' && event.shiftKey === false) {
      //event.preventDefault();
    }
  };


  const {help, fields} = state;
  const {shouldMatchAnyWord, shouldMatchDescriptions, keywordsError} = fields;

  return (<>
    <Form onSubmit={handleSubmit} onKeyDown={e => {handleKeyDown(e, handleSubmit)}}>
      <FormGroup>
        <InputGroup className="input-group-prepend">
          <InputGroupButton className="input-group-text p-0">
            <Button onClick={toggleHelp} color="bg-heading p-1">
            <SearchHelpIcon width={24} height={24} alt={cStrings.helpButton} />
            </Button>
          </InputGroupButton>
          <Input type="text" name="keywords" className={`form-control ${keywordsError?'is-invalid':''}`} onChange={handleChange} placeholder={cStrings.helpHint} />
          <Button color="primary" onClick={handleSubmit}>
            {state.ready !== false && <span>{cStrings.buttonGo}</span>}
            {state.ready === false && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
          </Button>
        </InputGroup>
      </FormGroup>
      <FormGroup className="custom-control custom-checkbox">
        <Input id="shouldMatchAnyWord" value={shouldMatchAnyWord} type="checkbox" name="shouldMatchAnyWord" className="custom-control-input" onChange={handleChange} />
        <Label htmlFor="shouldMatchAnyWord" className="custom-control-label">{cStrings.matchWords}</Label>
      </FormGroup>
      <FormGroup className="custom-control custom-checkbox">
        <Input id="shouldMatchDescriptions" value={shouldMatchDescriptions} type="checkbox" name="shouldMatchDescriptions" className="custom-control-input" onChange={handleChange} />
        <Label htmlFor="shouldMatchDescriptions" className="custom-control-label">{cStrings.searchDescriptions}</Label>
      </FormGroup>
      <FormGroup className="custom-control custom-checkbox">
        <Input id="shouldMatchAnyField" value={shouldMatchAnyWord} type="checkbox" name="shouldMatchAnyField" className="custom-control-input" onChange={handleChange} />
        <Label htmlFor="shouldMatchAnyField" className="custom-control-label">{cStrings.searchFields}</Label>
      </FormGroup>
    </Form>
    <Loading show={state.ready === false}>
      <h2>{cStrings.searching}</h2>
    </Loading>
    {state.error &&
      <>{cStrings.emptyResult}</>
    }
    {children}
    <Modal isOpen={help}>
      <ModalHeader toggle={toggleHelp}>{cStrings.modalHeader}</ModalHeader>
      <ModalBody>{cStrings.modalDescription}</ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={toggleHelp}>{cStrings.modalButton}</Button>
      </ModalFooter>
    </Modal>
  </>)
}

SearchQuery.defaultProps = {
  name: SearchQuery.name,
  signalResults: SearchQuery.signalResults,
  service: 'api',
  viewInit
};

export default SearchQuery;
