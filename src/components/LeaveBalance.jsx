import React from 'react';

const LeaveBalance = ({ balance, loading, error }) => {
    // If balance is not an object or is null, show a friendly error
    const isValidBalance = balance && typeof balance === 'object' && !Array.isArray(balance);

    // Colors for different leave types
    const leaveTypeColors = {
        annual: {
            bg: 'bg-blue-100',
            text: 'text-blue-700',
            border: 'border-blue-200'
        },
        sick: {
            bg: 'bg-green-100',
            text: 'text-green-700',
            border: 'border-green-200'
        },
        personal: {
            bg: 'bg-purple-100',
            text: 'text-purple-700',
            border: 'border-purple-200'
        },
        study: {
            bg: 'bg-yellow-100',
            text: 'text-yellow-700',
            border: 'border-yellow-200'
        },
        bereavement: {
            bg: 'bg-gray-100',
            text: 'text-gray-700',
            border: 'border-gray-200'
        },
        paternity: {
            bg: 'bg-indigo-100',
            text: 'text-indigo-700',
            border: 'border-indigo-200'
        },
        maternity: {
            bg: 'bg-pink-100',
            text: 'text-pink-700',
            border: 'border-pink-200'
        }
    };

    // Default color for any other leave type
    const defaultColor = {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-200'
    };

    // Get color scheme for a leave type
    const getColorScheme = (leaveType) => {
        const type = leaveType.toLowerCase().replace('_', '');
        return leaveTypeColors[type] || defaultColor;
    };

    const renderLeaveCards = () => {
        if (!isValidBalance) return null;

        return Object.entries(balance).map(([type, days]) => {
            const { bg, text, border } = getColorScheme(type);
            const formattedType = type.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase());

            return (
                <div
                    key={type}
                    className={`relative flex flex-col ${bg} ${border} border rounded-lg p-4 transition-all duration-300 hover:shadow-md`}
                >
                    <span className={`text-xs font-medium uppercase ${text}`}>{formattedType}</span>
                    <div className="flex items-end mt-1">
                        <span className={`text-2xl font-bold ${text}`}>{days}</span>
                        <span className="ml-1 text-xs text-gray-500">days available</span>
                    </div>
                    <div className="mt-2 w-full bg-white rounded-full h-2">
                        <div
                            className={`${text.replace('text', 'bg')} h-2 rounded-full`}
                            style={{ width: `${Math.min(100, days * 10)}%` }}
                        />
                    </div>
                </div>
            );
        });
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-6">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-500 text-sm">Loading your leave balance...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <svg className="mx-auto h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-red-800">Unable to load leave balance</h3>
                <p className="mt-1 text-sm text-red-500">{typeof error === 'string' ? error : 'Please try again later.'}</p>
            </div>
        );
    }

    // Invalid data state
    if (!isValidBalance) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <svg className="mx-auto h-10 w-10 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-yellow-800">No leave balance information available</h3>
                <p className="mt-1 text-sm text-yellow-500">Please contact HR if this problem persists.</p>
            </div>
        );
    }

    // Empty state
    if (Object.keys(balance).length === 0) {
        return (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <svg className="mx-auto h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-3 text-lg font-medium text-blue-800">No leave balance yet</h3>
                <p className="mt-2 text-sm text-blue-500">Your leave balance information will appear here once available.</p>
            </div>
        );
    }

    // Normal state with data
    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {renderLeaveCards()}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Quick Tips</h4>
                <ul className="text-xs text-gray-500 space-y-1">
                    <li className="flex items-start">
                        <svg className="h-4 w-4 text-blue-500 mr-1 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Plan your leaves in advance for better approval chances
                    </li>
                    <li className="flex items-start">
                        <svg className="h-4 w-4 text-blue-500 mr-1 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Unused annual leaves may expire at the end of the year
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default LeaveBalance;