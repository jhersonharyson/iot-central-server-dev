import React, { useEffect, useRef, useState } from 'react';
import Detail from './components/Detail';
import PpmXDevice from './components/PpmXDevice'
import ListTable from './components/ListTable/ListTable'
import axios from '../../http';

const DashboardDetail = props => {
  //Style const
  const { className, history, match: { params }, ...rest } = props;

  const handleToggle = () => {
    history.push('/dashboard');
  };

  return (
    <Detail
      open={true}
      handleToggle={handleToggle}
      title="Ambiente">
      <>
        <PpmXDevice
          location_id={params.id}
          style={{ margin: '20px' }}
        />
        <ListTable
          media
          location_id={params.id} />
      </>
    </Detail>
  );
};

export default DashboardDetail;
