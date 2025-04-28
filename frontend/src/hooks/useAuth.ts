// // 'use client';

// // import { useState } from 'react';
// // import api from '../utils/api';
// // import { useRouter } from 'next/navigation';

// // export function useAuth() {
// //   const [error, setError] = useState<string | null>(null);
// //   const router = useRouter();

// //   const login = async (email: string, password: string) => {
// //     try {
// //       const { data } = await api.post('/login', { email, password });
// //       localStorage.setItem('token', data.token);
// //       router.push('/dashboard');
// //     } catch {
// //       setError('Invalid credentials');
// //     }
// //   };

// //   const register = async (email: string,username: string, password: string) => {
// //     try {
// //       await api.post('/register', { email, username, password });
// //       router.push('/');
// //     } catch {
// //       setError('Registration failed');
// //     }
// //   };

// //   const logout = () => {
// //     localStorage.removeItem('token');
// //     router.push('/');
// //   };

// //   return { login, register, logout, error };
// // }

// // ===========================================================================

// // src/hooks/useAuth.ts
// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import api from '../utils/api'; // Assuming your Axios instance is configured here

// // Define the expected structure of the decoded JWT payload
// interface DecodedToken {
//   permissions?: string[]; // Assuming permissions are an array of strings
//   exp?: number; // Expiration time (standard JWT claim)
//   iat?: number; // Issued at time (standard JWT claim)
//   sub?: string; // Subject (standard JWT claim, often user ID)
//   // Add any other fields you expect in your JWT payload
//   // [key: string]: any; // Allow other potential fields
// }

// // Define the expected response structure from the login endpoint
// interface LoginResponse {
//   token: string;
// }

// // Define the structure of the values returned by the hook
// interface UseAuthReturn {
//   login: (email: string, password: string) => Promise<void>;
//   // Add register and logout if needed, similar to your previous hook
//   // register: (email: string, username: string, password: string) => Promise<void>;
//   // logout: () => void;
//   error: string | null;
//   loading: boolean;
//   decodeToken: (token: string) => DecodedToken | null; // Expose decoder if needed elsewhere
// }

// export function useAuth(): UseAuthReturn {
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const router = useRouter();

//   /**
//    * Decodes a JWT token string.
//    * Note: This only decodes the payload, it DOES NOT verify the signature.
//    * Verification should always happen server-side.
//    * Consider using a library like 'jwt-decode' for a more robust solution.
//    * @param token - The JWT token string.
//    * @returns The decoded payload object or null if decoding fails.
//    */
//   const decodeToken = (token: string): DecodedToken | null => {
//     try {
//       const base64Url = token.split('.')[1];
//       if (!base64Url) {
//         throw new Error('Invalid JWT token format');
//       }
//       const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//       const jsonPayload = decodeURIComponent(
//         atob(base64)
//           .split('')
//           .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
//           .join('')
//       );

//       return JSON.parse(jsonPayload) as DecodedToken;
//     } catch (error) {
//       console.error('Failed to decode token:', error);
//       setError('Failed to process token.'); // Set an error state
//       return null;
//     }
//   };

//   /**
//    * Attempts to log in the user with the provided credentials.
//    * Stores the token and permissions on success and redirects.
//    * @param email - User's email.
//    * @param password - User's password.
//    */
//   const login = async (email: string, password: string): Promise<void> => {
//     setError(null); // Clear previous errors
//     setLoading(true);
//     try {
//       // Use the generic type for the response data
//       const response = await api.post<LoginResponse>('/login', {
//         email,
//         password,
//       });

//       const token = response.data.token;
//       localStorage.setItem('token', token); // Save token

//       // Decode the token to get payload data like permissions
//       const decodedToken = decodeToken(token);
//       console.log('Decoded Token:', decodedToken); // For debugging

//       if (decodedToken) {
//         const userPermissions = decodedToken?.permissions || [];
//         console.log('Extracted Permissions:', userPermissions); // For debugging

//         // Ensure it's an array before storing
//         if (Array.isArray(userPermissions)) {
//           localStorage.setItem('permissions', JSON.stringify(userPermissions));
//         } else {
//           console.warn('Permissions field in token was not an array:', userPermissions);
//           localStorage.removeItem('permissions'); // Clear potentially invalid stored permissions
//         }
//         // Redirect to dashboard/home page after successful login and token processing
//         router.push('/dashboard'); // Or '/dashboard' - match your desired route
//       } else {
//         // Handle case where decoding failed but API call succeeded (should be rare)
//         setError('Login succeeded but failed to process token.');
//         localStorage.removeItem('token'); // Clean up inconsistent state
//       }

//     } catch (err: unknown) { // <--- Use unknown instead of any
//       console.error('Login failed:', err);
//       let message = 'An unexpected error occurred.'; // Default error message

//       // Type Check: Check if it's an error object with expected properties
//       // (This example assumes you're using Axios which adds a 'response' property on HTTP errors)
//       if (typeof err === 'object' && err !== null && 'response' in err) {
//         // We assume err might have a response structure like Axios errors
//         const axiosError = err as { response?: { data?: { message?: string } } };
//         message = axiosError.response?.data?.message || 'Invalid credentials or server error.';
//       } else if (err instanceof Error) {
//         // Check if it's a standard JavaScript Error object
//         message = err.message;
//       } else {
//         // Fallback for other types of thrown values (e.g., string)
//         message = String(err);
//       }

//       setError(message);
//       // Ensure token/permissions are cleared on login failure
//       localStorage.removeItem('token');
//       localStorage.removeItem('permissions');
//     } finally {
//       setLoading(false); // Ensure loading is turned off
//     }
//   };

//   // --- You can add register and logout functions here based on your previous hook ---
//   /*
//   const register = async (email: string, username: string, password: string): Promise<void> => {
//     // ... implementation similar to login, calling api.post('/register', ...)
//   };

//   const logout = (): void => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('permissions'); // Remove permissions too
//     router.push('/'); // Redirect to login page
//   };
//   */

//   // Return the state and actions
//   return {
//     login,
//     // register, // Uncomment if added
//     // logout,   // Uncomment if added
//     error,
//     loading,
//     decodeToken, // Expose the decoder function if needed by components
//   };
// }

// =================================================================================================

// src/hooks/useAuth.ts
'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '../utils/api'; // Your configured Axios instance

// --- Interfaces ---

// Interface for the response from the /api/auth/login endpoint
interface LoginResponse {
  token: string;
  message?: string; // Optional message
}

// Interface for Permission data (nested within Role)
interface Permission {
  _id: string;
  name: string; // The crucial permission string (e.g., 'READ_USERS')
  description?: string;
}

// Interface for Role data (nested within UserProfile)
interface Role {
  _id: string;
  name: string;
  permissions?: Permission[]; // Permissions populated by backend
}

// Interface for the user profile data expected from /api/user/me
interface UserProfile {
  _id: string;
  username: string;
  email: string;
  roles?: Role[]; // Roles should be populated with permissions
  // Add other relevant fields from your User model if needed
}

// Interface for the values returned by the hook
interface UseAuthReturn {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  // register: (/*...args*/) => Promise<void>; // Add back if needed
  error: string | null;
  loading: boolean;
  // Optional: Expose user profile state if needed globally
  // userProfile: UserProfile | null;
}

export function useAuth(): UseAuthReturn {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // Optional: Store user profile in state if needed elsewhere in the app
  // const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const router = useRouter();

  /**
   * Clears authentication data from storage and state.
   */
  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('permissions');
    // Clear user profile state if you added it
    // setUserProfile(null);
    // Reset the Axios instance authorization header if necessary
    // (This might be handled by an interceptor that reads from localStorage)
    // delete api.defaults.headers.common['Authorization'];
    console.log('Auth data cleared.');
  };

  /**
   * Fetches the user profile and permissions after login.
   * Assumes the token is already set in localStorage or Axios headers.
   * @returns {Promise<string[]>} A promise that resolves with the user's permission names.
   * @throws If fetching or processing fails.
   */
  const fetchProfileAndPermissions = async (): Promise<string[]> => {
    console.log('Fetching user profile...');
    // Ensure your `api` utility automatically includes the token from localStorage
    const response = await api.get<UserProfile>('/user/me'); // <--- ASSUMED ENDPOINT
    const profile = response.data;

    if (!profile || !profile.roles) {
      console.error('Profile data or roles missing in response:', profile);
      throw new Error('Failed to retrieve complete user profile.');
    }

    // Extract permission names from the populated roles
    const permissionsSet = new Set<string>();
    profile.roles.forEach((role) => {
      role.permissions?.forEach((perm) => {
        if (perm.name) {
          permissionsSet.add(perm.name);
        }
      });
    });

    const permissionsArray = Array.from(permissionsSet);
    console.log('User permissions extracted:', permissionsArray);
    return permissionsArray;
  };

  /**
   * Logs the user in, fetches their profile/permissions, stores data, and redirects.
   */
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setError(null);
    setLoading(true);
    let token: string | null = null; // Keep track of token locally

    try {
      // --- Step 1: Login to get the token ---
      console.log('Attempting login...');
      const loginResponse = await api.post<LoginResponse>('/auth/login', {
        email,
        password,
      });

      token = loginResponse.data.token;
      if (!token) {
        throw new Error('Login successful but no token received.');
      }
      console.log('Login successful, token received.');
      localStorage.setItem('token', token); // Store token immediately

      // --- Step 2: Fetch user profile and permissions ---
      // Ensure Axios instance picks up the token for the next request
      // (Usually handled by setting the default header or using interceptors)
      // If your api utility doesn't handle this automatically, you might need:
      // api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const permissions = await fetchProfileAndPermissions();

      // --- Step 3: Store permissions ---
      localStorage.setItem('permissions', JSON.stringify(permissions));

      console.log('Token and permissions stored. Redirecting...');
      // Redirect to the main dashboard or desired page
      router.push('/dashboard'); // Or wherever appropriate

    } catch (err: unknown) {
      console.error('Authentication failed:', err);
      clearAuthData(); // Clear any partial data on error

      let message = 'Login failed. Please check your credentials or network connection.';
      if (typeof err === 'object' && err !== null) {
          if ('response' in err) {
              // Axios error
              const axiosError = err as { response?: { data?: { message?: string } } };
              message = axiosError.response?.data?.message || 'An error occurred during login.';
          } else if ('message' in err) {
               // Standard Error object or custom error
               message = (err as Error).message;
          }
      }
      setError(message);

    } finally {
      setLoading(false);
    }
  }, [router]);

  /**
   * Logs the user out by clearing stored data and redirecting.
   */
  const logout = useCallback(() => {
    console.log('Logging out...');
    clearAuthData();
    router.push('/'); // Redirect to login page
  }, [router]);

  // Add register function back if needed, following a similar pattern

  return {
    login,
    logout,
    // register,
    error,
    loading,
    // userProfile, // Expose if needed
  };
}

