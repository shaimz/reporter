import React, { useState, useContext } from 'react';
import { PhotoIcon } from '@heroicons/react/24/solid';
import myContext from '../../context/data/myContext';
import { auth } from '../../firebase/FirebaseConfig';
import getUsernameByUID from '../../utils/GetUser';
import { uploadFile } from '../../utils/UploadFile';
import Navbar from '../Navbar';
import Map from '../Map';

const Reporting = () => {
  const context = useContext(myContext);
  const { sendReport } = context;

  const [incidentType, setIncidentType] = useState('');
  const [description, setDescription] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [anonymousReporting, setAnonymousReporting] = useState(false);
  const [imageUrl, setImageUrl] = useState([]);
  const uid = auth?.currentUser?.uid;
  const [u_name, setUser] = useState('');

  getUsernameByUID(uid).then((username) => {
    if (username) {
      setUser(username);
    } else {
      console.log(`User with UID ${uid} not found.`);
    }
  });

  const handleMediaChange = async (e) => {
    try {
      const url = await uploadFile(e.target.files[0]);
      setMediaFile(e.target.files[0]);
      if (url !== null) {
        setImageUrl((prev) => [...prev, url]);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (description.trim() === '') return;

    const reportSent = await sendReport(
      uid,
      u_name,
      incidentType,
      description,
      -1, // Placeholder for latitude
      -1, // Placeholder for longitude
      imageUrl,
      anonymousReporting
    );

    if (reportSent) {
      console.log('Report submitted successfully!');
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <form onSubmit={handleSubmit} className="mx-auto p-6 space-y-12 container">
        <div className=" border p-4 space-y-12 max-w-xl">
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
                        Apasati pe harta pentru a selecta locatia incidentului.
                    </p>
                </div>
                <Map />
              </div>

              {/* Media Upload */}
              <div className="col-span-full">
                <label htmlFor="mediaFile" className="block text-sm font-medium text-gray-900">
                  Upload Media (optional)
                </label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
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
              </div>

              {/* Anonymous Reporting */}
              {/* <div className="flex items-center">
                <input
                  type="checkbox"
                  id="anonymousReporting"
                  checked={anonymousReporting}
                  onChange={() => setAnonymousReporting(!anonymousReporting)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="anonymousReporting" className="ml-2 block text-sm text-gray-900">
                  Report Anonymously
                </label>
              </div> */}
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
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit Report
          </button>
        </div>
        
        </div>
      </form>
    </div>
  );
};

export default Reporting;