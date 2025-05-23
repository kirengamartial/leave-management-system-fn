import React, { useState } from 'react';

const leaveTypes = [
    { value: '', label: 'Select Leave Type' },
    { value: 'ANNUAL', label: 'Annual Leave' },
    { value: 'SICK', label: 'Sick Leave' },
    { value: 'MATERNITY', label: 'Maternity Leave' },
    { value: 'PATERNITY', label: 'Paternity Leave' },
    { value: 'BEREAVEMENT', label: 'Bereavement Leave' },
    { value: 'UNPAID', label: 'Unpaid Leave' },
    { value: 'STUDY', label: 'Study Leave' },
    { value: 'PERSONAL', label: 'Personal Leave' },
];

const ApplyLeaveForm = ({ onSubmit, loading, error }) => {
    const [leaveType, setLeaveType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [files, setFiles] = useState([]);
    const [fileError, setFileError] = useState('');

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        // Validate file size - optional, adjust to your requirements
        const maxSize = 5 * 1024 * 1024; // 5MB
        const invalidFiles = selectedFiles.filter(file => file.size > maxSize);

        if (invalidFiles.length > 0) {
            setFileError('File size exceeds 5MB limit');
            return;
        }

        if (selectedFiles.length > 1) {
            setFileError('Note: Only the first file will be uploaded');
        } else {
            setFileError('');
        }

        setFiles(selectedFiles);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ leaveType, startDate, endDate, reason, files });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
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
                <label className="block text-gray-700 text-sm font-medium mb-1">Supporting Document</label>
                <input
                    type="file"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                    onChange={handleFileChange}
                />
                <div className="text-xs text-gray-400 mt-1">
                    Upload a supporting document (PDF, images, etc.). Maximum size: 5MB.
                </div>
                {fileError && <div className="text-xs text-amber-500 mt-1">{fileError}</div>}
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