import React, { useState } from 'react';

const leaveTypes = [
    { value: '', label: 'Select Leave Type' },
    { value: 'ANNUAL', label: 'Annual Leave' },
    { value: 'SICK', label: 'Sick Leave' },
    { value: 'CASUAL', label: 'Casual Leave' },
    { value: 'UNPAID', label: 'Unpaid Leave' },
];

const ApplyLeaveForm = ({ onSubmit, loading, error }) => {
    const [leaveType, setLeaveType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [files, setFiles] = useState([]);

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ leaveType, startDate, endDate, reason, files });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Apply for Leave</h3>
            <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Leave Type</label>
                <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    required
                >
                    {leaveTypes.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                </select>
            </div>
            <div className="flex gap-2">
                <div className="w-1/2">
                    <label className="block text-gray-700 text-sm font-medium mb-1">Start Date</label>
                    <input
                        type="date"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div>
                <div className="w-1/2">
                    <label className="block text-gray-700 text-sm font-medium mb-1">End Date</label>
                    <input
                        type="date"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                </div>
            </div>
            <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Reason</label>
                <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    required
                />
            </div>
            <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Supporting Documents</label>
                <input
                    type="file"
                    multiple
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                    onChange={handleFileChange}
                />
                <div className="text-xs text-gray-400 mt-1">You can upload multiple files (PDF, images, etc.)</div>
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                disabled={loading}
            >
                {loading ? 'Submitting...' : 'Apply for Leave'}
            </button>
        </form>
    );
};

export default ApplyLeaveForm;