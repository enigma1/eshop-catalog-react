const historyLabel = 'history'
const getTokenName = () => historyLabel;

const initialize = () => getHistory();

const getDefaultRecordsHistory = () => ({
  auto: true,
  depth: 10,
  records: [],
})

const getDefaultHistory = () => ({
  ts: Date.now(),
  location: {
    pathName: "/",
    search: "",
    link: "/"
  },
  components: {}
})

const setHistory = (history = getDefaultHistory()) => {
  localStorage.setItem(historyLabel, JSON.stringify(history));
  return history;
}

const getHistory = () => {
  let history;
  try {
    history = JSON.parse(localStorage.getItem(historyLabel));
    if(!history) throw 'No History'
  } catch(e) {
    history = setHistory();
  }
  return history;
}

const getHistoryRecord = (name) => {
  const allHistory = JSON.parse(localStorage.getItem(historyLabel));
  return allHistory[name] || getDefaultRecordsHistory();
}

const setHistoryRecord = (name, newRecord) => {
  const allHistory = JSON.parse(localStorage.getItem(historyLabel));
  const currentRecord = allHistory[name] || getDefaultRecordsHistory();
  allHistory[name] = {...currentRecord, ...newRecord};
  if(allHistory.length > 0) PubSub.publish(getTokenName(), allHistory[name].records);
  setHistory(allHistory);
}

const recordLocation = (name, data) => {
  if(data.link === '/') return;
  const history = getHistoryRecord(name);
  let result = history.records.filter(entry => entry.link !== data.link)
  result.unshift(data.link);
  result.slice(history.depth);
  setHistoryRecord(result);
}

const autoRecord = name => {
  const {pathname, search} = location;
  const data = {
    location: {
      pathname,
      search,
      link: `${pathname}${search}`
    }
  }
  return recordLocation(name, data);
}

const getLastLocation = () => {
  const history = getHistory().location;
  if(!history.location) {
    history.location = {
      pathName: "/",
      search: "",
      link: "/"
    };
    localStorage.setItem(historyLabel, history);
  }
  return history.location;
}

const setLastLocation = () => {
  const history = getHistory();
  const {pathname, search} = location;
  const data = {
    location: {
      pathname,
      search,
      link: `${pathname}${search}`
    }
  }

  history.location = data;
  const allData = JSON.stringify(history);
  localStorage.setItem(historyLabel, allData);

  Object.keys(history.components).forEach(name => {
    history.components[name].auto && recordLocation(name, data);
  })
}

export default {
  getTokenName,
  autoRecord,
  getLastLocation,
  setLastLocation,
  getHistoryRecord,
  setHistoryRecord,
  initialize,
}
