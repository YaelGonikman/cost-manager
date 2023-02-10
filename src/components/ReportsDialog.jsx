import React, { useState, useEffect } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

function ReportsDialog(props) {
  const { onClose, open, costs, categories, HtmlTooltip } = props;
  const [relevantCosts, setRelevantCosts] = useState([])
  const [datesValue, setDatesValue] = useState([null, null]);

  useEffect(() => {
    setRelevantCosts(costs)
    setDatesValue([null, null])
  }, [costs])

  const rowByStatus = (index, costs, prop, type) => {
    return <TextField
      id='outlined-read-only-input'
      value={costs[index][prop]}
      type={type}
    />
  }


  const categoryByStatus = (index, costs) => {
    return <TextField
      id='outlined-read-only-input'
      value={categories.filter((cat) => cat.value === costs[index]['category'])[0].label}
      InputProps={{
        readOnly: true,
      }}
    />
  }

  function filterByDateRange() {
    const startDate = datesValue[0].$d
    const endDate = new Date(datesValue[1].$d)
    endDate.setUTCHours(45, 59, 59, 999)
    setRelevantCosts(costs.filter(item => {
      return item.createdAt >= startDate && item.createdAt <= endDate;
    }))
  }

  const getCreatedAtValue = (date) => {
    return date.toLocaleString("en-US", {timeZone: "Israel"})
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
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          localeText={{ start: 'From', end: 'To' }}
        >
          <DateRangePicker
            value={datesValue}
            onChange={(newValue) => {
              setDatesValue(newValue);
            }}
            renderInput={(startProps, endProps) => (
              <React.Fragment>
                <TextField {...startProps} />
                <Box sx={{ mx: 2 }}> to </Box>
                <TextField {...endProps} />
              </React.Fragment>
            )}
          />
        </LocalizationProvider>
        <Button style={{ margin: 10 }} onClick={filterByDateRange}>Filter</Button>
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
          {console.log(costs, relevantCosts)}
          {relevantCosts.map((cost, index) => (
            <HtmlTooltip key={index}
              title={
                <React.Fragment>
                  <Typography color='inherit'>Description</Typography>
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
                  {rowByStatus(index, relevantCosts, 'name')}
                </TableCell>
                <TableCell >
                  {rowByStatus(index, relevantCosts, 'cost', 'number')}
                </TableCell>
                <TableCell >
                  {categoryByStatus(index, relevantCosts)}
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