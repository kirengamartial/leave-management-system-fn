import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const LeaveBalanceAdjustment = () => {
    const [employees, setEmployees] = useState([]);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [adjustmentAmount, setAdjustmentAmount] = useState(0);
    const [reason, setReason] = useState('');

    useEffect(() => {
        fetchEmployees();
        fetchLeaveTypes();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/leaves/admin/employees`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch employees');
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            toast.error('Failed to load employees');
        }
    };

    const fetchLeaveTypes = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/leaves/admin/types`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch leave types');
            const data = await response.json();
            setLeaveTypes(data);
        } catch (error) {
            toast.error('Failed to load leave types');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedEmployee || !selectedType) {
            toast.error('Please select both employee and leave type');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/leaves/admin/balance/adjust`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    employeeId: selectedEmployee,
                    leaveTypeId: selectedType,
                    adjustmentAmount,
                    reason,
                }),
            });

            if (!response.ok) throw new Error('Failed to adjust balance');

            toast.success('Leave balance adjusted successfully');
            // Reset form
            setSelectedEmployee('');
            setSelectedType('');
            setAdjustmentAmount(0);
            setReason('');
        } catch (error) {
            toast.error('Failed to adjust leave balance');
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Adjust Leave Balance</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Employee</label>
                    <select
                        value={selectedEmployee}
                        onChange={(e) => setSelectedEmployee(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    >
                        <option value="">Select Employee</option>
                        {employees.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                                {employee.name} ({employee.email})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Leave Type</label>
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    >
                        <option value="">Select Leave Type</option>
                        {leaveTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Adjustment Amount</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                            type="number"
                            value={adjustmentAmount}
                            onChange={(e) => setAdjustmentAmount(parseInt(e.target.value))}
                            className="block w-full rounded-md border-gray-300 pr-12 focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="0"
                            required
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">days</span>
                        </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                        Use positive numbers to add days, negative numbers to subtract days
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Reason for Adjustment</label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows="3"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                        Adjust Balance
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LeaveBalanceAdjustment; 