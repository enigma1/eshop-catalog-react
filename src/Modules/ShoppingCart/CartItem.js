import {useStartup} from '^/Services/useCustomHooks';

import { Link } from 'react-router-dom';
import CartQuantity from '%/ShoppingCart/CartQuantity';
import Price from '%/Common/Price';
import {
  Small,
  P,
  Card,
  CardImg,
  CardSubtitle,
  CardBlockquote,
  Button,
} from '@bootstrap-styled/v4';

const act = {
  changeQuantity: (data) => ({
    type: 'changeQuantity',
    data
  }),
  deleteCartItem: (data) => ({
    type: 'deleteCartItem',
    data
  })
}

const ItemOptionsList = ({options}) => Object.entries(options).map((entry, index) =>
  <Small className="d-block" key={index}><em>{`${entry[0]}: ${entry[1]}`}</em></Small>
);

const CartItem = ({cartData}) => {
  const {apiDispatch, cStrings} = useStartup('cart', {}, 'CartItem');
  const uid = cartData[0];

  const removeItem = () => {
    apiDispatch(act.deleteCartItem({uid:cartData[0]}));
  };

  const updateQty = (qty) => {
    apiDispatch(act.changeQuantity({uid:cartData[0], qty}));
  };

  const {id, qty, price, name, image, attrs} = cartData[1];

  return (<>
    <Card className="card-body flex-row">
      <div className="col-2 d-none d-md-block d-lg-block d-xl-block">
      <Link to={`/product-info/?products_id=${id}`}>
        <CardImg className="cart-item" src={image.src} alt={name}></CardImg>
      </Link>
      </div>
      <CardSubtitle className="col-6">
        <P className="d-flex align-items-center">
          <Link to={`/product-info/?products_id=${id}`}>{name}</Link>
          <Button onClick={removeItem} className="btn btn-link text-danger">[{cStrings.remove}]</Button>
        </P>
        <ItemOptionsList options={attrs} />
      </CardSubtitle>
      <div className="align-self-center col-2">
        <CartQuantity uid={uid} qty={qty} handler={updateQty} sContext="cart"></CartQuantity>
      </div>
      <CardBlockquote className="align-self-center text-right col-2">
        <Price price={qty*price}></Price>
      </CardBlockquote>
    </Card>
  </>)
}

export default CartItem;
