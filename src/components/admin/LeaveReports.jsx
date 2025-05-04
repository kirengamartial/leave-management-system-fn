import { useState, useEffect } from 'react';

const LeaveReports = () => {
    const [employees, setEmployees] = useState([]);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [filters, setFilters] = useState({
        employeeId: '',
        leaveTypeId: '',
        startDate: '',
        endDate: '',
        status: '',
    });
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Simulated data for demo
        setEmployees([
            { id: 1, name: 'John Doe' },
            { id: 2, name: 'Jane Smith' }
        ]);
        setLeaveTypes([
            { id: 1, name: 'Annual Leave' },
            { id: 2, name: 'Sick Leave' },
            { id: 3, name: 'Personal Leave' }
        ]);
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGenerateReport = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulated API call
        setTimeout(() => {
            setReports([
                {
                    id: 1,
                    employeeName: 'John Doe',
                    leaveTypeName: 'Annual Leave',
                    startDate: '2025-04-10',
                    endDate: '2025-04-15',
                    status: 'APPROVED',
                    days: 6
                },
                {
                    id: 2,
                    employeeName: 'Jane Smith',
                    leaveTypeName: 'Sick Leave',
                    startDate: '2025-04-20',
                    endDate: '2025-04-22',
                    status: 'PENDING',
                    days: 3
                }
            ]);
            setIsLoading(false);
        }, 1000);
    };

    const handleDownloadReport = () => {
        // Simulated download functionality
        console.log("Downloading report with filters:", filters);
    };

    // Custom select component with improved styling
    const CustomSelect = ({ name, value, onChange, options, placeholder }) => (
        <div className="relative">
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="block w-full px-4 py-2 pr-8 leading-tight bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 text-gray-700"
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.id || option.value} value={option.id || option.value}>
                        {option.name || option.label}
                    </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Leave Reports</h2>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                            <CustomSelect
                                name="employeeId"
                                value={filters.employeeId}
                                onChange={handleFilterChange}
                                options={employees}
                                placeholder="All Employees"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                            <CustomSelect
                                name="leaveTypeId"
                                value={filters.leaveTypeId}
                                onChange={handleFilterChange}
                                options={leaveTypes}
                                placeholder="All Types"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <CustomSelect
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                options={[
                                    { id: 'PENDING', name: 'Pending' },
                                    { id: 'APPROVED', name: 'Approved' },
                                    { id: 'REJECTED', name: 'Rejected' }
                                ]}
                                placeholder="All Statuses"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={filters.startDate}
                                onChange={handleFilterChange}
                                className="block w-full px-4 py-2 bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 text-gray-700"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={filters.endDate}
                                onChange={handleFilterChange}
                                className="block w-full px-4 py-2 bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 text-gray-700"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={handleDownloadReport}
                            className="px-5 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                            disabled={isLoading}
                        >
                            Download Report
                        </button>
                        <button
                            type="button"
                            onClick={handleGenerateReport}
                            className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Generating...' : 'Generate Report'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Reports Table */}
            {reports.length > 0 && (
                <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {reports.map((report) => (
                                    <tr key={report.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{report.employeeName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{report.leaveTypeName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(report.startDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(report.endDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                                                ${report.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                    report.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'}`}
                                            >
                                                {report.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{report.days}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveReports;