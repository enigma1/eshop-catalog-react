import {useStrings} from '^/Services/useCustomHooks'
import FragmentedString from '%/Common/FragmentedString';
import {
  P,
  Details,
  Summary
} from '@bootstrap-styled/v4';

const Footer = ({children}) => {
  const year = new Date().getFullYear();
  const cStrings = useStrings('Footer');
  return(
    <div className="mb-4">
      <Details className="border bg-light text-center p-4">
        <Summary>{cStrings.demoShop}</Summary>
        <P>{`${cStrings.license}`}</P>
        <FragmentedString string={cStrings.copyright} params={{year}}></FragmentedString>
        <P>{`${cStrings.desc}`}</P>
        {children}
      </Details>
    </div>
  );
}

export default Footer;
