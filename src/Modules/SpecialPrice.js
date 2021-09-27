import {useStrings} from '^/Services/useCustomHooks';
import FragmentedString from '%/Common/FragmentedString';
import Price from '%/Common/Price';
import {
  Strong,
} from '@bootstrap-styled/v4';

const SpecialPrice = ({prices, nodeRef}) => {
  const {price, special} = prices;
  const cStrings = useStrings(SpecialPrice.name);
  const  oldPrice = <s><Price price={price}></Price></s>
  const  specialPrice = <Strong className="d-inline mb-2"><Price price={special}></Price></Strong>
  return(
    <div className="d-flex flex-row bd-highlight mb-2" ref={nodeRef}>
      <div className="py-2 mr-4 text-secondary">
        <FragmentedString string={cStrings.old} params={{oldPrice}}></FragmentedString>
      </div>
      <div className="py-2 badge badge-danger">
        <FragmentedString string={cStrings.now} params={{specialPrice}}></FragmentedString>
      </div>
    </div>
  )
}

export default SpecialPrice;