import {
  Pagination,
  PaginationItem,
  PaginationLink,
} from '@bootstrap-styled/v4';

const PageSplitter = ({split}) => {
  const previous = split.current-1;
  const next = split.current+1;

  const PageList = ({pages}) => pages.map( entry =>
    <PaginationItem key={entry} value={entry} className={split.current===entry?'active':''}>
      <PaginationLink onClick={() => split.handler(entry)} tag="button">{entry}</PaginationLink>
    </PaginationItem>
  );

  return(<>
    <Pagination className="m-0">
      <PaginationItem className={split.previous?'':'d-none'}>
        <PaginationLink previous onClick={() => split.handler(previous)} href="#" />
      </PaginationItem>
      <PageList pages={split.values} />
      <PaginationItem className={split.next?'':'d-none'}>
        <PaginationLink next onClick={() => split.handler(next)} href="#" />
      </PaginationItem>
    </Pagination>
  </>)
}

export default PageSplitter;
