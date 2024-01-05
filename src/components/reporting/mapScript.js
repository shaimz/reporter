import React, { useContext } from "react";
import myContext from "../../context/data/myContext";

function gotLocation(position) {
    const latitude = position?.coords?.latitude;
    const longitude = position.coords.longitude;

    const response = { latitude: latitude, longitude: longitude };

    return response;
}

function failedToGet() {
    return Promise.reject("Geolocation is not supported by this browser!");
}

const getLocation = () => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve(gotLocation(position));
            },
            () => {
                reject(failedToGet());
            }
        );
    });
};

export const addAdvancedMarker = ({issue, mapRef, setSelectedIssue }) => {

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

    const marker = new window.google.maps.marker.AdvancedMarkerElement({
      map: map,
      position: issue.position,
      content: customIcon,
      title: issue.incidentType,
      zIndex: 100,
    });
    return marker
  }
}

export default getLocation;
