import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Button, Modal, Box, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import PieChartList from './pieChartList';
import PieChartYear from './pieChartYear';

function QuotaPrint() {
    const [data, setData] = useState([]);
    const [sumYearData, setSumYearData] = useState([]);
    const [sumUserData, setSumUserData] = useState([]);
    const [filteredSumYearData, setFilteredSumYearData] = useState([]);
    const [filteredSumUserData, setFilteredSumUserData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [filterYear, setFilterYear] = useState('');
    const [filterDivision, setFilterDivision] = useState('');
    const [filterUser, setFilterUser] = useState('');
    const [filterStartDate, setFilterStartDate] = useState(null);
    const [filterEndDate, setFilterEndDate] = useState(null);
    const [filterStatus, setFilterStatus] = useState('');
    const [filterBlackWhite, setFilterBlackWhite] = useState(false);
    const [filterColor, setFilterColor] = useState(false);
    const [years, setYears] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [filterCriteria, setFilterCriteria] = useState({
        year: '',
        blackWhite: false,
        color: false
    });
    const navigate = useNavigate();

    useEffect(() => {
    const fetchData = async () => {
        try {
            const [yearsResponse, divisionsResponse, statusesResponse, sumYearResponse, sumUserResponse] = await Promise.all([
                axios.get('http://localhost:5000/api/year'),
                axios.get('http://localhost:5000/api/division'),
                axios.get('http://localhost:5000/api/status'),
                axios.get('http://localhost:5000/api/sumYear'),
                axios.get('http://localhost:5000/api/sumUser')
            ]);

            const yearData = yearsResponse.data.map(item => item.Year);
            const divisionData = divisionsResponse.data.map(item => item.divisionName);
            const statusData = statusesResponse.data.map(item => item.requestStatus);
            setYears(yearData);
            setDivisions(divisionData);
            setStatuses(statusData);

            setSumYearData(sumYearResponse.data);
            setSumUserData(sumUserResponse.data);

            if (sumYearResponse.data.length > 0) {
                const mostRecentYear = Math.max(...sumYearResponse.data.map(item => item.year));
                setFilterYear(mostRecentYear);
                setFilterCriteria(prevCriteria => ({ ...prevCriteria, year: mostRecentYear }));
                fetchFilteredData(mostRecentYear);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();
}, []); // ทำให้ useEffect ทำงานเพียงครั้งเดียวเมื่อ component ถูกโหลด

useEffect(() => {
    // Filter sumYearData based on filter criteria
    const filteredSumYear = sumYearData.filter(item => {
        const isYearMatch = !filterCriteria.year || item.year === filterCriteria.year;
        const isBlackWhiteMatch = !filterCriteria.blackWhite || item.totalBlackWhite > 0;
        const isColorMatch = !filterCriteria.color || item.totalColor > 0;

        return isYearMatch && isBlackWhiteMatch && isColorMatch;
    });

    setFilteredSumYearData(filteredSumYear);

    // Also filter sumUserData based on filter criteria
    const filteredSumUser = sumUserData.filter(item => {
        const isYearMatch = !filterCriteria.year || item.year === filterCriteria.year;
        return isYearMatch;
    });

    setFilteredSumUserData(filteredSumUser);
}, [filterCriteria, sumYearData, sumUserData]);

    const fetchFilteredData = (year, division, user, startDate, endDate, status, blackWhite, color) => {
        axios.get('http://localhost:5000/api/list', {
            params: {
                year,
                division,
                user,
                startDate: startDate ? moment(startDate).format('YYYY-MM-DD') : null,
                endDate: endDate ? moment(endDate).format('YYYY-MM-DD') : null,
                status,
                blackWhite,
                color
            }
        })
        .then(response => {
            const formattedData = response.data.map(row => ({
                ...row,
                deliveryDate: moment(row.deliveryDate).format('DD-MM-YYYY'),
                requestDateStart: moment(row.requestDateStart).format('DD-MM-YYYY'),
                requestDateEnd: moment(row.requestDateEnd).format('DD-MM-YYYY'),
                priorityName: row.priorityName
            }));
            setData(formattedData);
            setFilteredData(formattedData);
        })
        .catch(error => {
            console.error('Error fetching filtered data:', error);
        });
    };

    const handleFilter = () => {
        // Update filter criteria state
        setFilterCriteria({
            year: filterYear,
            blackWhite: filterBlackWhite,
            color: filterColor
        });

        fetchFilteredData(filterYear, filterDivision, filterUser, filterStartDate, filterEndDate, filterStatus, filterBlackWhite, filterColor);
        setFilterModalOpen(false);
    };

    const columns = [
        { field: 'requestNo', headerName: 'Request No.', width: 130 },
        { field: 'subjectTypeName', headerName: 'Topic', width: 130 },
        { field: 'blackWhite', headerName: 'Black & White', width: 130 },
        { field: 'color', headerName: 'Color', width: 130 },
        { field: 'requester', headerName: 'Requester', width: 130 },
        { field: 'divisionName', headerName: 'Division', width: 130 },
        { field: 'deliveryDate', headerName: 'Date', width: 130 },
        { field: 'requestDateStart', headerName: 'Start', width: 130 },
        { field: 'requestDateEnd', headerName: 'End', width: 130 },
        { field: 'ownerJob', headerName: 'Owner Job', width: 130 },
        { field: 'requestStatus', headerName: 'Request Status', width: 130 },
        {
            field: 'view',
            headerName: 'Detail',
            width: 100,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewClick(params.row)}
                >
                    View
                </Button>
            ),
        },
    ];

    const handleViewClick = (rowData) => {
        navigate('/view-detail', { state: { data: rowData } });
    };

    const handleSearch = (event) => {
        const searchText = event.target.value;
        setSearchText(searchText);

        const filtered = data.filter(item => {
            const lowerSearchText = searchText.toLowerCase();
            return (
                item.requestNo.toLowerCase().includes(lowerSearchText) ||
                item.subjectTypeName.toLowerCase().includes(lowerSearchText) ||
                item.requester.toLowerCase().includes(lowerSearchText) ||
                item.divisionName.toLowerCase().includes(lowerSearchText) ||
                item.deliveryDate.toLowerCase().includes(lowerSearchText) ||
                item.ownerJob.toLowerCase().includes(lowerSearchText) ||
                item.requestStatus.toLowerCase().includes(lowerSearchText)
            );
        });

        setFilteredData(filtered);
    };

    return (
        <div>
            <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Quota Print</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ flex: 1, marginLeft: '10%' }}>
                    <PieChartYear data={filteredSumYearData} />
                </div>
                <div style={{ flex: 1, marginRight: '10%' }}>
                    <PieChartList data={filteredSumUserData} />
                </div>
            </div>
            <div style={{ display: 'flex', marginBottom: '20px' }}>
                <TextField
                    label="Search"
                    variant="outlined"
                    value={searchText}
                    onChange={handleSearch}
                    style={{ marginRight: '10px', width: '400px' }}
                />
                <Button variant="outlined" onClick={() => setFilterModalOpen(true)}>
                    Filter
                </Button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ width: '100%', height: 400 }}>
                    <DataGrid
                        rows={filteredData.map((row, index) => ({ id: index, ...row }))}
                        columns={columns}
                        pageSize={5}
                        checkboxSelection={true}
                        autoHeight
                    />
                </div>
            </div>

            <Modal
                open={filterModalOpen}
                onClose={() => setFilterModalOpen(false)}
                aria-labelledby="filter-modal-title"
                aria-describedby="filter-modal-description"
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '1px solid #000', boxShadow: 24, p: 4 }}>
                    <h2 id="filter-modal-title">Filters</h2>
                    <FormControl fullWidth style={{ marginBottom: '20px' }}>
                        <InputLabel id="filter-year-label">Select Year</InputLabel>
                        <Select
                            labelId="filter-year-label"
                            id="filter-year"
                            value={filterYear}
                            label="Select Year"
                            onChange={(e) => setFilterYear(e.target.value)}
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            {years.map(year => (
                                <MenuItem key={year} value={year}>{year}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth style={{ marginBottom: '20px' }}>
                        <InputLabel id="filter-division-label">Select Division</InputLabel>
                        <Select
                            labelId="filter-division-label"
                            id="filter-division"
                            value={filterDivision}
                            label="Select Division"
                            onChange={(e) => setFilterDivision(e.target.value)}
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            {divisions.map(division => (
                                <MenuItem key={division} value={division}>{division}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="User"
                        variant="outlined"
                        value={filterUser}
                        onChange={(e) => setFilterUser(e.target.value)}
                        fullWidth
                        style={{ marginBottom: '20px' }}
                    />
                    <TextField
                        label="Start Date"
                        variant="outlined"
                        type="date"
                        value={filterStartDate ? moment(filterStartDate).format('YYYY-MM-DD') : ''}
                        onChange={(e) => setFilterStartDate(e.target.value)}
                        fullWidth
                        style={{ marginBottom: '20px' }}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="End Date"
                        variant="outlined"
                        type="date"
                        value={filterEndDate ? moment(filterEndDate).format('YYYY-MM-DD') : ''}
                        onChange={(e) => setFilterEndDate(e.target.value)}
                        fullWidth
                        style={{ marginBottom: '20px' }}
                        InputLabelProps={{ shrink: true }}
                    />
                    <FormControl fullWidth style={{ marginBottom: '20px' }}>
                        <InputLabel id="filter-status-label">Select Status</InputLabel>
                        <Select
                            labelId="filter-status-label"
                            id="filter-status"
                            value={filterStatus}
                            label="Select Status"
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            {statuses.map(status => (
                                <MenuItem key={status} value={status}>{status}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControlLabel
                        control={<Checkbox checked={filterBlackWhite} onChange={(e) => setFilterBlackWhite(e.target.checked)} />}
                        label="Filter Black & White"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={filterColor} onChange={(e) => setFilterColor(e.target.checked)} />}
                        label="Filter Color"
                    />
                    <Box style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                        <Button variant="outlined" onClick={() => setFilterModalOpen(false)} style={{ marginRight: '10px' }}>
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={handleFilter}>
                            Apply
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}

export default QuotaPrint;
