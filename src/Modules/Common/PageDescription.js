import {P} from '@bootstrap-styled/v4';

const PageDescription = ({contents, children, html=true}) => {
  const description = html?ReactHtmlParser(contents.description):contents.description;
  return(<>
    <P className="border p-3 bg-text text-description mt-2">{description}</P>
    {children}
  </>)
}

export default PageDescription;