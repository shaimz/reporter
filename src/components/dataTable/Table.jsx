import React, { useContext } from 'react';
import { isAdmin, isDept } from '../../utils/Admin';
import { STATUSES } from '../../utils/Statuses';
import Map from '../Map';
import myContext from '../../context/data/myContext';
import GeocodingSearch from '../reporting/Geocoding';

const Table = ({ data, mapType, onDepartmentChange, onDelete, onStatusChange }) => {
    const [expandedRow, setExpandedRow] = React.useState(null);

    const context = useContext(myContext);
    const { getExactLocation } = context;

    const toggleDetails = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    }

    return (
        <section className="relative py-16 bg-blueGray-50">
            <div className="w-full mb-12 px-4">
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-zinc-900 text-white">
                    <div className="rounded-t mb-0 px-4 py-3 border-0">
                        <div className="flex flex-wrap items-center">
                            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                                <h3 className="font-semibold text-lg text-white">Report Table</h3>
                            </div>
                        </div>
                    </div>
                    <div className="block w-full overflow-x-auto">
                        <table className="items-center w-full bg-transparent border-collapse">
                            <thead>
                                <tr>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-zinc-600 border-zinc-700">
                                        Imagine
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-zinc-600 border-zinc-700">
                                        Incident Type
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-zinc-600 border-zinc-700">
                                        Description
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-zinc-600 border-zinc-700">
                                        Departament
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-zinc-600 border-zinc-700">
                                        Status
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-zinc-600 border-zinc-700">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((report, index) => (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                {report.imageUrl ? (
                                                    <img
                                                        src={report.imageUrl}
                                                        alt="Report"
                                                        className="w-16 h-16 object-cover rounded"
                                                    />
                                                ) : (
                                                    <span>No Image</span>
                                                )}
                                            </td>
                                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                {report.incidentType}
                                            </td>
                                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                {report.description}
                                            </td>
                                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                { // if admin you can assign to department
                                                    isAdmin() ? ( 
                                                        <select
                                                            value={report.department_id ?? ""}
                                                            onChange={(e) => onDepartmentChange(report.id, e.target.value)}
                                                            className="bg-zinc-900 text-white px-3 py-1 rounded border border-zinc-700"
                                                        >
                                                            <option value="" className="text-gray" disabled>Asigneaza echipa</option>
                                                            <option value="intervention_team">Echipa de interventie</option>
                                                        </select>
                                                    ) : (
                                                        <span>{report.departmentName}</span>
                                                    )
                                                }
                                            </td>
                                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                { ( isAdmin() || isDept() ) ? (
                                                    <select
                                                        value={report.status}
                                                        onChange={(e) => onStatusChange(report.id, e.target.value)}
                                                        className="bg-zinc-900 text-white px-3 py-1 rounded border border-zinc-700"
                                                    >
                                                        <option value="pending">In asteptare</option>
                                                        <option value="resolved">Rezolvat</option>
                                                        <option value="in_progress">In Lucru</option>
                                                    </select>
                                                ) : (
                                                    <span>{STATUSES[report.status]}</span>
                                                )}
                                            </td>
                                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                <button
                                                    className="bg-yellow-500 text-white px-3 mx-3 py-1 rounded"
                                                    onClick={() => toggleDetails(report.id)}
                                                >
                                                    Details
                                                </button>

                                                <button
                                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                                    onClick={() => onDelete(report.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>

                                        {/* Details Row */}
                                        {expandedRow === report.id && (
                                            <tr>
                                                <td colSpan="6" className="bg-zinc-800 text-white p-4">
                                                    <div className="p-4 rounded shadow-md">
                                                        <h4 className="text-lg font-semibold mb-2">Details for Report #{report.id}</h4>
                                                        <p><strong>Incident Type:</strong> {report.incidentType}</p>
                                                        <p><strong>Description:</strong> {report.description}</p>
                                                        <p><strong>Location:</strong> 
                                                        { (getExactLocation(report.latitude, report.longitude)) ?? (
                                                            <GeocodingSearch />
                                                        )}
                                                        </p>
                                                        <Map mapType={mapType} departmentReport={report} ></Map>
                                                        <p><strong>Department:</strong> {report.department_name || 'N/A'}</p>
                                                        <p><strong>Status:</strong> {STATUSES[report.status]}</p>
                                                        <p><strong>Date:</strong> {new Date(report.date).toLocaleString()}</p>
                                                        {report.imageUrl && (
                                                            <img
                                                                src={report.imageUrl}
                                                                alt="Report"
                                                                className="w-32 h-32 object-cover rounded mt-4"
                                                            />
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Table;