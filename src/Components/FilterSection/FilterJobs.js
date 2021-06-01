import React from 'react';
import { Grid } from '@material-ui/core';
import './FilterSection.css';

const FilterJobs = (props) => {
  const { selectedStatus, setSelectedStatus, numberOfRequests } = props;

  const renderFilterButton = (status) => {
    const statusList = {
      'ALL': 'Semua Pekerjaan',
      'ACTIVE-JOB': 'Pekerjaan Aktif',
      'INACTIVE-JOB': 'Pekerjaan Non-Aktif',
    };

    return status === selectedStatus ? (
      <div className='button-selected' onClick={() => setSelectedStatus(status)}>
        <Grid container>
          <Grid item xs={11}>
            <h5>{statusList[status]}</h5>
          </Grid>
          <Grid item xs={1}>
            <div className='request-number-wrapper'>
              <h5>{numberOfRequests}</h5>
            </div>
          </Grid>
        </Grid>
      </div>
    ) : (
      <div className='button' onClick={() => setSelectedStatus(status)}>
        <h5>{statusList[status]}</h5>
      </div>
    )
  }

  const renderFilterButtons = () => {
    return ['ALL', 'ACTIVE-JOB', 'INACTIVE-JOB'].map(status => renderFilterButton(status))
  }

  return (
    <div className='filter-section'>
      {renderFilterButtons()}
    </div>
  )
}

export default FilterJobs;