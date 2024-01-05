
import React, { useContext, useEffect, useState } from 'react'
import myContext from '../../context/data/myContext';
import Report from './Report';
import Table from '../dataTable/Table';

const AdminDashboard = () => {

    const context = useContext(myContext)
    const { reports, getAllReports, reportType, setReportType, deleteReport, addDeptAdmin, UpdateReportState, UpdateReportDepartment } = context;

    const [filteredReports, setFilteredReports] = useState([]);
    const [uniqueCategories, setUniqueCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Simultaneously fetch data from both functions
                const report = await getAllReports();

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

    }, []);

    useEffect(() => {
        console.log(reports)
        const uniqueCategories = [...new Set(reports.map(report => report.incidentType))];

        const filteredReports = reports.filter((obj) => obj.incidentType.toLowerCase()
            .includes(reportType.toLowerCase()))

        setUniqueCategories(uniqueCategories);
        setFilteredReports(filteredReports);

    }, [reports]);

    const [addDeptAdminFn, setAddDeptAdminFn] = useState(false);

    const [email, setEmail] = useState('');
    const [department, setDepartment] = useState('');
    const [confMsg, setConfMsg] = useState(false);

    const handleDelete = (id) => {
        deleteReport(id);
    }

    const handleStatusChange = (id, status) => {
        // Update the status of the report with the given ID
        UpdateReportState(id, status);
    }

    const handleDepartmentChange = (id, department) => {
        // Update the department of the report with the given ID
        UpdateReportDepartment(id, department);
    }


    return (
        <div className='mb-8 overflow-x-hidden'>

            <div className='mt-4'>
                <h2 className='text-lg md:text-4xl merriweather text-center'>Admin Dashboard</h2>
            </div>

            <div className='md:w-[60%] mt-4 md:mt-3 mx-8 md:ml-[10%]'>

                <div className="flex items-center justify-between mb-4 px-4 py-3 mt-2 bg-zinc-900
                 text-gray-600 rounded-md shadow-md">
                    <p className="text-lg font-semibold mr-2 text-white">
                        Explore Reports
                    </p>

                    <div className='md:flex md:flex-col md:gap-y-1 lg:flex lg:flex-row lg:gap-9'>
                        <button
                            onClick={() => { setReportType('') }}
                            className="px-4 py-2 bg-zinc-800 hover:bg-gray-800 transition-all
            text-gray-50 hover:text-slate-100 
            text-sm font-medium rounded-md">
                            Reset Filters
                        </button>

                        <button
                            onClick={() => setAddDeptAdminFn((prev) => !prev)}
                            className="px-4 py-2 mt-3 md:mt-0 bg-zinc-800  hover:bg-gray-800  
            text-gray-50 hover:text-slate-100 transition-all
            text-sm font-medium rounded-md">
                            Add Department Admin
                        </button>


                    </div>

                </div>

                {addDeptAdminFn ?

                    <form className="space-y-4 md:ml-[20%]">

                        <h3 className='text-center text-2xl text-white-400 font-bold merriweather'>Add a new Department Admin</h3>

                        <div>
                            <div className="mb-4">

                                <div>
                                    <input type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        name='email'
                                        className=' bg-gray-600 mb-4 px-2 py-2 w-full   rounded-lg inputbox text-white placeholder:text-gray-200 outline-none'
                                        placeholder='Email-ID of user'
                                    />
                                </div>

                                <label htmlFor="incidentType" className="block text-sm font-medium text-gray-200">
                                    Department
                                </label>

                                <select
                                    id="department"
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    className="mt-1 p-2 w-full border rounded-md text-slate-700 
focus:outline-none focus:ring focus:border-blue-300 text-sm lg:text-lg"
                                    required
                                >
                                    <option value="" disabled>Select Department</option>
                                    <option value="Accident">Accident</option>
                                    <option value="Infrastructure">Infrastructure</option>
                                    <option value="Cybersecurity">Cybersecurity</option>
                                    <option value="Suspicious activities">Suspicious activities</option>
                                    <option value="Crime">Crime</option>
                                    <option value="Social Issues">Social Issues</option>

                                </select>
                            </div>

                            <div className='my-2'>
                                <button className='bg-zinc-900 p-4'
                                    onClick={
                                        async (e) => {
                                            e.preventDefault();
                                            setConfMsg(true);
                                        }
                                    }>Add department Admin</button>

                                {confMsg ?

                                    <div>
                                        <h3 className='my-2 italic font-semibold'>Do you want to add {email} as Dept. admin of {department}</h3>
                                        <button className='bg-slate-700 border-green-400'
                                            onClick={
                                                async (e) => {
                                                    e.preventDefault(); 
                                                    const feedback = await addDeptAdmin(email, department);

                                                    if (feedback === true) setAddDeptAdminFn(false)
                                                }
                                            }>Yes, I'm sure</button>
                                    </div>

                                    : ""
                                }

                            </div>

                        </div>

                    </form>

                    :

                    ""}

                <div className="mb-6">
                    <select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        className="px-6 py-3 rounded-md bg-zinc-900 text-white
            border-transparent outline-0 focus:border-gray-500 
            text-sm min-w-42">
                        <option value="" className="text-center">All Categories</option>
                        {uniqueCategories.map((category, index) => (
                            <option key={index} value={category} className='text-center'>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

            </div>


            <Table 
                data={filteredReports} 
                mapType={"admin"}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange} 
                onDepartmentChange={handleDepartmentChange}
            />

            {(filteredReports.length > 0) ? (
                filteredReports.map((reportItem, index) => {
                    const { incidentType, imageUrl, latitude, longitude,
                        anonymousReporting, description } = reportItem;

                    
                    // return (
                    //     <div key={index}>
                    //         <Report
                    //             reporttype={incidentType}
                    //             images={imageUrl}
                    //             latitude={latitude}
                    //             longitude={longitude}
                    //             reportID={reportItem.id}
                    //             reportUserID={reportItem.uid}
                    //             anonymousReporting={anonymousReporting}
                    //             description={description}
                    //             deleteReport={handleDelete}
                    //         />
                    //     </div>
                    // );
                })
            ) : (
                <div>
                    <h2 className='text-center text-2xl text-white my-10 merriweather'>Hurray, no reports filed as of now. Happy Hours..</h2>
                </div>
            )}

        </div>
    )
}

export default AdminDashboard;