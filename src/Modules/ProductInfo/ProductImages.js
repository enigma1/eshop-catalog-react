import {useStartup, useSequence} from '^/Services/useCustomHooks';

import {
  Img,
  ListGroup,
  Modal,
  ModalHeader,
  ModalBody
} from '@bootstrap-styled/v4';

const act = {
  validateImages: (data) => ({
    type: 'validateImages',
    data
  })
}

const ThumbsList = ({entries=[], width, height, handler}) => entries.map((img, index) =>
  <Img key={index}
    onClick={() => handler(img)}
    style={{width, height}}
    className="img-fluid border" {...img}>
  </Img>
);

const ProductImages = ({name, images, service}) => {
  const {state, stateDispatch, apiDispatch, cfg} = useStartup(service, {}, name);

  const setImages = (images) => {
    stateDispatch({
      mainImage: images[0],
      images,
    })
  }

  const setMainImage = (mainImage) => {stateDispatch({mainImage})};

  const setFullSize = () => {
    stateDispatch({showFullSize: !state.showFullSize})
  }

  useSequence([
    [apiDispatch, act.validateImages(images), setImages]
  ])

  const {thumbs, main} = cfg;
  const {mainImage={}, showFullSize=false, ready} = state;

  return(<>
    <section>
      <Img onClick={setFullSize} style={{width: main.imageWidth, height: main.imageHeight}} {...mainImage} className="border img-fluid"></Img>
      <ListGroup className="flex-row flex-wrap  list-group mb-lg-3 my-sm-1 align-items-sm-center">
        <ThumbsList entries={state.images} width={thumbs.imageWidth} height={thumbs.imageHeight} handler={setMainImage} />
      </ListGroup>
    </section>
    <Modal isOpen={showFullSize} toggle={setFullSize}>
      <ModalHeader toggle={setFullSize}>{mainImage.alt}</ModalHeader>
      <ModalBody>
        <Img {...mainImage} className="border img-fluid" style={{width: 'auto', height: 'auto'}}></Img>
      </ModalBody>
    </Modal>
  </>)
}

ProductImages.defaultProps = {
  name: ProductImages.name,
  service: 'utils'
};

export default ProductImages;
