"use client";

export default function DemoPreview({ business, content, onClose }: { business: any, content: any, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Top Bar */}
        <div className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-3 text-sm text-gray-400">demo.leadgen.ai/{business.name.toLowerCase().replace(/\s+/g, '-')}</span>
          </div>
          <button onClick={onClose} className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded transition-colors">
            Close Preview
          </button>
        </div>

        {/* Website Content */}
        <div className="h-[80vh] overflow-y-auto">
          
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-24 px-8 text-center">
            <h1 className="text-5xl font-extrabold mb-4 tracking-tight">{content.headline}</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">{content.subheadline}</p>
            <button className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-blue-50 transition-colors shadow-lg">
              Book an Appointment
            </button>
          </section>

          {/* About Section */}
          <section className="py-16 px-8 max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About {business.name}</h2>
            <p className="text-lg text-gray-600 leading-relaxed">{content.about}</p>
          </section>

          {/* Services Section */}
          <section className="bg-gray-50 py-16 px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Our Services</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {content.services.map((service: string, index: number) => (
                  <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-blue-600 font-bold text-xl">{index + 1}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{service}</h3>
                    <p className="text-gray-500">Professional and reliable service tailored to your needs.</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-gray-900 text-gray-400 py-12 px-8 text-center">
            <h3 className="text-white text-2xl font-bold mb-2">{business.name}</h3>
            <p className="mb-4">{business.address}</p>
            <p className="text-sm">© 2024 {business.name}. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}