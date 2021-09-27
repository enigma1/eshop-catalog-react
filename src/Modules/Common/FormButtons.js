import {useStrings} from '^/Services/useCustomHooks';
import {
  ButtonGroup,
  Button,
} from '@bootstrap-styled/v4';

const FormButtons = ({handlers, submitState, submitString, children, name}) => {
  const cStrings = useStrings(name);

  return (<>
    <ButtonGroup className="d-flex flex-row-reverse bg-buttons p-2 mb-4 btn-group" role="buttons" aria-label="Create Account Button">
      <Button onClick={handlers.allowSubmit} className={`btn align-self-end mx-1 btn-primary`} disabled={submitState}>{submitString || cStrings.continue}</Button>
    </ButtonGroup>
    {children}
  </>)
}

FormButtons.defaultProps = {
  name: FormButtons.name
}
export default FormButtons;
