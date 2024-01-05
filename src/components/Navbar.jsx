import React, { useContext, useEffect, useState } from 'react';
import myContext from '../context/data/myContext';
import { Link } from 'react-router-dom';
import ADMIN_EMAIL from '../utils/AdminDetails';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

function Navbar() {
  const context = useContext(myContext);
  const { getMyDept } = context;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [department, setDept] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const navigation = [
    { name: 'Acasa', href: '/' },
    { name: 'Raporteaza', href: '/report' },
    { name: 'Notificari', href: '/notifications' },
  ];

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
          <header className="absolute inset-x-0 top-0 z-50">
          <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
            <div className="flex lg:flex-1">
              <Link to="/" className="-m-1.5 p-1.5">
                <span className="sr-only">FastReport</span>

              </Link>
            </div>
            <div className="flex lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <div className="hidden lg:flex lg:gap-x-12">
              {navigation.map((item) => (
                <Link key={item.name} to={item.href} className="text-sm font-semibold text-gray-900">
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              {!user ? (
                <Link to="/login" className="text-sm font-semibold text-gray-900">
                  Log in <span aria-hidden="true">&rarr;</span>
                </Link>
              ) : (
                <Link to="/user-profile" className="text-sm font-semibold text-gray-900">
                  Profil <span aria-hidden="true">&rarr;</span>
                </Link>
              )}
            </div>
          </nav>
          <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
            <div className="fixed inset-0 z-50" />
            <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <Link to="/" className="-m-1.5 p-1.5">
                  <span className="sr-only">FastReport</span>
                  <img
                    alt="FastReport Logo"
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                    className="h-8 w-auto"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  <div className="py-6">
                    {!user ? (
                      <Link
                        to="/login"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        Log in
                      </Link>
                    ) : (
                      <Link
                        to="/profile"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        Profil
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Dialog>
        </header>
    // <div className=" shadow-md sticky top-0 z-50 bg-blue-100">
    //   <nav className="container mx-auto flex items-center justify-between py-4 px-6">
    //     {/* Logo */}
    //     <Link to="/" className=" w-2xl">
    //       <h1 className="text-sm font-bold font-lato px-2 py-1 text-gray-800">Home</h1>
    //     </Link>

    //     {/* Links */}
    //     <div className="flex items-center space-x-6">
    //       {user && (
    //         <Link
    //           to="/report"
    //           className="text-sm font-medium text-grey-500 hover:underline"
    //         >
    //           Trimite Raport
    //         </Link>
    //       )}
    //       <Link
    //         to="/emergency-resources"
    //         className="text-sm font-medium text-grey-500 hover:underline"
    //       >
    //         Resurse de Urgență
    //       </Link>
    //       {!user && (
    //         <Link
    //           to="/signup"
    //           className="text-sm font-medium text-gray-500 hover:underline"
    //         >
    //           Înregistrare
    //         </Link>
    //       )}
    //       {user && (
    //         <button
    //           onClick={logout}
    //           className="text-sm font-medium text-red-500 hover:underline"
    //         >
    //           Deconectare
    //         </button>
    //       )}
    //     </div>

    //     {/* User Profile */}
    //     {user && (
    //       <Link to="/user-profile" className="ml-6 flex items-center">
    //         <img
    //           className="inline-block w-10 h-10 rounded-full border border-gray-300"
    //           src="https://res.cloudinary.com/drlkkozug/image/upload/v1705071144/y9evmbpdht5ezj3fkal9.jpg"
    //           alt="User"
    //         />
    //       </Link>
    //     )}
    //   </nav>
    // </div>
  );
}

export default Navbar;