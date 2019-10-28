import React, { useEffect, useRef, useState } from 'react';
import Detail from './components/Detail';
import PpmXDevice from './components/PpmXDevice'
import ListTable from './components/ListTable/ListTable'
import axios from '../../http';

const DashboardDetail = props => {
  //Style const
  const { className, history, match: { params }, ...rest } = props;
  const [location, setLocation] = useState(null);

  useEffect(() => {
    async function getLocation() {
      let authentication = localStorage.getItem('authentication');
      let { data } = await axios.get(`location/${params.id}`, {
        headers: { authentication }
      });

      setLocation(data.location);
    }
    getLocation();
  }, []);

  const handleToggle = () => {
    history.push('/dashboard');
  };

  return (
    <Detail
      open={true}
      handleToggle={handleToggle}
      title={location ? location.name : "Ambiente"}>
      <>
        <PpmXDevice
          location_id={params.id}
          location={location}
          style={{ margin: '20px' }}
        />
        <ListTable
          media
          location={location}
          location_id={params.id} />
      </>
    </Detail>
  );
};

export default DashboardDetail;
