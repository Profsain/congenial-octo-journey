import { useState, useEffect } from 'react';
import searchListByDateRange from './searchListByDateRangeFunc';

const useSearchByDateRange = (initialList, dateRange, dateKey) => {
  const [searchData, setSearchData] = useState(initialList);

  const searchByDateRange = () => {
    const { fromDate, toDate } = dateRange;
    const searchResult = searchListByDateRange(initialList, fromDate, toDate, dateKey);
    setSearchData(searchResult);
  };

  useEffect(() => {
    searchByDateRange();
  }, [initialList, dateRange, dateKey]);

  return {
    searchData,
  };
};

export default useSearchByDateRange;