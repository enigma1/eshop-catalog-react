import {useStrings} from '^/Services/useCustomHooks';
import FragmentedString from '%/Common/FragmentedString';
import {P, H4} from '@bootstrap-styled/v4';

const ProductDetails = ({details, children, html=true}) => {
  const cStrings = useStrings(ProductDetails.name);
  const description = html?ReactHtmlParser(details.desc):details.desc;
  return (
    <>
      <H4 className="border p-2 bg-heading text-heading mt-2">
        <FragmentedString string={cStrings.subTitle} params={{name: details.name}}></FragmentedString>
      </H4>
      <P className="p-2">{description}</P>
      {children}
    </>
  );
}
export default ProductDetails