import Link from "next/link";
import { MapPin, Zap, Globe } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-3xl text-center space-y-8">
        
        {/* Logo / Title */}
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-lg mb-4">
            <MapPin size={32} />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
            Find Leads. Build Sites. <span className="text-blue-600">Get Paid.</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The AI-powered dashboard that scans your local map for businesses without websites, 
            and instantly generates a demo site to sell them.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
            <Zap size={18} className="text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Instant AI Demos</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
            <MapPin size={18} className="text-red-500" />
            <span className="text-sm font-medium text-gray-700">Red/Green Map Filter</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
            <Globe size={18} className="text-green-500" />
            <span className="text-sm font-medium text-gray-700">Built-in CRM</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Open Dashboard &rarr;
          </Link>
        </div>

      </div>
    </main>
  );
}