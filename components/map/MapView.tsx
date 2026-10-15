"use client";

import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => <p className="p-4 text-gray-500 flex items-center justify-center h-full">Loading Map...</p>
});

export default function MapView({ businesses }: { businesses: any[] }) {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <LeafletMap businesses={businesses} />
    </div>
  );
}