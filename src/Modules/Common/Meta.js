import {Helmet} from "react-helmet";
import {useStartup, useSequence, useDefined, usePubSub} from '^/Services/useCustomHooks'

const Meta = ({name, entries, componentName}) => {
  const {state, stateDispatch, view} = useStartup({elementsList:[]},{},name);

  const makeElements = (metaList = {}) => {
    view.elementsList = [];
    Object.keys(metaList).forEach((TagName, index) => {
      const key = [componentName, index].join('-');
      if(!Array.isArray(metaList[TagName])) {
        view.elementsList.push(<TagName key={key}>{metaList[TagName]}</TagName>)
      } else {
        const paramsArray = [];
        metaList[TagName].forEach(entry => {entry.attrs && paramsArray.push(entry.attrs)})
        paramsArray.forEach( (entry, index) => {
          const subKey = [key,index].join('_');
          view.elementsList.push(<TagName {...entry} key={subKey} />)
        })
      }
    })
  }

  useSequence([
    [,,makeElements(entries)],
    [stateDispatch],
  ],[]);

  const {elementsList} = view
  return(<>{elementsList && <>
    <Helmet>
      {elementsList}
      {/* <base href="/" />
      <meta charSet="utf-8" />
      <title>The mini health store in ReactJS</title>
      <meta name="description" content="The Mini Health Store in React demostrating e-commerce capabilities" />
      <link rel="stylesheet" type="text/css" href="/bootstrap.min.css" />
      <link rel="stylesheet" type="text/css" href="/styles.css" /> */}
    </Helmet>
  </>}</>)
};

Meta.defaultProps = {
  name: Meta.name,
}

export default Meta;
