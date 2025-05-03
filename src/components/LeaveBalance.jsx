import React from 'react';

const LeaveBalance = ({ balance, loading, error }) => {
    // If balance is not an object or is null, show a friendly error
    const isValidBalance = balance && typeof balance === 'object' && !Array.isArray(balance);
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-green-700 mb-2">Leave Balance</h3>
            {loading ? (
                <div className="text-gray-500">Loading...</div>
            ) : error ? (
                <div className="text-red-500 text-sm">{typeof error === 'string' ? error : 'Failed to load leave balance.'}</div>
            ) : !isValidBalance ? (
                <div className="text-red-500 text-sm">Invalid leave balance data.</div>
            ) : (
                <ul className="space-y-1">
                    {Object.entries(balance).map(([type, days]) => (
                        <li key={type} className="flex justify-between">
                            <span className="capitalize">{type.replace('_', ' ').toLowerCase()}</span>
                            <span className="font-bold">{days}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LeaveBalance; 