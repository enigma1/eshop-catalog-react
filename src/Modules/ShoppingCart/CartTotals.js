import {useStrings} from '^/Services/useCustomHooks'
import Price from '%/Common/Price';
const CartTotals = ({name, totals, children}) => {
  const {cStrings} = useStrings(name);
  const {total, count} = totals;
  return (<>
    <section className="d-inline-flex border bg-light p-2">
      <div className="flex-fill">
        {`You have ${count} items total in your cart`}
      </div>
      <div className="justify-content-end text-right">
        <p className="m-1">
        {`Subtotal: `}<Price price={total}></Price>
        </p>
        {`--> Other costs go here`} {children}
      </div>
    </section>
  </>)
}

CartTotals.defaultProps = {
  name: CartTotals.name,
  totals: {}
}

export default CartTotals;
