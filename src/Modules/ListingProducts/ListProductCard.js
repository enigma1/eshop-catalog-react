import {Link} from 'react-router-dom';
import {useStartup, useSequence} from '^/Services/useCustomHooks';
import {
  Button,
  Card,
  CardTitle,
  CardImg,
  CardText,
  CardBlockquote
} from '@bootstrap-styled/v4';
import CardPrice from '%/CardPrice';

const act = {
  validateImages: (data) => ({
    type: 'validateImages',
    data
  })
}

const ListProductCard = ({cardData, name, service}) => {
  const {state, stateDispatch, apiDispatch, cStrings} = useStartup(service, {}, name);

  const setImages = images => {stateDispatch({image: images[0]})}

  useSequence([
    [apiDispatch, act.validateImages(cardData), setImages],
  ], [cardData.id])

  const {image} = state;
  const description = ReactHtmlParser(cardData.short);

  return(<>
    <div className="col mb-lg-3 my-sm-1">
      <Card className="h-100">
        <div className="card-body d-flex flex-column">
          <CardTitle tag="h4">
            <Link to={`/product-info/?products_id=${cardData.id}`}>{cardData.name}</Link>
          </CardTitle>
          <CardImg {...image}></CardImg>
          <CardText>{description}</CardText>
          <CardBlockquote className="mt-auto">
            <CardPrice prices={cardData}></CardPrice>
            <Button className="btn-block">
              <Link className="text-white text-decoration-none d-block" to={`/product-info/?products_id=${cardData.id}`}>{cStrings.buy}</Link>
            </Button>
          </CardBlockquote>
        </div>
      </Card>
    </div>
  </>)
}

ListProductCard.defaultProps = {
  name: ListProductCard.name,
  service: 'utils'
}

export default ListProductCard;
