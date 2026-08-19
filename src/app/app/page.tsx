"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function AppPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* App Navbar - using the actual app navbar component */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              ← Back to Portfolio
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-xl font-bold text-gray-800">Alpha Edu Hub</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer border border-gray-200">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>

            <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer border border-gray-200">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-xs font-medium leading-3 text-gray-800">Guest</span>
              <span className="text-[10px] text-gray-500">Not signed in</span>
            </div>

            <Link 
              href="/sign-in" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Simple content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-73px)]">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Alpha Edu Hub</h2>
          <p className="text-gray-600 mb-6">
            This is the full application interface. Please sign in to access the dashboard and all features.
          </p>
          <Link 
            href="/sign-in"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In to Continue
          </Link>
        </div>
      </div>
    </div>
  );
}
