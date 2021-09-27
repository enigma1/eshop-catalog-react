import {useStrings} from '^/Services/useCustomHooks';
import {
  H5, Ul, Li
} from '@bootstrap-styled/v4';

const ProductData = ({pData, children, name}) => {
  const cStrings = useStrings(name);
  const {dimensions, weight, sku, model, tag, last_modified} = pData;

  const getDimensions = (dimensions) => {
    let result = '';
    const {value,unit} = dimensions;
    if(typeof value === 'string') {
      result =`${value} ${unit}`;
    } else if(Array.isArray(value)) {
      result = `${value.join(cStrings.separatorDim)} ${unit}`;
    } else if(typeof value ==='object') {
      const entries = Object.entries(value).map( ([key, value]) => `${key}${cStrings.keySep}${value}`);
      result = entries.join(cStrings.objectSpacer);
    }
    return result;
  }

  const getWeight = (weight) => {
    const {value, unit} = weight;
    return `${value}${unit}`;
  }

  const strWeight = getWeight(weight);
  const strDimensions = getDimensions(dimensions);

  return(
    <section className="mr-4 mt-2">
      {children}
      <H5 className="pl-4">{cStrings.features}</H5>
      <Ul>
        {model  && <Li>{cStrings.model} {model}</Li>}
        {sku    && <Li>{cStrings.sku} {sku}</Li>}
        {tag    && <Li>{cStrings.tag} {tag}</Li>}
        {strWeight && <Li>{cStrings.weight} {strWeight}</Li>}
        {strDimensions && <Li>{cStrings.dimensions} {strDimensions}</Li>}
        {last_modified && <Li>{cStrings.updated} {last_modified}</Li>}
      </Ul>
    </section>
  )
}

ProductData.defaultProps = {
  name: ProductData.name,
  pData: {},
  children: [],
};

export default ProductData;
