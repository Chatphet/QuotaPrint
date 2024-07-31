import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import FilterSearch from './filterSearch';
import PieChartList from './pieChartList';
import PieChartYear from './pieChartYear';

function QuotaPrint() {
  const [data, setData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [years, setYears] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showBlackWhite, setShowBlackWhite] = useState(false);
  const [showColor, setShowColor] = useState(false);
  const [searchUser, setSearchUser] = useState('');
  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [listResponse, yearResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/list'),
        axios.get('http://localhost:5000/api/list/year')
      ]);

      const sortedData = listResponse.data.sort((a, b) => new Date(b.deliveryDate) - new Date(a.deliveryDate));
      setData(sortedData);

      setYearlyData(yearResponse.data);

      const uniqueYears = [...new Set(sortedData.map(item => item.Year))].sort((a, b) => b - a);
      setYears(uniqueYears);

      if (uniqueYears.length > 0) {
        setSelectedYear(uniqueYears[0]);
      }

      const uniqueStatuses = [...new Set(sortedData.map(item => item.requestStatus))].sort();
      setStatuses(uniqueStatuses);
      const uniqueDivisions = [...new Set(sortedData.map(item => item.divisionName))].sort();
      setDivisions(uniqueDivisions);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleYearChange = (event) => setSelectedYear(event.target.value);
  const handleSearchTextChange = (event) => setSearchText(event.target.value);
  const handleStartDateChange = (event) => setStartDate(event.target.value);
  const handleEndDateChange = (event) => setEndDate(event.target.value);
  const handleShowBlackWhiteChange = (event) => setShowBlackWhite(event.target.checked);
  const handleShowColorChange = (event) => setShowColor(event.target.checked);
  const handleSearchUserChange = (event) => setSearchUser(event.target.value);
  const handleStatusChange = (event) => setSelectedStatus(event.target.value);
  const handleDivisionChange = (event) => setSelectedDivision(event.target.value);

  const handleSearch = () => {
    // Update data filtering when Search is clicked
    const filteredYearlyData = selectedYear 
      ? yearlyData.filter(item => item.Year === parseInt(selectedYear))
      : yearlyData;

    const filteredData = data.filter(row => {
      const matchesYear = selectedYear ? row.Year === selectedYear : true;
      const matchesText = Object.values(row).some(value =>
        value.toString().toLowerCase().includes(searchText.toLowerCase())
      );
      const matchesStartDate = startDate ? new Date(row.deliveryDate) >= new Date(startDate) : true;
      const matchesEndDate = endDate ? new Date(row.deliveryDate) <= new Date(endDate) : true;
      const matchesBlackWhite = showBlackWhite ? row.totalBlackWhite > 0 : true;
      const matchesColor = showColor ? row.totalColor > 0 : true;
      const matchesUser = searchUser ? row.requester.toLowerCase().includes(searchUser.toLowerCase()) : true;
      const matchesStatus = selectedStatus ? row.requestStatus === selectedStatus : true;
      const matchesDivision = selectedDivision ? row.divisionName === selectedDivision : true;
      return matchesYear && matchesText && matchesStartDate && matchesEndDate && matchesBlackWhite && matchesColor && matchesUser && matchesStatus && matchesDivision;
    });

    setYearlyData(filteredYearlyData);
    setData(filteredData);
  };

  const columns = [
    { field: 'requestNo', headerName: 'Request No.', width: 130 },
    { field: 'requestName', headerName: 'Topic', width: 130 },
    { field: 'totalBlackWhite', headerName: 'Black & White', width: 130 },
    { field: 'totalColor', headerName: 'Color', width: 130 },
    { field: 'requester', headerName: 'Requester', width: 130 },
    { field: 'divisionName', headerName: 'Division', width: 130 },
    { field: 'deliveryDate', headerName: 'Date', width: 130 },
    { field: 'dateStart', headerName: 'Start', width: 130 },
    { field: 'dateEnd', headerName: 'End', width: 130 },
    { field: 'ownerJob', headerName: 'Owner Job', width: 130 },
    { field: 'requestStatus', headerName: 'Request Status', width: 130 },
  ];

  return (
    <div>
      <h1>Quota Print</h1>
      <PieChartYear data={yearlyData} />
      <PieChartList data={data} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <FilterSearch
          years={years}
          selectedYear={selectedYear}
          handleYearChange={handleYearChange}
          searchText={searchText}
          handleSearchTextChange={handleSearchTextChange}
          startDate={startDate}
          handleStartDateChange={handleStartDateChange}
          endDate={endDate}
          handleEndDateChange={handleEndDateChange}
          showBlackWhite={showBlackWhite}
          handleShowBlackWhiteChange={handleShowBlackWhiteChange}
          showColor={showColor}
          handleShowColorChange={handleShowColorChange}
          searchUser={searchUser}
          handleSearchUserChange={handleSearchUserChange}
          statuses={statuses}
          selectedStatus={selectedStatus}
          handleStatusChange={handleStatusChange}
          divisions={divisions}
          selectedDivision={selectedDivision}
          handleDivisionChange={handleDivisionChange}
          onSearch={handleSearch}  // Pass handleSearch function as a prop
        />
        <div style={{ width: '100%' }}>
          <DataGrid
            rows={data.map((row, index) => ({ id: index, ...row }))}
            columns={columns}
            pageSize={5}
            checkboxSelection={false}
          />
        </div>
      </div>
    </div>
  );
}

export default QuotaPrint;
