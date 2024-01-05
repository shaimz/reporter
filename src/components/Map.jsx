import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, OverlayView, useLoadScript } from '@react-google-maps/api';
import { addAdvancedMarker } from './reporting/mapScript';
import myContext from '../context/data/myContext';
import { useContext } from 'react';
import { libraries } from '../utils/map';
import GeocodingSearch from './reporting/Geocoding';
import process from 'process';

const mapId = "f743712d2d384d97";
const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "AIzaSyDjvCjUNJWA63v-seeEdJ4r7oB2L4PKid4";

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 47.0105, // Example: Bucharest latitude
  lng: 28.8638, // Example: Bucharest longitude
};

function Map({ onLocationSelect, mapType, departmentReport = null }) {
  const context = useContext(myContext);
  const { getAllReports, reports, getReportbyId, setSelectedIssue, selectedIssue } = context;

  const [addedMarkers, setAddedMarkers] = useState(new Set()); // Track added markers
  const [geoCodePosition, setGeoCodePosition] = useState({
    lat: null,
    lng: null,
  });
  const mapRef = useRef(null);

  // Memoize the fetchIssues function to prevent infinite loops
  const fetchIssues = useCallback(async () => {
    if (!departmentReport) {
      await getAllReports();
    } else {
      await getReportbyId(departmentReport.id);
    }
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  useEffect(() => {
    const fetchedIssues = reports.map((issue) => ({
      id: issue.id,
      position: { lat: issue.latitude, lng: issue.longitude },
      title: issue.incidentType,
      description: issue.description,
      status: issue.filed ? 'Filed' : 'In Progress',
      image: issue.imageUrl, // Assuming the first image is the one to display
    }));

    if (mapRef.current) {
      fetchedIssues.forEach((issue) => {
        if (!addedMarkers.has(issue.id)) {
          // Add marker only if it hasn't been added yet
          const marker = addAdvancedMarker({ issue, mapRef, setSelectedIssue });
          setAddedMarkers((prev) => new Set(prev).add({ id: issue.id, marker })); // Mark this issue as added
        }
      });
    }
  }, [reports]);

  const setLocation = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    if (onLocationSelect) {
      onLocationSelect({ lat, lng });
      setGeoCodePosition({ lat, lng });
    }

    // delete the markers not in the addedmarkers
    addedMarkers.forEach((marker) => {
      console.log(!marker.id)
      if (!marker.id) {
        marker.marker.map = null; // Remove marker from map
      }
    });

    // Add a new marker at the clicked location
    const draggableMarker = new window.google.maps.marker.AdvancedMarkerElement({
      map: mapRef.current,
      gmpDraggable: true,
      position: { lat, lng },
      zIndex: 100,
      title: "This marker is draggable. Click to remove.",
    });

    setAddedMarkers((prev) => new Set(prev).add({id: null, marker: draggableMarker })); // Mark this issue as added
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries
  });

  const renderMap = () => (
    <div className="w-full h-full">
      { mapType !== "admin" && 
        <GeocodingSearch></GeocodingSearch>
      }
    <GoogleMap
      mapContainerStyle={containerStyle}
      ref={mapRef}
      center={center}
      zoom={15}
      options={{ mapId }}
      onLoad={(map) => {
        mapRef.current = map;
        window.map = { current: map };
      }}
      onClick={mapType !== "admin" ? setLocation : null}
      onDrag={() => {
        if (mapRef.current) {
          const center = mapRef.current.getCenter();
          setGeoCodePosition({ lat: center.lat(), lng: center.lng() });
        }
      }}
      onDragEnd={() => {
        if (mapRef.current) {
          const center = mapRef.current.getCenter();
          setGeoCodePosition({ lat: center.lat(), lng: center.lng() });
        }
      }}
    >
      {selectedIssue && (
        <OverlayView
          position={selectedIssue.position}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div
            style={{
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
              {selectedIssue.title} <br /> {selectedIssue.description}
            </p>
            <p style={{ margin: '10px 0', fontSize: '12px', color: '#555' }}>
              Status: {selectedIssue.status}
            </p>
            <button
              style={{
                backgroundColor: '#007BFF',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
              onClick={() => setSelectedIssue(null)}
            >
              Close
            </button>
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
                borderLeft: '10px solid #f9f9f9',
              }}
            ></div>
          </div>
        </OverlayView>
      )}
    </GoogleMap>
    </div>
  );

  return isLoaded ? renderMap() : <div>Loading...</div>;
}

export default Map;