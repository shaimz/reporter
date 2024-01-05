import React, { useState, useContext } from 'react';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { toast, ToastContainer } from 'react-toastify';
import myContext from '../../context/data/myContext';
import { auth } from '../../firebase/FirebaseConfig';

import getUsernameByUID from '../../utils/GetUser';
import { uploadFile } from '../../utils/UploadFile';
import Navbar from '../Navbar';
import Map from '../Map';

const Reporting = () => {
  const context = useContext(myContext);
  const { sendReport, getExactLocation, address } = context;

  const [incidentType, setIncidentType] = useState('');
  const [description, setDescription] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [anonymousReporting, setAnonymousReporting] = useState(false);
  const [reportFiles, setReportFiles] = useState([]);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const uid = auth?.currentUser?.uid;
  const [u_name, setUser] = useState('');

  getUsernameByUID(uid).then((username) => {
    if (username) {
      setUser(username);
    } else {
      console.log(`User with UID ${uid} not found.`);
    }
  });

  const selectLocation = async ({ lat, lng }) => {
    const latitude = lat;
    const longitude = lng;
    try {
      const location = { latitude, longitude};
      setLocation(location);
      const address = await getExactLocation(latitude, longitude);
      console.log('Address:', address);
      console.log('Location selected:', location);
    } catch (error) {
      console.error('Error selecting location:', error);
    }
  };

  const handleMediaChange = async (e) => {
    try {
      setMediaFile(e.target.files[0]);
      setReportFiles(e.target.files);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleSubmit = async (e) => {
    console.log(auth);
    e.preventDefault();
    if (description.trim() === '') return;

    const images = [];

    if (reportFiles.length === 0) { 
      toast.error('Please upload an image or video', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000, // Auto close after 3 seconds
      });
      return;
    }

    for (const file of reportFiles) {
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size exceeds the limit of 5MB');
      }
  
      images.push(file);
    }

    console.log('Selected files:', images);
    console.log(uid);
    const imageResponse = await uploadFile(images, uid);
    console.log('Image response:', imageResponse);
    if (!imageResponse) {
      throw new Error('Error uploading file');
    }

    const reportSent = await sendReport(
      uid,
      u_name,
      incidentType,
      description,
      location.latitude, // Placeholder for latitude
      location.longitude, // Placeholder for longitude
      imageResponse,
      anonymousReporting,
      e.target.files,
    );

    if (reportSent) {
      console.log('Report submitted successfully!');
      toast.success('Problema raportata cu succes!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000, // Auto close after 3 seconds
      });
    }
    scrollTo(0, 0);
    //reset form
    setIncidentType('');
    setDescription('');
    setMediaFile(null);
    setAnonymousReporting(false);
    setTimeout(() => {
      window.location.reload();
    }, 2000)
  };

  return (
    <div>
    <Navbar />
    <div className="min-h-screen mt-24">
      <form onSubmit={handleSubmit} className="mx-auto p-6 space-y-12 container">
        <div className="p-4 space-y-12 max-w-xl mx-auto">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold text-gray-900">Raporteaza un Incident</h2>
            <p className="mt-1 text-sm text-gray-600">
              Va rugam sa completati formularul de mai jos pentru a raporta un incident.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* Incident Type */}
              <div className="sm:col-span-4">
                <label htmlFor="incidentType" className="block text-sm font-medium text-gray-900">
                  Tipul Problemei
                </label>
                <select
                  id="incidentType"
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  className="mt-2 border block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                  required
                >
                  <option value="" disabled>
                    Selectati tipul problemei
                  </option>
                  <option value="Accident">Accident</option>
                  <option value="Infrastructure Issue">Problemă de infrastructură</option>
                  <option value="Suspicious activities">Activități suspecte</option>
                  <option value="Social Issues">Probleme sociale</option>
                </select>
              </div>

              {/* Description */}
              <div className="col-span-full">
                <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                  Descriere
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                  placeholder="Provide a detailed description of the incident"
                  required
                />
              </div>

              {/* Location */}
              <div className="col-span-full">
                <h3 className="text-sm font-semibold text-gray-900">Locatia</h3>
                <div className="mt-2 mb-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <p className="text-center text-sm text-gray-600">
                      {
                        address ? `Locatia selectata: ${address}` : 'Apasati pe harta pentru a selecta locatia incidentului.'
                      }
                    </p>
                </div>
                <Map onLocationSelect={selectLocation}/>
              </div>

              {/* Media Upload */}
              <div className="col-span-full">
                <label htmlFor="mediaFile" className="block text-sm font-medium text-gray-900">
                  Upload Media (optional)
                </label>
                { !mediaFile && <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <PhotoIcon aria-hidden="true" className="mx-auto h-12 w-12 text-gray-300" />
                    <div className="mt-4 flex text-sm text-gray-600">
                      <label
                        htmlFor="mediaFile"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="mediaFile"
                          name="mediaFile"
                          type="file"
                          className="sr-only"
                          onChange={handleMediaChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-600">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
                } 
                { mediaFile && 
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <img src={URL.createObjectURL(mediaFile)} alt="Media" className="h-40 w-40 object-cover" />
                    </div>
                </div> }
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold text-gray-900"
            onClick={() => console.log('Cancelled')}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit Report
          </button>
        </div>
        
        </div>
      </form>
    </div>

    </div>
    
  );
};

export default Reporting;