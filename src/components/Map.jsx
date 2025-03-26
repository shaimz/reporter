import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, OverlayView } from '@react-google-maps/api';

const mapId = "f743712d2d384d97";

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 44.4268, // Example: Bucharest latitude
  lng: 26.1025, // Example: Bucharest longitude
};

const issues = [
  {
    id: 1,
    position: { lat: 44.4265, lng: 26.1055 },
    title: 'Groapa în asfalt',
    description: 'O groapă mare pe strada principală.',
    status: 'in lucru',
    image: '../../public/problema1.jpg',
  },
  {
    id: 2,
    position: { lat: 44.4300, lng: 26.1050 },
    title: 'Gunoi aruncat ilegal',
    description: 'Mormane de gunoi în parc.',
    status: 'in lucru',
    image: '../../public/problema2.jpeg',
  },
];
  

function Map() {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const addAdvancedMarker = (issue) => {
        console.log('Adding advanced marker...', window.google.maps.marker, mapRef.current);
      if (window.google && window.google.maps && mapRef.current) {
        const map = mapRef.current;

        const customIcon = document.createElement('img');
        customIcon.src = issue.image;
        customIcon.style.width = '50px';
        customIcon.style.height = '50px';
        customIcon.style.borderRadius = '20%';
        customIcon.style.border = '2px solid white';
        customIcon.style.cursor = 'pointer';

        // Add click event listener to the custom icon
        customIcon.addEventListener('click', () => {
            setSelectedIssue(issue); // Set the selected issue when clicked
        });

        new window.google.maps.marker.AdvancedMarkerElement({
          map: map,
          position: issue.position,
          content: customIcon,
          title: issue.title,
          zIndex: 100,

        });
      }
    }

    // Check if the map is already loaded
    if (mapRef.current) {
        issues.forEach((issue) => addAdvancedMarker(issue));
    }

    // If not, wait until the map is loaded
    const interval = setInterval(() => {
      if (mapRef.current) {
        clearInterval(interval);
        issues.forEach((issue) => addAdvancedMarker(issue));
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <LoadScript 
        googleMapsApiKey="AIzaSyDjvCjUNJWA63v-seeEdJ4r7oB2L4PKid4" 
        libraries={['marker']}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        ref={mapRef}
        center={center}
        zoom={15}
        options={{ mapId }}
        onLoad={map => { mapRef.current = map }}
     >

        {/* Info Box for Selected Issue */}
        {selectedIssue && (
          <OverlayView
            position={selectedIssue.position}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div style={{
                color: "#333",
                backgroundColor: '#f9f9f9',
                padding: '15px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                transform: 'translate(-115%, -65%)',
                width: '250px',
                height: '150px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                textAlign: 'center',
                fontFamily: 'Arial, sans-serif',
              }}
            >
                <h3 style={{ margin: '0', fontSize: '14px', color: '#333' }}>
                    Problema
                </h3>
                <p style={{ margin: '10px 0', fontSize: '12px', color: '#555' }}>
                    {selectedIssue.title} <br/> {selectedIssue.description}
                </p>
                <p style={{ margin: '10px 0', fontSize: '12px', color: '#555' }}>
                    Status: {selectedIssue.status}
                </p>
              <button  style={{
                backgroundColor: '#007BFF',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '14px',
                }}
                onClick={ () => setSelectedIssue(null) }>Close</button>
                    {/* Arrow pointing to the marker */}
                <div
                    style={{
                    position: 'absolute',
                    right: '-9px',
                    bottom: "50%",
                    transform: 'translateY(50%)',
                    width: '0',
                    height: '0',
                    borderTop: '10px solid transparent',
                    borderBottom: '10px solid transparent',
                    borderLeft: '10px solid #f9f9f9', // Match the background color of the box
                    }}
                ></div>
            </div>
          </OverlayView>
        )}

      </GoogleMap>
    </LoadScript>
  );
}

export default Map;