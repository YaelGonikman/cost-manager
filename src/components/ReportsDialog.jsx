// Yael Gonikman 206752396 0522430787 yaelgonikman@gmail.com
// Shay peretz 319126405 0508317979 shay28561@gmail.com

import React, { useState, useEffect } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Tooltip, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { tooltipClasses } from '@mui/material/Tooltip';

function ReportsDialog(props) {
  const { onClose, open, costs, categories } = props; // Destructur props
  const [relevantCosts, setRelevantCosts] = useState([]) // Relevant costs according to filter
  const [month, setMonth] = useState(1); // Month
  const [year, setYear] = useState(2023); // Year

  useEffect(() => {
    setRelevantCosts(costs)
  }, [costs])

  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }));

  // Render row
  const renderRaw = (index, costs, prop, type) => {
    return <TextField
      id='outlined-read-only-input'
      value={costs[index][prop]}
      type={type}
    />
  }


  // Render Category row
  const renderCategoryRaw = (index, costs) => {
    return <TextField
      id='outlined-read-only-input'
      value={categories.filter((cat) => cat.value === costs[index]['category'])[0].label}
      InputProps={{
        readOnly: true,
      }}
    />
  }

  // Filer by month and year
  const filterByMonthAndYear = () => {
    setRelevantCosts(costs.filter(item => {
      return item.createdAt.getMonth() + 1 === month && item.createdAt.getFullYear() === year;
    }))
  }

  const getCreatedAtValue = (date) => {
    return date.toLocaleString("en-US", { timeZone: "Israel" })
  }

  // Render list of months
  const renderMonth = () => {
    const months = []
    for (let i = 1; i < 13; i++) {
      months.push([<MenuItem key={i} value={i}>{i}</MenuItem>])
    }
    return months
  }

  const handleMonthChange = (month) => {
    setMonth(month.target.value)
  }

  const handleYaerChange = (year) => {
    setYear(year.target.value)
  }

  return (
    <Dialog onClose={onClose} open={open} fullScreen>
      <div style={{ display: 'flex' }}>
        <IconButton
          edge='start'
          color='inherit'
          onClick={onClose}
          aria-label='close'
          style={{ margin: 10 }}
        >
          <CloseIcon />
        </IconButton>
        <DialogTitle>Reports</DialogTitle>
      </div>
      <div style={{ margin: 10, display: 'flex' }}>
        <Select
          style={{ width: "100px", margin: "10px" }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={month}
          label="Age"
          onChange={handleMonthChange}
        >
          {renderMonth()}
        </Select>
        <Select
          style={{ width: "100px", margin: "10px" }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={year}
          label="Age"
          onChange={handleYaerChange}
        >
          <MenuItem value={2021}>{2021}</MenuItem>
          <MenuItem value={2022}>{2022}</MenuItem>
          <MenuItem value={2023}>{2023}</MenuItem>
        </Select>
        <Button style={{ margin: 10 }} onClick={filterByMonthAndYear}>Filter</Button>
      </div>
      <Table >
        <TableHead>
          <TableRow>
            <TableCell>Created At</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Cost</TableCell>
            <TableCell>Category</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {relevantCosts.map((cost, index) => (
            <HtmlTooltip key={index}
              title={
                <React.Fragment>
                  <Typography color='inherit'>
                    Description
                  </Typography>
                  {relevantCosts[index]['description']}
                </React.Fragment>
              }
            >
              <TableRow key={index}>
                <TableCell >
                  <TextField
                    id='outlined-read-only-input'
                    value={getCreatedAtValue(relevantCosts[index]['createdAt'])}
                  />
                </TableCell>
                <TableCell>
                  {renderRaw(index, relevantCosts, 'name')}
                </TableCell>
                <TableCell >
                  {renderRaw(index, relevantCosts, 'cost', 'number')}
                </TableCell>
                <TableCell >
                  {renderCategoryRaw(index, relevantCosts)}
                </TableCell>
              </TableRow>
            </HtmlTooltip>
          ))}
        </TableBody>
      </Table>
    </Dialog>
  );
}

export default ReportsDialog;