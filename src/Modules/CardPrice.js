import {useStrings} from '^/Services/useCustomHooks';
import {switchComponentFor} from '%/Override';
import FragmentedString from '%/Common/FragmentedString';
import Price from '%/Common/Price';
import {
  P, Strong,
} from '@bootstrap-styled/v4';

const CardPrice = ({prices}) => {
  const cStrings = useStrings(CardPrice.name);
  const ourPrice = <Strong className="mb-2"><Price price={prices.price}></Price></Strong>
  return(
    <P>
      <FragmentedString string={cStrings.ourPrice} params={{ourPrice}}></FragmentedString>
    </P>
  );
}

export default switchComponentFor(CardPrice);
