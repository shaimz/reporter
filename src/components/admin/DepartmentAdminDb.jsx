
import React, { useContext, useEffect, useState } from 'react'
import myContext from '../../context/data/myContext';
import Table from '../dataTable/Table';

const DepartmentAdminDB = () => {

    const context = useContext(myContext)
    const { reports, getAllReports, getReportsByDepart, deleteReport, getMyDept, getFiledReports, UpdateReportState, UpdateReportDepartment } = context;

    const [department, setDept] = useState('');
    const [deptName, setDeptname] = useState('');

    const user_emailID = JSON.parse(localStorage.getItem('user')).user.email;

    let deptReports = reports.filter((obj) => obj.incidentType.toLowerCase());

    const [filedreports, setFiledReports] = useState(false);

    const fetchUnFiledReports = async () => {

        await getReportsByDepart(department);
        deptReports = reports.filter((obj => obj.status !== "pending"));

        setFiledReports(false);
    }

    const fetchAllReports = async () => {
        await getReportsByDepart(department);
        deptReports = reports.filter((obj) => obj.incidentType.toLowerCase());

        setFiledReports(false);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Simultaneously fetch data from both functions
                const [deptData] = await Promise.all([
                    getMyDept(user_emailID),
                ]);

                setDept(deptData?.department);
                setDeptname(deptData?.departmentName);

                await getReportsByDepart(deptData?.department);
                console.log(reports, deptReports)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (reportItem) => {
        deleteReport(reportItem);
    }

    const handleStatusChange = (id, status) => {
        // Update the status of the report with the given ID
        UpdateReportState(id, status)
        setTimeout(() => {
            window.location.reload();
        }, 1000)

    }

    const handleDepartmentChange = (id, department) => {
        // Update the department of the report with the given ID
        UpdateReportDepartment(id, department);
    }


    return (
        <div className='mb-8 overflow-x-hidden'>

            <div className='mt-4'>
                <h2 className=' mt-10 md:mt-0 text-lg md:text-4xl merriweather text-center'>{deptName} Dashboard</h2>
            </div>

            <div className='lg:w-[80%] ml-[10%] mt-3'>

                <div className="flex gap-x-2 items-center justify-between mb-4 px-4 py-3 mt-2 
                 text-gray-600 rounded-md">


                    <button className='bg-zinc-900 px-4 py-2 text-white shadow-md hover:bg-zinc-600 transition-all'
                        onClick={fetchUnFiledReports}
                    >
                        Arata raporturi in lucru/progres
                    </button>


                    <button className='bg-zinc-900 px-4 py-2 text-white shadow-md hover:bg-zinc-600 transition-all'
                        onClick={fetchAllReports}
                    >
                        Arata toate raporturile
                    </button>

                </div>

            </div>

            {((filedreports === false) && deptReports && deptReports.length > 0) ? (
                
                <Table data={deptReports} mapType={"admin"} onDelete={handleDelete} onDepartmentChange={handleDepartmentChange} onStatusChange={handleStatusChange}/>

                // deptReports.map((reportItem, index) => {

                //     const { incidentType, imageUrl, latitude, longitude,
                //         anonymousReporting, description, uid, id, filed } = reportItem;

                //     const handleDelete = async () => {
                //         deleteReport(reportItem);
                //     }

                //     return (
                //         <div key={index}>
                //             <Report
                //                 reporttype={incidentType}
                //                 images={imageUrl}
                //                 latitude={latitude}
                //                 longitude={longitude}
                //                 anonymousReporting={anonymousReporting}
                //                 description={description}
                //                 deleteReport={handleDelete}
                //                 reportUserID={uid}
                //                 reportID={id}
                //                 filed={filed}
                //             />
                //         </div>
                //     );
                // })
            ) : ""}

            {(filedreports && filedreports.length > 0) ? (

                    <Table data={filedreports} mapType={"admin"} onDelete={handleDelete} onDepartmentChange={handleDepartmentChange} onStatusChange={handleStatusChange}/>

                // filedreports.map((reportItem, index) => {

                    // const { incidentType, imageUrl, latitude, longitude,
                    //     anonymousReporting, description, uid, id, filed } = reportItem;

                    // const handleDelete = async () => {
                    //     deleteReport(reportItem);
                    // }

                    // return (
                    //     <div key={index}>
                    //         <Report
                    //             reporttype={incidentType}
                    //             images={imageUrl}
                    //             latitude={latitude}
                    //             longitude={longitude}
                    //             anonymousReporting={anonymousReporting}
                    //             description={description}
                    //             deleteReport={handleDelete}
                    //             reportUserID={uid}
                    //             reportID={id}
                    //             filed={filed}
                    //         />
                    //     </div>
                    // );
                // })
            ) : ""}

            {
                (filedreports !== false && filedreports.length === 0) ||
                    (deptReports && deptReports.length === 0)

                    ?

                    <div>
                        <h2 className='text-center text-2xl text-white my-10 merriweather'>Hurray, no reports filed as of now. Happy Hours..</h2>
                    </div>
                    :

                    ""
            }

        </div>
    )
}

export default DepartmentAdminDB;