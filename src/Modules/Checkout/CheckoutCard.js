import {H1, H2, H3} from '@bootstrap-styled/v4';

const CheckoutCard = ({headings, children}) => <>
  {headings.title && <H3 className="border p-3 bg-heading text-heading mt-2">{headings.title}</H3>}
  {children[1]}
</>

export default CheckoutCard;