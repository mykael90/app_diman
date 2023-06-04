import React, { useMemo, useRef, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import {
  Container,
  Row,
  Col,
  Button,
  Badge,
  OverlayTrigger,
  Tooltip,
  Form as BootstrapForm,
} from 'react-bootstrap';
import './style.css';

const containerStyle = {
  width: '800px',
  height: '600px',
};

const position = {
  lat: -5.839692696223772,
  lng: -35.20156446349059,
};

const onLoadMarker = (marker) => {
  console.log('marker: ', marker);
};

function MyComponent() {
  const mapRef = useRef();

  const center = useMemo(
    () => ({
      lat: -5.839692696223772,
      lng: -35.20156446349059,
    }),
    []
  );

  const options = useMemo(
    () => ({
      mapId: 'ade80d771133503b',
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );

  // eslint-disable-next-line no-return-assign
  const onLoad = useCallback((map) => (mapRef.current = map), []);

  return (
    <Container style={{ height: '70vh' }}>
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_BASE_GOOGLE_API_KEY}
        region="us"
        libraries={['geometry']}
      >
        <GoogleMap
          // mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
          mapContainerClassName="map-container"
          options={options}
          onLoad={onLoad}
        >
          {/* Child components, such as markers, info windows, etc. */}
          <Marker
            onLoad={onLoadMarker}
            position={position}
            options={{
              label: {
                text: 'Posição teste',
                className: 'mb-4 pb-3',
              },
            }}
          />
        </GoogleMap>
      </LoadScript>
    </Container>
  );
}

export default React.memo(MyComponent);
