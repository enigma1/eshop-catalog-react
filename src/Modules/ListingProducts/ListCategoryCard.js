import {Link} from 'react-router-dom';
import {useStartup, useSequence} from '^/Services/useCustomHooks';
import {
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

const ListCategoryCard = ({cardData, name, service}) => {
  const {state, stateDispatch, apiDispatch, cStrings} = useStartup(service, {}, name);

  const setImages = images => {stateDispatch({image:images[0]})}

  useSequence([
    [apiDispatch, act.validateImages(cardData), setImages],
  ],[cardData.id])

  const {image={}} = state;
  const description = ReactHtmlParser(cardData.short);
  return(
    <div className="col mb-lg-3 my-sm-1">
      <Card className="h-100">
        <div className="card-body d-flex flex-column">
          <CardTitle>
            <Link to={`/categories/?categories_id=${cardData.id}`}>{cardData.name}</Link>
          </CardTitle>
          <div className="d-flex align-items-start">
            <CardImg {...image} className="list-category-card mr-4 d-none d-md-block d-lg-block d-xl-block"></CardImg>
            <CardText className="d-flex flex-grow-1 justify-content-start">{description}</CardText>
            <Button className="d-block ml-4">
              <Link className="text-white text-decoration-none" to={`/categories/?categories_id=${cardData.id}`}>{cStrings.more}</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

ListCategoryCard.defaultProps = {
  name: ListCategoryCard.name,
  service: 'utils'
}
export default ListCategoryCard;
