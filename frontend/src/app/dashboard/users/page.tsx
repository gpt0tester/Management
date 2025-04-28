// // // // src/app/dashboard/users/page.tsx
// // // 'use client';

// // // import { useState, useEffect } from 'react';
// // // import api from '@/utils/api'; // Adjust import path for your api utility
// // // import Link from 'next/link'; // For navigation links

// // // // Define TypeScript interfaces based on your API response structure
// // // interface Role {
// // //   id: string;
// // //   name: string;
// // // }

// // // interface User {
// // //   id: string;
// // //   username: string;
// // //   email: string;
// // //   roles?: Role[]; // Roles might be included in the user list or fetched separately
// // //   createdAt: string; // Example additional field
// // // }

// // // export default function ManageUsersPage() {
// // //   const [users, setUsers] = useState<User[]>([]);
// // //   const [loading, setLoading] = useState<boolean>(true);
// // //   const [error, setError] = useState<string | null>(null);

// // //   useEffect(() => {
// // //     const fetchUsers = async () => {
// // //       setLoading(true);
// // //       setError(null);
// // //       try {
// // //         // Adjust endpoint if needed
// // //         const response = await api.get<{ users: User[] }>('/user/list'); // Assuming API returns { users: [...] }
// // //         setUsers(response.data.users || []); // Handle cases where data might be missing
// // //       } catch (err: unknown) {
// // //         console.error('Failed to fetch users:', err);
// // //         let message = 'Could not load users.';
// // //         // Basic error handling (same pattern as useAuth hook)
// // //         if (typeof err === 'object' && err !== null && 'response' in err) {
// // //            const axiosError = err as { response?: { data?: { message?: string } } };
// // //            message = axiosError.response?.data?.message || 'Failed to fetch users due to server error.';
// // //         } else if (err instanceof Error) {
// // //            message = err.message;
// // //         }
// // //         setError(message);
// // //         setUsers([]); // Clear users on error
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     fetchUsers();
// // //   }, []); // Empty dependency array means this runs once on mount

// // //   const handleDeleteUser = async (userId: string) => {
// // //     // Basic confirmation before deleting
// // //     if (!window.confirm('Are you sure you want to delete this user?')) {
// // //       return;
// // //     }
// // //     try {
// // //       await api.delete(`/user/delete/${userId}`);
// // //       // Refresh the list after deleting
// // //       setUsers(currentUsers => currentUsers.filter(user => user.id !== userId));
// // //       alert('User deleted successfully.');
// // //     } catch (err) {
// // //       console.error('Failed to delete user:', err);
// // //       alert('Failed to delete user.'); // Show basic error alert
// // //       // More robust error handling could update the setError state
// // //     }
// // //   };


// // //   if (loading) {
// // //     return <div className="p-4">Loading users...</div>;
// // //   }

// // //   if (error) {
// // //     return <div className="p-4 text-red-500">Error: {error}</div>;
// // //   }

// // //   return (
// // //     <div className="p-6">
// // //       <div className="flex justify-between items-center mb-4">
// // //         <h1 className="text-2xl font-bold">Manage Users</h1>
// // //         <Link href="/dashboard/users/new">
// // //            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
// // //              Add New User
// // //            </button>
// // //          </Link>
// // //       </div>

// // //       {users.length === 0 ? (
// // //         <p>No users found.</p>
// // //       ) : (
// // //         <div className="overflow-x-auto shadow-md rounded-lg">
// // //           <table className="min-w-full bg-white">
// // //             <thead className="bg-gray-100">
// // //               <tr>
// // //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
// // //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
// // //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
// // //                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
// // //                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
// // //               </tr>
// // //             </thead>
// // //             <tbody className="divide-y divide-gray-200">
// // //               {users.map((user) => (
// // //                 <tr key={user.id}>
// // //                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
// // //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
// // //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// // //                     {user.roles?.map(role => role.name).join(', ') || 'No roles'}
// // //                   </td>
// // //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// // //                     {new Date(user.createdAt).toLocaleDateString()}
// // //                   </td>
// // //                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
// // //                     {/* Replace '#' with actual edit paths */}
// // //                     <Link href={`/dashboard/users/${user.id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4">
// // //                       Edit
// // //                     </Link>
// // //                     <button
// // //                       onClick={() => handleDeleteUser(user.id)}
// // //                       className="text-red-600 hover:text-red-900"
// // //                     >
// // //                       Delete
// // //                     </button>
// // //                   </td>
// // //                 </tr>
// // //               ))}
// // //             </tbody>
// // //           </table>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // ===========================================================================================================

// // // src/app/dashboard/users/page.tsx
// // 'use client';

// // import { useState, useEffect, useCallback } from 'react';
// // import api from '@/utils/api'; // Adjust import path for your api utility
// // import Link from 'next/link'; // For navigation links
// // import { useRouter } from 'next/navigation'; // To potentially redirect on error

// // // --- Define TypeScript Interfaces ---
// // // These should match the structure of the data returned by your backend API

// // // Interface for Role data (assuming roles are nested in user data or fetched separately)
// // interface Role {
// //   id: string; // Or number, depending on your backend
// //   name: string;
// // }

// // // Interface for User data from the /api/user/list endpoint
// // interface User {
// //   id: string; // Or number
// //   username: string;
// //   email: string;
// //   roles?: Role[]; // Roles might be included directly or need separate fetching/display logic
// //   createdAt: string; // Assuming ISO date string
// //   // Add any other relevant user fields returned by your API
// // }

// // // Interface for the expected structure of the API response for fetching users
// // interface GetUsersApiResponse {
// //   users: User[];
// //   // Include other potential response fields like pagination info if applicable
// // }

// // // --- Component Definition ---

// // export default function ManageUsersPage() {
// //   // --- State Variables ---
// //   const [users, setUsers] = useState<User[]>([]);
// //   const [loading, setLoading] = useState<boolean>(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [currentUserPermissions, setCurrentUserPermissions] = useState<string[]>([]);
// //   const router = useRouter(); // For potential redirects

// //   // --- Permission Check Effect ---
// //   // Runs once on mount to load permissions from localStorage
// //   useEffect(() => {
// //     try {
// //       const storedPermissions = localStorage.getItem('permissions');
// //       if (storedPermissions) {
// //         const parsedPermissions = JSON.parse(storedPermissions);
// //         if (Array.isArray(parsedPermissions)) {
// //           setCurrentUserPermissions(parsedPermissions);
// //         } else {
// //           console.warn('Stored permissions were not an array:', parsedPermissions);
// //           setCurrentUserPermissions([]);
// //         }
// //       } else {
// //         setCurrentUserPermissions([]); // No permissions found
// //       }
// //     } catch (parseError) {
// //       console.error('Failed to parse permissions from localStorage:', parseError);
// //       setCurrentUserPermissions([]); // Set empty on error
// //       setError('Could not load user permissions.'); // Optionally set an error
// //     }
// //   }, []); // Empty dependency array ensures this runs only once

// //   // --- Data Fetching Effect ---
// //   // Runs after permissions are loaded (or initially if no permissions needed for fetch)
// //   useEffect(() => {
// //     // Check if the user has permission to even view the list
// //     // This check might also happen in a layout or middleware
// //     if (currentUserPermissions.length > 0 && !currentUserPermissions.includes('READ_USERS')) {
// //        setError('You do not have permission to view users.');
// //        setLoading(false);
// //        // Optionally redirect: router.push('/dashboard');
// //        return; // Stop fetching if not authorized
// //     }

// //     const fetchUsers = async () => {
// //       setLoading(true);
// //       setError(null); // Clear previous errors
// //       try {
// //         // Use the correct endpoint from userRoutes.js
// //         const response = await api.get<GetUsersApiResponse>('/user/list');

// //         // Ensure the response structure matches the interface
// //         setUsers(response.data.users || []);

// //       } catch (err: unknown) {
// //         console.error('Failed to fetch users:', err);
// //         let message = 'Could not load users.';
// //         // Use the improved error handling with type checking
// //         if (typeof err === 'object' && err !== null && 'response' in err) {
// //            const axiosError = err as { response?: { data?: { message?: string }, status?: number } };
// //            // Handle specific HTTP status codes if needed
// //            if (axiosError.response?.status === 403) {
// //              message = 'Forbidden: You do not have permission to view users.';
// //            } else {
// //              message = axiosError.response?.data?.message || 'Failed to fetch users due to server error.';
// //            }
// //         } else if (err instanceof Error) {
// //            message = err.message;
// //         }
// //         setError(message);
// //         setUsers([]); // Clear users on error
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     // Only fetch if we have permissions loaded (or immediately if no check needed)
// //     // This prevents fetching if the initial permission check fails quickly
// //     if (currentUserPermissions.length > 0 || !localStorage.getItem('permissions')) {
// //         fetchUsers();
// //     }

// //   }, [currentUserPermissions, router]); // Re-run if permissions change (though unlikely here)

// //   // --- Delete Handler ---
// //   const handleDeleteUser = useCallback(async (userId: string) => {
// //     // Double-check permission just before the action (belt-and-suspenders)
// //     if (!currentUserPermissions.includes('DELETE_USER')) {
// //       alert('You do not have permission to delete users.');
// //       return;
// //     }

// //     // Confirmation dialog
// //     if (!window.confirm(`Are you sure you want to delete user ID: ${userId}? This action cannot be undone.`)) {
// //       return;
// //     }

// //     try {
// //       setLoading(true); // Indicate activity
// //       // Use the correct endpoint from userRoutes.js
// //       await api.delete(`/user/delete/${userId}`);

// //       // Refresh the list by filtering out the deleted user
// //       setUsers(currentUsers => currentUsers.filter(user => user.id !== userId));
// //       // Consider showing a success toast/message instead of alert
// //       // alert('User deleted successfully.');

// //     } catch (err: unknown) {
// //       console.error('Failed to delete user:', err);
// //       let message = 'Failed to delete user.';
// //        if (typeof err === 'object' && err !== null && 'response' in err) {
// //            const axiosError = err as { response?: { data?: { message?: string } } };
// //            message = axiosError.response?.data?.message || 'Failed to delete user due to a server error.';
// //         } else if (err instanceof Error) {
// //            message = err.message;
// //         }
// //       // Show error toast/message or update error state
// //       setError(`Error deleting user: ${message}`); // Set error state to display it
// //       // alert(`Error deleting user: ${message}`); // Or use alert for simplicity
// //     } finally {
// //         setLoading(false);
// //     }
// //   }, [currentUserPermissions]); // Dependency: permissions array

// //   // --- Render Logic ---

// //   // Initial loading state
// //   if (loading && users.length === 0) { // Show loading only initially or during delete
// //     return <div className="p-6 text-center">Loading users...</div>;
// //   }

// //   // Error state display
// //   if (error && !loading) { // Show error only if not currently loading something else
// //     return <div className="p-6 text-center text-red-600 bg-red-100 border border-red-400 rounded">Error: {error}</div>;
// //   }

// //   // Main content render
// //   return (
// //     <div className="p-4 md:p-6">
// //       {/* Page Header */}
// //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
// //         <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>
// //         {/* Conditionally render "Add New User" button based on permission */}
// //         {currentUserPermissions.includes('CREATE_USER') && (
// //           <Link href="/dashboard/users/new" legacyBehavior>
// //             <a className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out whitespace-nowrap">
// //               + Add New User
// //             </a>
// //           </Link>
// //         )}
// //       </div>

// //        {/* Display Loading overlay during delete operation */}
// //        {loading && <div className="text-center p-4">Processing...</div>}

// //       {/* User Table */}
// //       {!loading && users.length === 0 && !error && (
// //          <div className="text-center p-6 bg-gray-50 rounded-lg shadow">
// //             <p className="text-gray-500">No users found.</p>
// //             {currentUserPermissions.includes('CREATE_USER') && (
// //                <p className="mt-2 text-sm">Click Add New User to get started.</p>
// //             )}
// //          </div>
// //       )}

// //       {!loading && users.length > 0 && (
// //         <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
// //           <table className="min-w-full bg-white divide-y divide-gray-200">
// //             <thead className="bg-gray-50">
// //               <tr>
// //                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
// //                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
// //                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
// //                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
// //                 <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
// //               </tr>
// //             </thead>
// //             <tbody className="bg-white divide-y divide-gray-200">
// //               {users.map((user) => (
// //                 <tr key={user.id} className="hover:bg-gray-50">
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
// //                     {/* Display roles nicely, handle case where roles might be undefined/empty */}
// //                     {user.roles && user.roles.length > 0
// //                       ? user.roles.map(role => role.name).join(', ')
// //                       : <span className="text-gray-400 italic">No roles</span>}
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
// //                     {/* Format date nicely */}
// //                     {new Date(user.createdAt).toLocaleDateString()}
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
// //                     {/* Conditionally render "Edit" button */}
// //                     {currentUserPermissions.includes('UPDATE_USER') && (
// //                       <Link href={`/dashboard/users/${user.id}/edit`} legacyBehavior>
// //                          <a className="text-indigo-600 hover:text-indigo-800 transition duration-150 ease-in-out">
// //                            Edit
// //                          </a>
// //                       </Link>
// //                     )}
// //                     {/* Conditionally render "Delete" button */}
// //                     {currentUserPermissions.includes('DELETE_USER') && (
// //                       <button
// //                         onClick={() => handleDeleteUser(user.id)}
// //                         className="text-red-600 hover:text-red-800 transition duration-150 ease-in-out disabled:opacity-50"
// //                         disabled={loading} // Disable button while any loading is happening
// //                       >
// //                         Delete
// //                       </button>
// //                     )}
// //                     {/* Show if no actions are available */}
// //                     {!currentUserPermissions.includes('UPDATE_USER') && !currentUserPermissions.includes('DELETE_USER') && (
// //                         <span className="text-gray-400 italic text-xs">No actions</span>
// //                     )}
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// ===============================================================================================================

// src/app/dashboard/users/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/utils/api'; // Adjust import path for your api utility
import Link from 'next/link'; // For navigation links
import { useRouter } from 'next/navigation'; // To potentially redirect on error

// --- Define TypeScript Interfaces ---
interface Role {
  id: string;
  name: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  roles?: Role[];
  createdAt: string;
}

interface GetUsersApiResponse {
  users: User[];
}

// --- Component Definition ---

export default function ManageUsersPage() {
  // --- State Variables ---
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Start loading initially
  const [error, setError] = useState<string | null>(null);
  const [currentUserPermissions, setCurrentUserPermissions] = useState<string[]>([]);
  const router = useRouter();

  // --- Permission Check Effect ---
  useEffect(() => {
    console.log('[Permissions Effect] Running...');
    try {
      const storedPermissions = localStorage.getItem('permissions');
      if (storedPermissions) {
        const parsedPermissions = JSON.parse(storedPermissions);
        if (Array.isArray(parsedPermissions)) {
          console.log('[Permissions Effect] Permissions loaded:', parsedPermissions);
          setCurrentUserPermissions(parsedPermissions);
        } else {
          console.warn('[Permissions Effect] Stored permissions were not an array:', parsedPermissions);
          setCurrentUserPermissions([]);
        }
      } else {
        console.log('[Permissions Effect] No permissions found in localStorage.');
        setCurrentUserPermissions([]);
      }
    } catch (parseError) {
      console.error('[Permissions Effect] Failed to parse permissions:', parseError);
      setCurrentUserPermissions([]);
      setError('Could not load user permissions.');
    }
  }, []);

  // --- Data Fetching Effect ---
  useEffect(() => {
    console.log('[Data Fetch Effect] Running. Current Permissions:', currentUserPermissions);

    // Function to fetch users
    const fetchUsers = async () => {
      console.log('[Data Fetch Effect] Starting fetchUsers function...');
      setLoading(true); // Ensure loading is true when fetch starts
      setError(null);
      try {
        console.log('[Data Fetch Effect] Calling API: /user/list');
        const response = await api.get<GetUsersApiResponse>('/user/list');
        console.log('[Data Fetch Effect] API response received:', response.data);
        setUsers(response.data.users || []);
      } catch (err: unknown) {
        console.error('[Data Fetch Effect] Failed to fetch users API error:', err);
        let message = 'Could not load users.';
        if (typeof err === 'object' && err !== null && 'response' in err) {
           const axiosError = err as { response?: { data?: { message?: string }, status?: number } };
           if (axiosError.response?.status === 403) {
             message = 'Forbidden: You do not have permission to view users.';
           } else {
             message = axiosError.response?.data?.message || 'Failed to fetch users due to server error.';
           }
        } else if (err instanceof Error) {
           message = err.message;
        }
        setError(message);
        setUsers([]);
      } finally {
        console.log('[Data Fetch Effect] Setting loading to false in finally block.');
        setLoading(false); // Crucial: Always set loading false after attempt
      }
    };

    // Check permissions *before* deciding to fetch
    // Note: This assumes permissions *must* be loaded before fetching.
    // If permissions are loaded asynchronously, this check might run before they are ready.
    // Consider adding a state like `permissionsLoaded` if needed.
    const hasPermission = currentUserPermissions.includes('READ_USERS');
    const hasCheckedPermissions = localStorage.getItem('permissions') !== null; // Check if localStorage has been read

    console.log(`[Data Fetch Effect] Has READ_USERS permission: ${hasPermission}`);
    console.log(`[Data Fetch Effect] Has checked localStorage for permissions: ${hasCheckedPermissions}`);


    // Only proceed if permissions allow OR if there were no permissions set at all (e.g., public page - adjust if needed)
    if (hasPermission) {
        console.log('[Data Fetch Effect] Permission granted. Calling fetchUsers.');
        fetchUsers();
    } else if (hasCheckedPermissions) {
        // Only set error if we've actually checked permissions and they are missing
        console.log('[Data Fetch Effect] Permission denied. Setting error and stopping loading.');
        setError('You do not have permission to view users.');
        setLoading(false); // *** Important: Set loading false if permission denied ***
    } else {
        // Still waiting for permissions to load from the first effect?
        // Or maybe no permissions were ever stored.
        // If the page should *never* load without permissions, this might be an error state.
        // If it *could* load without specific permissions, adjust logic.
        console.log('[Data Fetch Effect] Waiting for permissions or no permissions required/found.');
        // Decide if loading should stop here if permissions are strictly required but not found
        // setLoading(false); // Uncomment this if loading should stop if permissions check is inconclusive
    }

  }, [currentUserPermissions, router]); // Dependency array

  // --- Delete Handler ---
  const handleDeleteUser = useCallback(async (userId: string) => {
    if (!currentUserPermissions.includes('DELETE_USER')) {
      alert('You do not have permission to delete users.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete user ID: ${userId}? This action cannot be undone.`)) {
      return;
    }
    // Keep track of loading state during delete
    const previousLoading = loading;
    setLoading(true);
    try {
      await api.delete(`/user/delete/${userId}`);
      setUsers(currentUsers => currentUsers.filter(user => user.id !== userId));
    } catch (err: unknown) {
      console.error('Failed to delete user:', err);
      let message = 'Failed to delete user.';
       if (typeof err === 'object' && err !== null && 'response' in err) {
           const axiosError = err as { response?: { data?: { message?: string } } };
           message = axiosError.response?.data?.message || 'Failed to delete user due to a server error.';
        } else if (err instanceof Error) {
           message = err.message;
        }
      setError(`Error deleting user: ${message}`);
    } finally {
        setLoading(previousLoading); // Restore previous loading state or set explicitly false
    }
  }, [currentUserPermissions, loading]); // Added loading to dependencies

  // --- Render Logic ---

  // Show loading indicator more consistently
  if (loading) {
    return <div className="p-6 text-center">Loading users...</div>;
  }

  // Show error if loading is finished and error exists
  if (error) {
    return <div className="p-6 text-center text-red-600 bg-red-100 border border-red-400 rounded">Error: {error}</div>;
  }

  // Main content render (only if not loading and no error)
  return (
    <div className="p-4 md:p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>
        {currentUserPermissions.includes('CREATE_USER') && (
          <Link href="/dashboard/users/new" legacyBehavior>
            <a className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out whitespace-nowrap">
              + Add New User
            </a>
          </Link>
        )}
      </div>

      {/* User Table */}
      {users.length === 0 ? (
         <div className="text-center p-6 bg-gray-50 rounded-lg shadow">
            <p className="text-gray-500">No users found.</p>
            {currentUserPermissions.includes('CREATE_USER') && (
               <p className="mt-2 text-sm">Click Add New User to get started.</p>
            )}
         </div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.roles && user.roles.length > 0
                      ? user.roles.map(role => role.name).join(', ')
                      : <span className="text-gray-400 italic">No roles</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    {currentUserPermissions.includes('UPDATE_USER') && (
                      <Link href={`/dashboard/users/${user.id}/edit`} legacyBehavior>
                         <a className="text-indigo-600 hover:text-indigo-800 transition duration-150 ease-in-out">
                           Edit
                         </a>
                      </Link>
                    )}
                    {currentUserPermissions.includes('DELETE_USER') && (
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-800 transition duration-150 ease-in-out disabled:opacity-50"
                        // Disable button only if the delete action itself is loading
                        // disabled={loading} // Re-evaluate if needed, maybe a specific deleteLoading state?
                      >
                        Delete
                      </button>
                    )}
                    {!currentUserPermissions.includes('UPDATE_USER') && !currentUserPermissions.includes('DELETE_USER') && (
                        <span className="text-gray-400 italic text-xs">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
