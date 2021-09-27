import {useStartup, useSequence} from '^/Services/useCustomHooks';

import { Link } from 'react-router-dom';
import {
  H2,
  Button,
  Card,
  CardTitle,
  CardImg,
  CardText,
} from '@bootstrap-styled/v4';

const act = {
  validateImages: (data) => ({
    type: 'validateImages',
    data
  })
}

const ListManufacturerCard = ({cardData, name, service}) => {
  const {state, stateDispatch, apiDispatch, cStrings} = useStartup(service, {}, name);

  const setImages = images => {stateDispatch({image: images[0]})}

  useSequence([
    [apiDispatch, act.validateImages(cardData), setImages],
  ], [cardData.id])

  const {image} = state;

  return(
    <div className="mb-lg-3 my-sm-1">
      <Card className="h-100">
        <div className="card-body d-flex flex-column">
          <CardTitle tag={H2}>
            <Link to={`/manufacturers/?manufacturers_id=${cardData.id}`}>{cardData.name}</Link>
          </CardTitle>
          <div className="d-flex align-items-start">
            <CardImg {...image} className="list-manufacturer-card mr-4 d-none d-md-block d-lg-block d-xl-block"></CardImg>
            <CardText className="d-flex flex-grow-1 justify-content-start">{cardData.short}</CardText>
            <Button className="d-block ml-4">
              <Link className="text-white text-decoration-none" to={`/manufacturers/?manufacturers_id=${cardData.id}`}>{cStrings.products}</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

ListManufacturerCard.defaultProps = {
  name: ListManufacturerCard.name,
  service: 'utils',
}

export default ListManufacturerCard;