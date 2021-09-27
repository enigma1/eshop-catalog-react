import {useStartup, useSequence, useDefined, usePubSub} from '^/Services/useCustomHooks'

import {
  Breadcrumb, BreadcrumbItem
} from '@bootstrap-styled/v4';

const act = {
  getTokenName: () => ({
    type: getTokenName
  }),
  // setLocation: {
  //   type: 'setLastLocation'
  // },
  // getHistoryRecord: {
  //   type: 'getHistoryRecord'
  // },
  // setHistoryRecord: data => ({
  //   type: 'setHistoryRecord',
  //   data
  // })
};

const ItemList = (items) => {
  return items.map( (entry, idx) =>
    <BreadcrumbItem key={[idx, entry.link].join('-')}><a href={entry.link}>{entry.text}</a></BreadcrumbItem>
  );
}

const VisitedPath = ({service, name}) => {
  const {state, stateDispatch, apiDispatch, cStrings} = useStartup(service, {}, name);

  const updateCrumb = () => {
    stateDispatch();
  }

  usePubSub( () => {
    const tokenName = apiDispatch(act.getTokenName());
    return [tokenName, updateCrumb]
  });

  useSequence([
    [apiDispatch, act.setLocation],
    [stateDispatch],
  ],[])

  return (<>
    <Breadcrumb>
      <BreadcrumbItem tag={A} href="javascript:;" active>{cStrings.home}</BreadcrumbItem>
      <ItemList></ItemList>
    </Breadcrumb>
  </>);
}

VisitedPath.defaultProps = {
  name: VisitedPath.name,
  service: 'history'
};
export default VisitedPath;
