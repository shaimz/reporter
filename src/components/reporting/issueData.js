export const issues = [
    {
      id: 1,
      position: { lat: 47.0107, lng: 28.8640 },
      title: 'Groapa în asfalt',
      description: 'O groapă mare pe strada principală.',
      status: 'in lucru',
      image: '../../public/problema1.jpg',
    },
  ];
  
  // Function to add a new issue
  export const addIssue = (newIssue) => {
    issues.push(newIssue);
  };