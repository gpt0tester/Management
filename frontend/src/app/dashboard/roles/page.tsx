// src/app/dashboard/roles/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/utils/api'; // Adjust import path for your api utility
import Link from 'next/link'; // For navigation links
import { useRouter } from 'next/navigation'; // To potentially redirect on error

// --- Define TypeScript Interfaces ---
// These should match the structure of the data returned by your backend API

// Interface for Permission data (might be needed if showing associated permissions)
interface Permission {
  id: string; // Or number
  name: string;
  description?: string;
}

// Interface for Role data from the /api/user/role/list endpoint
interface Role {
  id: string; // Or number
  name: string;
  description?: string; // Optional description field
  permissions?: Permission[]; // Permissions might be included directly
  createdAt: string; // Assuming ISO date string
  // Add any other relevant role fields returned by your API
}

// Interface for the expected structure of the API response for fetching roles
interface GetRolesApiResponse {
  roles: Role[];
  // Include other potential response fields like pagination info if applicable
}

// --- Component Definition ---

export default function ManageRolesPage() {
  // --- State Variables ---
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Start loading initially
  const [error, setError] = useState<string | null>(null);
  const [currentUserPermissions, setCurrentUserPermissions] = useState<string[]>([]);
  const router = useRouter(); // For potential redirects

  // --- Permission Check Effect ---
  // Runs once on mount to load permissions from localStorage
  useEffect(() => {
    console.log('[Role Permissions Effect] Running...');
    try {
      const storedPermissions = localStorage.getItem('permissions');
      if (storedPermissions) {
        const parsedPermissions = JSON.parse(storedPermissions);
        if (Array.isArray(parsedPermissions)) {
          console.log('[Role Permissions Effect] Permissions loaded:', parsedPermissions);
          setCurrentUserPermissions(parsedPermissions);
        } else {
          console.warn('[Role Permissions Effect] Stored permissions were not an array:', parsedPermissions);
          setCurrentUserPermissions([]);
        }
      } else {
        console.log('[Role Permissions Effect] No permissions found in localStorage.');
        setCurrentUserPermissions([]);
      }
    } catch (parseError) {
      console.error('[Role Permissions Effect] Failed to parse permissions:', parseError);
      setCurrentUserPermissions([]);
      setError('Could not load user permissions.'); // Optionally set an error
    }
  }, []); // Empty dependency array ensures this runs only once

  // --- Data Fetching Effect ---
  // Runs after permissions are loaded
  useEffect(() => {
    console.log('[Role Data Fetch Effect] Running. Current Permissions:', currentUserPermissions);

    // Function to fetch roles
    const fetchRoles = async () => {
      console.log('[Role Data Fetch Effect] Starting fetchRoles function...');
      setLoading(true); // Ensure loading is true when fetch starts
      setError(null);
      try {
        console.log('[Role Data Fetch Effect] Calling API: /user/role/list');
        // Use the correct endpoint from userRoutes.js
        const response = await api.get<GetRolesApiResponse>('/user/role/list');
        console.log('[Role Data Fetch Effect] API response received:', response.data);
        setRoles(response.data.roles || []);
      } catch (err: unknown) {
        console.error('[Role Data Fetch Effect] Failed to fetch roles API error:', err);
        let message = 'Could not load roles.';
        // Use the improved error handling with type checking
        if (typeof err === 'object' && err !== null && 'response' in err) {
           const axiosError = err as { response?: { data?: { message?: string }, status?: number } };
           if (axiosError.response?.status === 403) {
             message = 'Forbidden: You do not have permission to view roles.';
           } else {
             message = axiosError.response?.data?.message || 'Failed to fetch roles due to server error.';
           }
        } else if (err instanceof Error) {
           message = err.message;
        }
        setError(message);
        setRoles([]);
      } finally {
        console.log('[Role Data Fetch Effect] Setting loading to false in finally block.');
        setLoading(false); // Crucial: Always set loading false after attempt
      }
    };

    // Check permissions *before* deciding to fetch
    const hasPermission = currentUserPermissions.includes('READ_ROLES');
    const hasCheckedPermissions = localStorage.getItem('permissions') !== null;

    console.log(`[Role Data Fetch Effect] Has READ_ROLES permission: ${hasPermission}`);
    console.log(`[Role Data Fetch Effect] Has checked localStorage for permissions: ${hasCheckedPermissions}`);

    if (hasPermission) {
        console.log('[Role Data Fetch Effect] Permission granted. Calling fetchRoles.');
        fetchRoles();
    } else if (hasCheckedPermissions) {
        // Only set error if we've actually checked permissions and they are missing
        console.log('[Role Data Fetch Effect] Permission denied. Setting error and stopping loading.');
        setError('You do not have permission to view roles.');
        setLoading(false); // Important: Set loading false if permission denied
    } else {
        console.log('[Role Data Fetch Effect] Waiting for permissions or no permissions required/found.');
        // Decide if loading should stop here if permissions are strictly required but not found
        // setLoading(false);
    }

  }, [currentUserPermissions, router]); // Dependency array

  // --- Delete Handler ---
  const handleDeleteRole = useCallback(async (roleId: string) => {
    // Double-check permission
    if (!currentUserPermissions.includes('DELETE_ROLE')) {
      alert('You do not have permission to delete roles.');
      return;
    }

    // Confirmation dialog
    if (!window.confirm(`Are you sure you want to delete role ID: ${roleId}? This may affect users assigned to this role.`)) {
      return;
    }

    // Keep track of loading state during delete
    const previousLoading = loading; // Store current loading state
    setLoading(true); // Set loading to true for the delete operation
    setError(null); // Clear previous errors specific to delete

    try {
      console.log(`[Role Delete] Calling API: /user/role/delete/${roleId}`);
      // Use the correct endpoint from userRoutes.js
      await api.delete(`/user/role/delete/${roleId}`);
      console.log(`[Role Delete] Role ${roleId} deleted successfully.`);

      // Refresh the list by filtering out the deleted role
      setRoles(currentRoles => currentRoles.filter(role => role.id !== roleId));
      // Consider showing a success toast/message

    } catch (err: unknown) {
      console.error('[Role Delete] Failed to delete role:', err);
      let message = 'Failed to delete role.';
       if (typeof err === 'object' && err !== null && 'response' in err) {
           const axiosError = err as { response?: { data?: { message?: string } } };
           message = axiosError.response?.data?.message || 'Failed to delete role due to a server error.';
        } else if (err instanceof Error) {
           message = err.message;
        }
      // Show error toast/message or update error state
      setError(`Error deleting role: ${message}`); // Set main error state
    } finally {
        console.log('[Role Delete] Setting loading back after delete attempt.');
        setLoading(previousLoading); // Restore previous loading state
    }
  }, [currentUserPermissions, loading]); // Include loading in dependencies if needed

  // --- Render Logic ---

  // Show loading indicator
  if (loading) {
    return <div className="p-6 text-center">Loading roles...</div>;
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
        <h1 className="text-2xl font-bold text-gray-800">Manage Roles</h1>
        {/* Conditionally render "Add New Role" button based on permission */}
        {currentUserPermissions.includes('CREATE_ROLE') && (
          <Link href="/dashboard/roles/new" legacyBehavior>
            <a className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out whitespace-nowrap">
              + Add New Role
            </a>
          </Link>
        )}
      </div>

      {/* Role Table */}
      {roles.length === 0 ? (
         <div className="text-center p-6 bg-gray-50 rounded-lg shadow">
            <p className="text-gray-500">No roles found.</p>
            {currentUserPermissions.includes('CREATE_ROLE') && (
               <p className="mt-2 text-sm">Click Add New Role to get started.</p>
            )}
         </div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{role.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={role.description}>{role.description || <span className="text-gray-400 italic">N/A</span>}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {/* Display permissions nicely, handle case where permissions might be undefined/empty */}
                    {/* This might need adjustment based on how permissions are returned */}
                    {role.permissions && role.permissions.length > 0
                      ? `${role.permissions.length} permission(s)` // Or list them if few: role.permissions.map(p => p.name).join(', ')
                      : <span className="text-gray-400 italic">No permissions</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {/* Format date nicely */}
                    {new Date(role.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    {/* Conditionally render "Edit" button */}
                    {currentUserPermissions.includes('UPDATE_ROLE') && (
                      <Link href={`/dashboard/roles/${role.id}/edit`} legacyBehavior>
                         <a className="text-indigo-600 hover:text-indigo-800 transition duration-150 ease-in-out">
                           Edit
                         </a>
                      </Link>
                    )}
                    {/* Conditionally render "Delete" button */}
                    {currentUserPermissions.includes('DELETE_ROLE') && (
                      <button
                        onClick={() => handleDeleteRole(role.id)}
                        className="text-red-600 hover:text-red-800 transition duration-150 ease-in-out disabled:opacity-50"
                        // Disable button only if the delete action itself is loading?
                        // Consider a specific 'deletingRoleId' state if needed
                      >
                        Delete
                      </button>
                    )}
                    {/* Show if no actions are available */}
                    {!currentUserPermissions.includes('UPDATE_ROLE') && !currentUserPermissions.includes('DELETE_ROLE') && (
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
