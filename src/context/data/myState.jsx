
import React, { useEffect, useState } from 'react'
import MyContext from './myContext'
import {
    Timestamp, addDoc, collection, deleteDoc, doc, getDocs,
    onSnapshot, orderBy, query, setDoc, getDoc, updateDoc, increment,
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { where } from 'firebase/firestore';
import { fireDB } from '../../firebase/FirebaseConfig';
import THRESHOLD_FLAGS from '../../utils/ThresholdFlags';

function myState(props) {

    const [mode, setMode] = useState('light');

    const toggleMode = () => {
        if (mode === 'light') {
            setMode('dark');
            document.body.style.backgroundColor = "rgb(17, 24, 39)"
        }
        else {
            setMode('light');
            document.body.style.backgroundColor = "white"
        }
    }

    const [loading, setLoading] = useState(false);

    const sendReport = async (uid, u_name, incidentType, description, latitude,
        longitude, imageUrl, anonymousReporting) => {

        if (description === "" || latitude === -1 || longitude === -1 || uid == null ||
            incidentType === "") {
            toast.error("All fields are required")
            return false;
        }

        const reportsRef = collection(fireDB, 'reports'); // Reference to the reports collection

        // Create a new report document
        // depending on anonymous reporting or not

        let report;

        if (anonymousReporting === false) {
            report = {
                uid,
                u_name,
                incidentType,
                description,
                latitude,
                longitude,
                imageUrl,
                filed: false,
                anonymousReporting: false,
                timestamp: new Date(),
                date: new Date().toLocaleString(
                    "en-US",
                    {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                    }
                )
            };
        }

        else {
            report = {
                incidentType,
                description,
                imageUrl,
                latitude,
                longitude,
                anonymousReporting: true,
                timestamp: new Date(),
                date: new Date().toLocaleString(
                    "en-US",
                    {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                    }
                )
            };
        }

        await setDoc(doc(reportsRef), report);

        return true;
    }

    const [reports, setReports] = useState([]);

    const getAllReports = async () => {
        setLoading(true)

        try {
            const q = query(
                collection(fireDB, 'reports'),
                orderBy('timestamp', 'asc'),
                where('filed', "==", false)
            );

            const data = onSnapshot(q, (QuerySnapshot) => {
                let reportsArray = [];

                QuerySnapshot.forEach((doc) => {
                    reportsArray.push({ ...doc.data(), id: doc.id });
                });
                setReports(reportsArray);
                setLoading(false);
            });

            return true;

        } catch (error) {
            setLoading(false)
            return false;
        }

    }

    const getFiledReports = async () => {
        setLoading(true)

        try {
            const q = query(
                collection(fireDB, 'reports'),
                orderBy('timestamp', 'desc'),
                where('filed', '==', true)
            );

            let reportsArray = [];

            const data = onSnapshot(q, (QuerySnapshot) => {

                QuerySnapshot.forEach((doc) => {
                    reportsArray.push({ ...doc.data(), id: doc.id });
                });
                setReports(reportsArray);
                setLoading(false);
            });

            return reportsArray;

        } catch (error) {
            setLoading(false)
            return false;
        }

    }

    const getMyDept = async (email) => {

        // departments -> search for your email
        const deptQuery = query(
            collection(fireDB, 'departments'),
            where('emailID', '==', email)
        );

        const deptSnapshot = await getDocs(deptQuery);

        if (!deptSnapshot.empty) {

            const deptDocument = deptSnapshot.docs[0]._document.data.value.mapValue.fields;

            const data = {
                department: deptDocument.department.stringValue,
                departmentName: deptDocument.departmentName.stringValue
            };

            return data;
        }

        return false;
    }

    const addDeptAdmin = async (email, dept) => {

        if (email == '' || dept == '') {
            return toast.error("All fields are required")
        }

        const departmentMap = new Map();

        departmentMap.set('intervention_team', 'Echipa de interventie');

        const adminRef = collection(fireDB, 'departments');

        const deptName = departmentMap.get(dept);

        const newAdminDept = {
            emailID: email,
            department: dept,
            departmentName: deptName,
            date: new Date().toLocaleString(
                "en-US",
                {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                }
            )
        };


        await setDoc(doc(adminRef), newAdminDept);

        toast.success("Admin added", {
            position: "top-right",
            autoClose: 500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true, 
            theme: "colored",
        })

        return true;
    }

    const getSpecificReports = async (department_id) => {
        const reportsRef = collection(fireDB, 'reports'); // Reference to the reports collection

        const q = query(
            reportsRef,
            where('filed', '==', false),
            where('department_id', '==', department_id) // Replace with the actual department ID
        );

        try {
            const querySnapshot = await getDocs(q);

            // Access the documents from the snapshot
            const reportsArray = [];

            querySnapshot.forEach(doc => {
                reportsArray.push({ id: doc.id, ...doc.data() });
            });

            setReports(reportsArray);

            return true;
        } catch (error) {
            return false;
        }
    }

    const getReportbyId = async (reportID) => {
        const reportRef = doc(fireDB, 'reports', reportID); // Replace 'threads' with your actual collection name

        try {
            const reportDoc = await getDoc(reportRef);

            if (reportDoc.exists()) {
                // Extract thread data from the document
                const data = { id: reportDoc.id, ...reportDoc.data() };
                setReports([data]);
                return data;
            }
        } catch (error) {
            return null;
        }
    }

    const message = "Your report has been filed successfully."

    const addNotification = async (userid, reportID) => {

        const newNotification = { id: Date.now(), message };

        // userID, reportID

        const notificationRef = collection(fireDB, 'notifications'); // Reference to the reports collection

        const notification = {
            userId: userid,
            reportID: reportID,
            date: new Date().toLocaleString(
                "en-US",
                {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                }
            )
        };


        await setDoc(doc(notificationRef), notification);

        // Add the new notification to the array
        setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
    };

    const [notifications, setNotifications] = useState([]);

    const getMyNotifications = async (userid) => {
        const notificationRef = collection(fireDB, 'notifications');

        const notifQuery = query(
            notificationRef,
            where('userId', '==', userid)
        );

        try {
            const notifSnapshot = await getDocs(notifQuery);

            // Access the documents from the snapshot
            const notifications = [];

            notifSnapshot.forEach(doc => {
                notifications.push({ id: doc.id, ...doc.data() });
            });

            setNotifications(notifications);

            return true;
        } catch (error) {
            return false;
        }
    };

    const deleteNotification = async (reportId, userId) => {
        setLoading(true);

        try {
            const querySnapshot = await getDocs(query(collection(fireDB, 'notifications'),
                where('reportID', '==', reportId),
                where('userId', '==', userId)
            ));

            if (!querySnapshot.empty) {
                // Delete the document
                const docRef = querySnapshot.docs[0].ref;
                await deleteDoc(docRef);

                toast.success('Notification deleted !');
                getAllReports();
            } else {
                toast.error('Report not found');
            }

            setLoading(false);
        } catch (error) {
            console.error('Error deleting report:', error);
            setLoading(false);
        }
    };

    const submitReview = async (reportId, review) => {
        setLoading(true)
        try {
            const reportRef = doc(fireDB, 'reports', reportId);
            await updateDoc(reportRef, {
                review: review,
                reviewDate: new Date().toLocaleString(
                    "en-US",
                    {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                    }
                )
            });
            toast.success('Report reviewed successfully')
            getAllReports();
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const deleteReport = async (report) => {
        setLoading(true)
        try {
            await deleteDoc(doc(fireDB, 'reports', report.id))
            toast.success('Report deleted successfully')
            getAllReports();
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const UpdateReportState = async (reportId, status) => {
        try {
            // Get a reference to the specific report document
            const reportRef = doc(fireDB, 'reports', reportId);

            // Get the current data of the report
            const reportSnapshot = await getDoc(reportRef);
            const reportData = reportSnapshot.data();

            // Check if the 'status' attribute exists
            if (reportData && reportData.status !== undefined) {
                // 'status' attribute exists, update it to true
                await updateDoc(reportRef, { status });
            } else {
                // 'status' attribute doesn't exist, add it and set to true
                await setDoc(reportRef, { status }, { merge: "pending" });
            }

        } catch (error) {
            console.error('Error updating report state:', error);
        }
    }

    const UpdateReportDepartment = async (reportId, department_id) => {
        try {
            // Get a reference to the specific report document
            const reportRef = doc(fireDB, 'reports', reportId);
            const departmentRef = doc(fireDB, 'departments', department_id);

            // Get the current data of the report
            const reportSnapshot = await getDoc(reportRef);
            const reportData = reportSnapshot.data();

            const departmentSnapshot = await getDoc(departmentRef);
            const departmentData = departmentSnapshot.data();

            // Check if the 'status' attribute exists
            if (reportData && reportData.department_id !== undefined) {
                // 'status' attribute exists, update it to true
                await updateDoc(reportRef, { department_id, departmentName: departmentData.departmentName });
            } else {
                // 'status' attribute doesn't exist, add it and set to true
                await setDoc(reportRef, { department_id, department_name: "" }, { merge: "" });
            }

        } catch (error) {
            console.error('Error updating report department:', error);
        }
    }

    const getUserDetails = async (userId) => {

        const userQuery = query(collection(fireDB, 'users'), where('uid', '==', userId));
        const userSnapshot = await getDocs(userQuery);

        let username, emailId, joinTime;

        userSnapshot.forEach((doc) => {
            username = { ...doc.data(), id: doc.id }.name;
            emailId = { ...doc.data(), id: doc.id }.email;
            joinTime = { ...doc.data(), id: doc.id }.time;
        });

        const joinDate = joinTime.toDate();

        // Extracting components
        const year = joinDate.getFullYear();
        const month = joinDate.getMonth() + 1; // Month is zero-indexed, so add 1
        const day = joinDate.getDate();
        const hours = joinDate.getHours();
        const minutes = joinDate.getMinutes();
        const seconds = joinDate.getSeconds();

        // Creating a formatted string
        const userJoinDate = `${year}-${month}-${day}`;
        const userjoinTime = `${hours}:${minutes}:${seconds}`

        // Get the user reports
        const userReportsQuery = query(collection(fireDB, 'reports'), where('uid', '==', userId));
        const userReportsSnapshot = await getDocs(userReportsQuery);
        const userReportsCount = userReportsSnapshot.size;

        const userReportsFiled = userReportsSnapshot.docs.filter(doc => doc.data().status === "pending").length;
        const userReportsUnfiled = userReportsSnapshot.docs.filter(doc => doc.data().status === "in_progress").length;
        const userReportsResolved = userReportsSnapshot.docs.filter(doc => doc.data().status === "resolved").length;

        // Set the user details
        const metadata = {
            userId,
            userReportsCount,
            userReportsFiled,
            userReportsUnfiled,
            userReportsResolved,
            username,
            emailId,
            joinDate: userJoinDate,
        };

        const details = localStorage.getItem("userProfile");

        if ((details == null)) {
            const permanentData = {
                username: username,
                emailId: emailId,
                joinDate: userjoinTime,
            };

            // Convert the object to a JSON string
            const permanentDataString = JSON.stringify(permanentData);

            // Store the JSON string in localStorage
            localStorage.setItem("userProfile", permanentDataString);
        }


        return metadata;
    };

    const [mail, setEmail] = useState("");

    const getUserEmail = async (authorID) => {

        const usersCollection = collection(fireDB, 'users');

        const userQuery = query(usersCollection, where('uid', '==', authorID));

        getDocs(userQuery)
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    const userDocument = querySnapshot.docs[0].data();
                    let userEmail = userDocument.email;
                    setEmail(userEmail); 
                    return userEmail;
                } else {
                    console.log('No user found with the specified UID.');
                }
            })
            .catch((error) => {
                console.error('Error retrieving user email:', error);
            });

    }

    const [user, setUser] = useState([]);

    const getUserData = async () => {
        setLoading(true)
        try {
            const result = await getDocs(collection(fireDB, "users"))
            const usersArray = [];
            result.forEach((doc) => {
                usersArray.push(doc.data());
                setLoading(false)
            });
            setUser(usersArray);
            // console.log(usersArray)
            setLoading(false);
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const [profiles, setProfiles] = useState({
        userid: "",        // Unique user ID, you can use Firebase Authentication UID
        fullname: "",      // User's full name
        DOB: null,         // Date of Birth (you can use Firebase Timestamp)
        age: null,         // Calculated or updated age (can be derived from DOB)
        email: "",
        phoneNo: null,
        imageUrl: null,
        country: "Moldova",
        followers: 0,
        followings: 0,
        time: Timestamp.now()
    });

    const updateProfile = async () => {
        if (profiles.email == null || profiles.fullname == null || profiles.userid == null) {
            return toast.error("All fields are required")
        }

        setLoading(true)

        try {
            const profileRef = collection(fireDB, 'profiles');
            await addDoc(profileRef, profiles)
            toast.success("Updated profile successfully");
            setTimeout(() => {
                window.location.href = '/userprofile'
            }, 800);
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

    const addProfile = async () => {
        if (profiles.email != null && profiles.fullname != null) {
            const profRef = collection(fireDB, 'profiles');
            await addDoc(profRef, profiles);
            toast.success("Updated profile siuccessfully!");
            setTimeout(() => {
                window.location.href = "/userprofile";
            }, 800);
            setLoading(false)
        }
        else {
            console.log("User email is not specified");
        }
    }

    const [userProfile, setUserprofile] = useState([]);

    const getProfileData = async (userid) => {
        setLoading(true);

        try {
            const q = query(
                collection(fireDB, 'profiles'),
                where('userid', '==', userid)
            );

            const data = onSnapshot(q, (querySnapshot) => {
                let profileData = [];
                querySnapshot.forEach((doc) => {
                    profileData.push({ ...doc.data(), id: doc.id });
                });
                setUserprofile(profileData);
                setLoading(false);
            });

            return () => data;
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        getUserData();
    }, []);

    const [searchkey, setSearchkey] = useState('')
    const [categoryType, setPostCategory] = useState('')

    const [reportType, setReportType] = useState('')

    return (
        <MyContext.Provider value={{
            mode, toggleMode, loading, setLoading,
            sendReport, reports, getAllReports, getFiledReports, reportType,
            setReportType, deleteReport, addDeptAdmin,
            getMyDept, getSpecificReports, addNotification, getMyNotifications, notifications,
            deleteNotification, submitReview, getReportbyId, UpdateReportState, UpdateReportDepartment,
            user, profiles, setProfiles, updateProfile,
            userProfile, setUserprofile, addProfile,
            getProfileData, searchkey,
            setSearchkey, setPostCategory, categoryType,
            getUserEmail, mail,
            getUserDetails
        }}>
            {props.children}
        </MyContext.Provider>
    )
}

export default myState