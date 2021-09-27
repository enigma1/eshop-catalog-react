import {useStrings} from '^/Services/useCustomHooks';
const CartHeader = ({children}) => {
  const cStrings = useStrings('CartHeader');
  return (<>
    <div className="d-flex flex-row border bg-light text-center mt-2 p-2">
      <span className="col-2 d-none d-md-block d-lg-block d-xl-block">{cStrings.img}</span>
      <span className="text-left col-6">{cStrings.desc}</span>
      <span className="text-left col-2">{cStrings.qty}</span>
      <span className="text-right col-2">{cStrings.price}</span>
    </div>
    {children}
  </>)
}

export default CartHeader;