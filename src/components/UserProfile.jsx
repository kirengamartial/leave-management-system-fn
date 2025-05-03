import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const UserProfile = () => {
    const user = useSelector((state) => state.auth.user);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [leaveBalances, setLeaveBalances] = useState([]);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name,
                email: user.email,
            }));
        }
        fetchLeaveBalances();
    }, [user]);

    const fetchLeaveBalances = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/leaves/balance`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch leave balances');
            const data = await response.json();
            setLeaveBalances(data);
        } catch (error) {
            toast.error('Failed to load leave balances');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords if changing
        if (formData.newPassword) {
            if (formData.newPassword !== formData.confirmPassword) {
                toast.error('New passwords do not match');
                return;
            }
            if (!formData.currentPassword) {
                toast.error('Current password is required to set a new password');
                return;
            }
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    name: formData.name,
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                }),
            });

            if (!response.ok) throw new Error('Failed to update profile');

            toast.success('Profile updated successfully');
            setIsEditing(false);
            // Reset password fields
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            }));
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-6">Profile Settings</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    disabled
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                                />
                            </div>
                        </div>

                        {isEditing && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Change Password</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end space-x-3">
                            {isEditing ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                                    >
                                        Save Changes
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Leave Balances */}
                <div className="border-t border-gray-200">
                    <div className="p-6">
                        <h3 className="text-lg font-medium mb-4">Leave Balances</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {leaveBalances.map((balance) => (
                                <div
                                    key={balance.leaveTypeId}
                                    className="bg-gray-50 rounded-lg p-4"
                                >
                                    <h4 className="font-medium text-gray-900">{balance.leaveTypeName}</h4>
                                    <p className="text-2xl font-bold text-indigo-600 mt-2">
                                        {balance.remainingDays} days
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Total: {balance.totalDays} days
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile; 