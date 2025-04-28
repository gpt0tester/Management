// src/app/dashboard/permissions/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/utils/api'; // Adjust import path for your api utility
import Link from 'next/link'; // For navigation links
import { useRouter } from 'next/navigation'; // To potentially redirect on error

// --- Define TypeScript Interfaces ---
// Interface for Permission data from the /api/user/permission/list endpoint
interface Permission {
  id: string; // Or number
  name: string; // Often the key used in code (e.g., 'READ_USERS')
  description?: string; // User-friendly description
  createdAt?: string; // Optional: If your API returns it
  // Add any other relevant permission fields returned by your API
}

// Interface for the expected structure of the API response for fetching permissions
interface GetPermissionsApiResponse {
  permissions: Permission[];
  // Include other potential response fields if applicable
}

// --- Component Definition ---

export default function ManagePermissionsPage() {
  // --- State Variables ---
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Start loading initially
  const [error, setError] = useState<string | null>(null);
  const [currentUserPermissions, setCurrentUserPermissions] = useState<string[]>([]);
  const router = useRouter(); // For potential redirects

  // --- Permission Check Effect (for the current user) ---
  // Runs once on mount to load the viewing user's permissions from localStorage
  useEffect(() => {
    console.log('[User Permissions Effect] Running...');
    try {
      const storedPermissions = localStorage.getItem('permissions');
      if (storedPermissions) {
        const parsedPermissions = JSON.parse(storedPermissions);
        if (Array.isArray(parsedPermissions)) {
          console.log('[User Permissions Effect] Permissions loaded:', parsedPermissions);
          setCurrentUserPermissions(parsedPermissions);
        } else {
          console.warn('[User Permissions Effect] Stored permissions were not an array:', parsedPermissions);
          setCurrentUserPermissions([]);
        }
      } else {
        console.log('[User Permissions Effect] No permissions found in localStorage.');
        setCurrentUserPermissions([]);
      }
    } catch (parseError) {
      console.error('[User Permissions Effect] Failed to parse permissions:', parseError);
      setCurrentUserPermissions([]);
      setError('Could not load your permissions.'); // Error related to the viewing user's permissions
    }
  }, []); // Empty dependency array ensures this runs only once

  // --- Data Fetching Effect (for the list of all Permissions) ---
  // Runs after the viewing user's permissions are loaded
  useEffect(() => {
    console.log('[Permissions Data Fetch Effect] Running. Current User Permissions:', currentUserPermissions);

    // Function to fetch the list of all permissions
    const fetchPermissionsList = async () => {
      console.log('[Permissions Data Fetch Effect] Starting fetchPermissionsList function...');
      setLoading(true); // Ensure loading is true when fetch starts
      setError(null);
      try {
        console.log('[Permissions Data Fetch Effect] Calling API: /user/permission/list');
        // Use the correct endpoint from userRoutes.js
        const response = await api.get<GetPermissionsApiResponse>('/user/permission/list');
        console.log('[Permissions Data Fetch Effect] API response received:', response.data);
        setPermissions(response.data.permissions || []);
      } catch (err: unknown) {
        console.error('[Permissions Data Fetch Effect] Failed to fetch permissions list API error:', err);
        let message = 'Could not load permissions list.';
        // Use the improved error handling with type checking
        if (typeof err === 'object' && err !== null && 'response' in err) {
           const axiosError = err as { response?: { data?: { message?: string }, status?: number } };
           if (axiosError.response?.status === 403) {
             message = 'Forbidden: You do not have permission to view the permissions list.';
           } else {
             message = axiosError.response?.data?.message || 'Failed to fetch permissions list due to server error.';
           }
        } else if (err instanceof Error) {
           message = err.message;
        }
        setError(message);
        setPermissions([]);
      } finally {
        console.log('[Permissions Data Fetch Effect] Setting loading to false in finally block.');
        setLoading(false); // Crucial: Always set loading false after attempt
      }
    };

    // Check if the current user has permission to view the list *before* deciding to fetch
    const hasPermission = currentUserPermissions.includes('READ_PERMISSIONS');
    const hasCheckedPermissions = localStorage.getItem('permissions') !== null; // Check if localStorage has been read at least once

    console.log(`[Permissions Data Fetch Effect] Has READ_PERMISSIONS permission: ${hasPermission}`);
    console.log(`[Permissions Data Fetch Effect] Has checked localStorage for permissions: ${hasCheckedPermissions}`);

    if (hasPermission) {
        console.log('[Permissions Data Fetch Effect] Permission granted. Calling fetchPermissionsList.');
        fetchPermissionsList();
    } else if (hasCheckedPermissions) {
        // Only set error if we've actually checked permissions and they are missing
        console.log('[Permissions Data Fetch Effect] Permission denied. Setting error and stopping loading.');
        setError('You do not have permission to view permissions.');
        setLoading(false); // Important: Set loading false if permission denied
    } else {
        // This case might occur if the first effect hasn't finished yet.
        // If permissions are strictly required, we might need to wait or handle this state.
        console.log('[Permissions Data Fetch Effect] Waiting for user permissions or no permissions required/found.');
        // Consider if loading should stop here if permissions are strictly required but not yet loaded/found
        // setLoading(false);
    }

  }, [currentUserPermissions, router]); // Dependency array

  // --- Delete Handler ---
  const handleDeletePermission = useCallback(async (permissionId: string) => {
    // Double-check permission
    if (!currentUserPermissions.includes('DELETE_PERMISSION')) {
      alert('You do not have permission to delete permissions.');
      return;
    }

    // Confirmation dialog
    if (!window.confirm(`Are you sure you want to delete permission ID: ${permissionId}? This could affect roles and user access.`)) {
      return;
    }

    // Keep track of loading state during delete
    const previousLoading = loading;
    setLoading(true);
    setError(null);

    try {
      console.log(`[Permission Delete] Calling API: /user/permission/delete/${permissionId}`);
      // Use the correct endpoint from userRoutes.js
      await api.delete(`/user/permission/delete/${permissionId}`);
      console.log(`[Permission Delete] Permission ${permissionId} deleted successfully.`);

      // Refresh the list by filtering out the deleted permission
      setPermissions(currentPermissions => currentPermissions.filter(perm => perm.id !== permissionId));
      // Consider showing a success toast/message

    } catch (err: unknown) {
      console.error('[Permission Delete] Failed to delete permission:', err);
      let message = 'Failed to delete permission.';
       if (typeof err === 'object' && err !== null && 'response' in err) {
           const axiosError = err as { response?: { data?: { message?: string } } };
           message = axiosError.response?.data?.message || 'Failed to delete permission due to a server error.';
        } else if (err instanceof Error) {
           message = err.message;
        }
      // Show error toast/message or update error state
      setError(`Error deleting permission: ${message}`);
    } finally {
        console.log('[Permission Delete] Setting loading back after delete attempt.');
        setLoading(previousLoading); // Restore previous loading state
    }
  }, [currentUserPermissions, loading]);

  // --- Render Logic ---

  // Show loading indicator
  if (loading) {
    return <div className="p-6 text-center">Loading permissions...</div>;
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
        <h1 className="text-2xl font-bold text-gray-800">Manage Permissions</h1>
        {/* Conditionally render "Add New Permission" button based on permission */}
        {currentUserPermissions.includes('CREATE_PERMISSION') && (
          <Link href="/dashboard/permissions/new" legacyBehavior>
            <a className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out whitespace-nowrap">
              + Add New Permission
            </a>
          </Link>
        )}
      </div>

      {/* Permissions Table */}
      {permissions.length === 0 ? (
         <div className="text-center p-6 bg-gray-50 rounded-lg shadow">
            <p className="text-gray-500">No permissions found.</p>
            {currentUserPermissions.includes('CREATE_PERMISSION') && (
               <p className="mt-2 text-sm">Click Add New Permission if needed (often managed by developers).</p>
            )}
         </div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permission Key (Name)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                {/* Add CreatedAt if available and relevant */}
                {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th> */}
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {permissions.map((permission) => (
                <tr key={permission.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-mono">{permission.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{permission.description || <span className="text-gray-400 italic">No description</span>}</td>
                  {/* Add CreatedAt cell if needed */}
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {permission.createdAt ? new Date(permission.createdAt).toLocaleDateString() : 'N/A'}
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    {/* Conditionally render "Edit" button */}
                    {currentUserPermissions.includes('UPDATE_PERMISSION') && (
                      <Link href={`/dashboard/permissions/${permission.id}/edit`} legacyBehavior>
                         <a className="text-indigo-600 hover:text-indigo-800 transition duration-150 ease-in-out">
                           Edit
                         </a>
                      </Link>
                    )}
                    {/* Conditionally render "Delete" button */}
                    {currentUserPermissions.includes('DELETE_PERMISSION') && (
                      <button
                        onClick={() => handleDeletePermission(permission.id)}
                        className="text-red-600 hover:text-red-800 transition duration-150 ease-in-out disabled:opacity-50"
                        // Consider specific loading state if needed
                      >
                        Delete
                      </button>
                    )}
                    {/* Show if no actions are available */}
                    {!currentUserPermissions.includes('UPDATE_PERMISSION') && !currentUserPermissions.includes('DELETE_PERMISSION') && (
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
