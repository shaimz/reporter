import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase/FirebaseConfig';
import getUsernameByUID from '../../utils/GetUser';
import myContext from '../../context/data/myContext';
import ADMIN_EMAIL from '../../utils/AdminDetails';

const Sidebar = () => {
    const [user_name, setUser] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isDeptAdmin, setIsDeptAdmin] = useState(false);
    const context = useContext(myContext);
    const { getMyNotifications, notifications } = context;

    useEffect(() => {
        const fetchData = async () => {
            const storedUserID = localStorage.getItem('user');
            const userID = storedUserID ? JSON.parse(storedUserID).user.uid : null;
            const userEmail = storedUserID ? JSON.parse(storedUserID).user.email : null;

            const fetchUsername = async () => {
                const cachedUsername = localStorage.getItem('username');
                if (cachedUsername == null) {
                    try {
                        const uid = auth.currentUser.uid;
                        const username = await getUsernameByUID(uid);
                        if (username) {
                            setUser(username);
                            localStorage.setItem('username', username);
                        }
                    } catch (error) {
                        console.error('Error fetching username:', error);
                    }
                } else {
                    setUser(cachedUsername);
                }
            };

            const fetchNotifications = async () => {
                try {
                    await getMyNotifications(userID);
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                }
            };

            const checkAdmin = async () => {
                try {
                    const isAdmin = userEmail === ADMIN_EMAIL;
                    setIsAdmin(isAdmin);
                } catch (error) {
                    console.error('Error checking admin status:', error);
                }
            };

            const checkDeptAdmin = async () => {
                try {
                    const isDeptAdmin = await context.getMyDept(userEmail);
                    console.log('isDeptAdmin:', isDeptAdmin);
                    if (isDeptAdmin !== false && isDeptAdmin.department !== null) {
                        setIsDeptAdmin(isDeptAdmin.department);
                    } else {
                        setIsDeptAdmin(false);
                    }
                } catch (error) {
                    console.error('Error checking department admin status:', error);
                }
            };

            // Fetch username, notifications, and admin status
            await fetchUsername();
            await fetchNotifications();
            await checkAdmin();
            await checkDeptAdmin();
        };

        fetchData();
    }, []);

    return (
        <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
            <div className="mb-2 p-4">
                <h5 className="block antialiased tracking-normal font-sans text-xl font-semibold leading-snug text-gray-900">
                    <a href="/">Raportez.MD</a>
                </h5>
            </div>
            <nav className="flex flex-col gap-1 min-w-[240px] p-2 font-sans text-base font-normal text-gray-700">
                <div className="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
                    <div className="grid place-items-center mr-4">
                        <img
                            src="https://res.cloudinary.com/drlkkozug/image/upload/v1705071144/y9evmbpdht5ezj3fkal9.jpg"
                            alt="User Avatar"
                            className="w-6 h-6 rounded-full"
                        />
                    </div>
                    <span>{user_name}</span>
                </div>
                {( isAdmin || isDeptAdmin ) && (
                    <div className="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
                        <div className="grid place-items-center mr-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                                className="h-5 w-5"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M2.25 2.25a.75.75 0 000 1.5H3v10.5a3 3 0 003 3h1.21l-1.172 3.513a.75.75 0 001.424.474l.329-.987h8.418l.33.987a.75.75 0 001.422-.474l-1.17-3.513H18a3 3 0 003-3V3.75h.75a.75.75 0 000-1.5H2.25zm6.04 16.5l.5-1.5h6.42l.5 1.5H8.29zm7.46-12a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6zm-3 2.25a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V9zm-3 2.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </div>
                        {isDeptAdmin ? (
                            <Link to="/departments-reports">Administrare Raporturi</Link>
                        ) : (
                             isAdmin && (
                                <Link to="/dashboard">Administrare Raporturi</Link>
                            )
                        )}
                    </div>
                )}
                {/* <div className="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
                    <div className="grid place-items-center mr-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                            className="h-5 w-5"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    </div>
                    <Link to="/user-profile">Profil</Link>
                </div> */}
                <div className="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
                    <div className="grid place-items-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{width: '1.5rem', height: '1.5rem'}} fill="currentColor" className="h-5 w-5">
                        <g>
                            <path fill="none" d="M0 0h24v24H0z"/>
                            <path fillRule="nonzero" d="M12.866 3l9.526 16.5a1 1 0 0 1-.866 1.5H2.474a1 1 0 0 1-.866-1.5L11.134 3a1 1 0 0 1 1.732 0zm-8.66 16h15.588L12 5.5 4.206 19zM11 16h2v2h-2v-2zm0-7h2v5h-2V9z"/>
                        </g>
                    </svg>
                    </div>
                    <Link to="/notifications">Notificari</Link>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;