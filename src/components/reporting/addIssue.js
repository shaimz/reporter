import React from 'react';
import { addIssue } from './issueData';

const handleAddIssue = () => {
    const newIssue = {
      id: 2,
      position: { lat: 47.0100, lng: 28.8540 },
      title: 'Gunoi aruncat ilegal',
      description: 'Mormane de gunoi în parc.',
      status: 'in lucru',
      image: '../../public/problema2.jpeg',
    };

    addIssue(newIssue);
    return newIssue;
    console.log('Issue added:', newIssue);
};

export default handleAddIssue;