// // src/app/dashboard/layout.tsx
// 'use client'; // Layouts often need client-side logic for auth checks, etc.

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Sidebar from '@/components/Sidebar'; // Example: Your navigation component
// import Header from '@/components/Header';   // Example: Your header component

// export default function DashboardLayout({
//   children, // This will be the page component (e.g., ManageUsersPage)
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();

//   // --- Basic Route Protection Example ---
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     // Add permission checks if needed for the entire dashboard section
//     const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');

//     if (!token) {
//       // Redirect to login if not authenticated
//       router.push('/');
//     }
//     // Example: Check for a general 'access_dashboard' permission
//     // else if (!permissions.includes('ACCESS_DASHBOARD')) {
//     //   router.push('/unauthorized'); // Or back to login/home
//     // }

//   }, [router]);

//   // Render the layout structure around the page content
//   return (
//     <div className="flex h-screen bg-gray-100">
//       <Sidebar /> {/* Your navigation sidebar */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Header /> {/* Your top header */}
//         <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4 md:p-6">
//           {/* The actual page component (ManageUsersPage) gets rendered here */}
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

// =============================================================================================================

// src/app/dashboard/layout.tsx
'use client'; // Still likely needed for hooks like useEffect, useRouter

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Optional: Add a simple link back

export default function DashboardLayout({
  children, // This will be the page component (e.g., ManageUsersPage)
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // --- Basic Route Protection Example ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    // Optionally, add a basic permission check if needed for the whole section
    // const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');

    if (!token) {
      // Redirect to login if not authenticated
      console.log('No token found, redirecting to login.'); // Debug log
      router.replace('/'); // Use replace to avoid adding the dashboard to history
    }
    // Example: Check for a general permission if required for all dashboard pages
    // else if (!permissions.includes('ACCESS_DASHBOARD')) {
    //   console.log('Missing required permission, redirecting.'); // Debug log
    //   router.replace('/unauthorized'); // Or back to login/home
    // }

  }, [router]);

  // --- Render Structure ---
  // You might want a minimal wrapper for padding or background
  return (
    <div className="min-h-screen bg-gray-100">
       {/* Optional: Add a simple navigation link if needed */}
       <nav className="bg-white shadow p-4 mb-4">
         <Link href="/dashboard" className="text-blue-600 hover:underline mr-4">Dashboard Home</Link>
         {/* Add other links as needed, e.g., back to roles */}
         <Link href="/dashboard/users" className="text-blue-600 hover:underline mr-4">Manage Users</Link>
         <Link href="/dashboard/roles" className="text-blue-600 hover:underline  mr-4">Manage Roles</Link>
         <Link href="/dashboard/permissions" className="text-blue-600 hover:underline  mr-4">Manage Permissions</Link>
         {/* Maybe a logout button */}
       </nav>

       {/* Render the actual page component passed by Next.js */}
       <div className="container mx-auto px-4 py-4">
        {children}
       </div>
    </div>
  );
}
