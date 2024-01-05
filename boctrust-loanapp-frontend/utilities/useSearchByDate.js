import { useState, useEffect } from 'react';
import searchListByDate from './searchListByDate';

const useSearchByDate = (initialList, dateKey) => {
  const [filteredDateData, setFilteredDateData] = useState(initialList);

  const searchByDate = () => {
    const currDate = new Date().toISOString();
    const searchResult = searchListByDate(initialList, currDate, dateKey);
    
    setFilteredDateData(searchResult);
  };

  useEffect(() => {
    searchByDate();
  }, [initialList, dateKey]);

  return {
    filteredDateData,
  };
};

export default useSearchByDate;