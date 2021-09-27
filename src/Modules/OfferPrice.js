import {useStrings} from '^/Services/useCustomHooks';
import FragmentedString from '%/Common/FragmentedString';
import Price from '%/Common/Price';

import {
  Strong,
} from '@bootstrap-styled/v4';

const OfferPrice = ({prices}) => {
  const cStrings = useStrings(OfferPrice.name);
  const {price, special} = prices;
  const  oldPrice = <s><Price price={price}></Price></s>
  const  offerPrice = <Strong className="d-inline mb-2"><Price price={special}></Price></Strong>
  return(
    <div className="d-flex flex-row bd-highlight mb-2">
      <div className="py-2 mr-4 text-secondary">
        <FragmentedString string={cStrings.old} params={{oldPrice}}></FragmentedString>
      </div>
      <div className="p-2 badge badge-danger text-wrap text-height-1d5">
        <FragmentedString string={cStrings.offer} params={{offerPrice}}></FragmentedString>
      </div>
    </div>
  );
}

export default OfferPrice;
