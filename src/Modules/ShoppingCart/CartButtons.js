import {useStrings} from '^/Services/useCustomHooks';
import {
  ButtonGroup,
  Button,
} from '@bootstrap-styled/v4';

const CartButtons = ({handlers, children, name}) => {
  const cStrings = useStrings(name);
  return (<>
    <ButtonGroup className="d-flex flex-row-reverse bg-buttons p-2 mb-4 btn-group" role="buttons" aria-label="Checkout Buttons">
      <Button onClick={handlers.checkout} className="btn btn-primary align-self-end mx-1">{cStrings.checkout}</Button>
    </ButtonGroup>
    {children}
  </>)
}

CartButtons.defaultProps = {
  name: CartButtons.name
}
export default CartButtons;
