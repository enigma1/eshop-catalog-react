import {useStrings} from '^/Services/useCustomHooks';
import {
  ButtonGroup,
  Button,
} from '@bootstrap-styled/v4';

const CreateAccountButtons = ({handlers, submitState, children, name}) => {
  const cStrings = useStrings(name);
  return (<>
    <ButtonGroup className="d-flex flex-row-reverse bg-buttons p-2 mb-4 btn-group" role="buttons" aria-label="Create Account Button">
      <Button onClick={handlers.create} className={`btn align-self-end mx-1 btn-primary`} disabled={submitState}>{cStrings.submit}</Button>
    </ButtonGroup>
    {children}
  </>)
}

CreateAccountButtons.defaultProps = {
  name: CreateAccountButtons.name
}
export default CreateAccountButtons;
