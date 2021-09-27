//import {useStartup, useSequence} from '^/Services/useCustomHooks';
import PlusSquareFill from '^/Icons/plus-square-fill.svg';
import MinusSquareFill from '^/Icons/dash-square-fill.svg';

const CartQuantity = ({handler, qty=1, max=10}) => {

  return (<div>
    <a onClick={()=>handler(+qty-1)} className={`icon-${qty>1?'enabled':'disabled'}`}>
      <MinusSquareFill width={32} height={32} />
    </a>
    <span className="mx-3">{qty}</span>
    <a onClick={()=>handler(+qty+1)} className={`icon-${qty<max?'enabled':'disabled'}`}>
      <PlusSquareFill width={32} height={32} />
    </a>
  </div>);
}

export default CartQuantity;
