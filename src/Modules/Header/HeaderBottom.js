import {NavLink as NavRouterLink} from 'react-router-dom';
import Messages from '%/Common/Messages';

import {
  Breadcrumb, BreadcrumbItem
} from '@bootstrap-styled/v4';

const HeaderBottom = ({name}) => {
  return (<>
    <Breadcrumb>
      <BreadcrumbItem active>Home</BreadcrumbItem>
    </Breadcrumb>
    <Messages></Messages>
  </>);
}

HeaderBottom.defaultProps = {
  name: HeaderBottom.name
};
export default HeaderBottom;