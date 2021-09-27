import {H1} from '@bootstrap-styled/v4';

const PageTitle = ({headings, children, html=false}) => {
  const title = html?ReactHtmlParser(headings.title):headings.title;
  return(<>
    <H1 className="border p-3 bg-heading text-heading mt-2">{title}</H1>
    {children}
  </>)
}

export default PageTitle;