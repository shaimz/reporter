import React, { useContext, useEffect, useState } from 'react';
import myContext from '../context/data/myContext';
import { Link } from 'react-router-dom';
import ADMIN_EMAIL from '../utils/AdminDetails';

function Navbar() {
  const context = useContext(myContext);
  const { getMyDept } = context;

  const [department, setDept] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const logout = () => {
    localStorage.clear('user');
    window.location.href = '/login';
  };

  const user_emailID = user?.user?.email;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const isDeptAdmin = await getMyDept(user_emailID);
        if (isDeptAdmin !== false) {
          setDept(isDeptAdmin?.department);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (user_emailID) {
      fetchData();
    }
  }, [user_emailID]);

  return (
    <div className=" shadow-md sticky top-0 z-50 bg-blue-100">
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <Link to="/" className=" w-2xl">
          <h1 className="text-sm font-bold font-lato px-2 py-1 text-gray-800">Home</h1>
        </Link>

        {/* Links */}
        <div className="flex items-center space-x-6">
          {user && (
            <Link
              to="/report"
              className="text-sm font-medium text-grey-500 hover:underline"
            >
              Trimite Raport
            </Link>
          )}
          <Link
            to="/emergency-resources"
            className="text-sm font-medium text-grey-500 hover:underline"
          >
            Resurse de Urgență
          </Link>
          {!user && (
            <Link
              to="/signup"
              className="text-sm font-medium text-gray-500 hover:underline"
            >
              Înregistrare
            </Link>
          )}
          {user && (
            <button
              onClick={logout}
              className="text-sm font-medium text-red-500 hover:underline"
            >
              Deconectare
            </button>
          )}
        </div>

        {/* User Profile */}
        {user && (
          <Link to="/user-profile" className="ml-6 flex items-center">
            <img
              className="inline-block w-10 h-10 rounded-full border border-gray-300"
              src="https://res.cloudinary.com/drlkkozug/image/upload/v1705071144/y9evmbpdht5ezj3fkal9.jpg"
              alt="User"
            />
          </Link>
        )}
      </nav>
    </div>
  );
}

export default Navbar;