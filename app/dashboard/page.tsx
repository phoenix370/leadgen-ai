"use client";

import { useState } from 'react';
import MapView from '@/components/map/MapView';
import DemoPreview from '@/components/dashboard/DemoPreview';
import { Search, MapPin, Loader2, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // New states for the AI Generator
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeDemo, setActiveDemo] = useState<{ business: any, content: any } | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await response.json();
      if (data.success) setBusinesses(data.businesses);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateDemo = async (biz: any) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: biz.name, category: biz.category, address: biz.address }),
      });
      const data = await response.json();
      if (data.success) {
        setActiveDemo({ business: biz, content: data.data });
      }
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const redLeads = businesses.filter(b => !b.hasWebsite);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-[400px] bg-white border-r border-gray-200 flex flex-col shadow-xl z-20">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <MapPin className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">LeadGen AI</h1>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="e.g., 'Gyms in Hadapsar, Pune'" 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={handleSearch}
              disabled={isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
            >
              {isLoading ? <Loader2 className="animate-spin" size={14} /> : 'Search'}
            </button>
          </div>
        </div>

        <div className="px-5 py-3 border-b border-gray-100 flex gap-2">
          <div className="flex-1 bg-red-50 p-3 rounded-lg text-center border border-red-100">
            <p className="text-xs text-red-600 font-semibold uppercase">Red Leads</p>
            <p className="text-2xl font-bold text-red-700">{redLeads.length}</p>
          </div>
          <div className="flex-1 bg-green-50 p-3 rounded-lg text-center border border-green-100">
            <p className="text-xs text-green-600 font-semibold uppercase">Have Website</p>
            <p className="text-2xl font-bold text-green-700">{businesses.length - redLeads.length}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {businesses.length === 0 && !isLoading && (
            <div className="text-center text-gray-400 mt-10">
              <p>Search for a business type and area to find leads.</p>
            </div>
          )}

          {redLeads.map((biz) => (
            <div key={biz.id} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-white group">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{biz.name}</h3>
                <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">NO SITE</span>
              </div>
              <p className="text-xs text-gray-500 mb-1">{biz.category}</p>
              <p className="text-xs text-gray-400 mb-3">{biz.address}</p>
              <button 
                onClick={() => handleGenerateDemo(biz)}
                disabled={isGenerating}
                className="w-full text-xs bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                {isGenerating ? 'Generating...' : 'Generate AI Demo Site'}
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* RIGHT SIDE: Map */}
      <main className="flex-1 relative">
        <MapView businesses={businesses} />
      </main>

      {/* AI DEMO PREVIEW MODAL */}
      {activeDemo && (
        <DemoPreview 
          business={activeDemo.business} 
          content={activeDemo.content} 
          onClose={() => setActiveDemo(null)} 
        />
      )}
    </div>
  );
}