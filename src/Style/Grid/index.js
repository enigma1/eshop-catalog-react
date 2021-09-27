import {
  Row as RowOrg,
} from '@bootstrap-styled/v4';

const o25 = `
  > .col {
    flex: 0 0 25%;
    max-width: 25%;
    margin-bottom: 16px;
  }`;

  const o33 = `
  > .col {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
    margin-bottom: 20px;
  }`;

  const o50 = `
  > .col {
    flex: 0 0 50%;
    max-width: 50%;
    margin-bottom: 24px;
  }`;

  const rowCols = {
    "row-cols-3": o33,
    "row-cols-4": o25,
    "row-cols-2": o50
  };


const Row = styled(RowOrg)`
  &.row-cols-2 > .col {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
    width: 33.333333%;
    margin-bottom: 20px;
  }
`;


export {
  Row
}
