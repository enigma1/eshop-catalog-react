import {
  Label,
  Select,
  Option,
} from '@bootstrap-styled/v4';

const FilterList = ({filters}) => filters.values.map( entry => <Option key={entry.id} value={entry.id}>{entry.value}</Option>);
const ListFilter = ({filterData, className}) => {
  return(
    <div className={className}>
      <Label htmlFor={filterData.id} className="input-group-text align-self-center m-0 h-100">{filterData.title}</Label>
      <Select value={filterData.defaultValue} onChange={filterData.handler} className="custom-select wh-auto" id={filterData.id} >
        <FilterList filters={filterData} />
      </Select>
    </div>
  )
}

export default ListFilter;
