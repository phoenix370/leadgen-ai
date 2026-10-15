import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const query = body.query;
    const apiKey = process.env.SERPAPI_KEY;

    console.log('--- SCRAPE ATTEMPT ---');
    console.log('Query:', query);
    console.log('API Key loaded:', !!apiKey);

    if (!apiKey) {
      console.error('ERROR: SerpApi key is missing in .env.local');
      return NextResponse.json({ error: 'SerpApi key is missing. Check .env.local and restart server.' }, { status: 500 });
    }

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    // 1. Fetch data from Google Maps via SerpApi
    const url = new URL('https://serpapi.com/search.json');
    url.searchParams.append('engine', 'google_maps');
    url.searchParams.append('q', query);
    url.searchParams.append('type', 'search');
    url.searchParams.append('api_key', apiKey);

    const response = await fetch(url.toString());
    const data = await response.json();

    // Check if SerpApi itself returned an error
    if (data.error) {
      console.error('SerpApi Returned Error:', data.error);
      return NextResponse.json({ error: data.error }, { status: 500 });
    }

    // 2. Extract and format the results
    const results = data.local_results || [];

    const formattedBusinesses = results.map((biz: any, index: number) => {
      // THE RED/GREEN LOGIC
      const hasRealWebsite = biz.website && 
        !biz.website.toLowerCase().includes('facebook.com') && 
        !biz.website.toLowerCase().includes('instagram.com') && 
        !biz.website.toLowerCase().includes('yelp.com') && 
        !biz.website.toLowerCase().includes('tripadvisor.com');

      return {
        id: index + 1,
        name: biz.title,
        category: biz.type || 'Business',
        address: biz.address,
        lat: biz.gps_coordinates?.latitude || 40.7128,
        lng: biz.gps_coordinates?.longitude || -74.0060,
        phone: biz.phone,
        rating: biz.rating,
        reviews: biz.reviews,
        website: biz.website,
        hasWebsite: hasRealWebsite,
      };
    });

    console.log(`Success! Found ${formattedBusinesses.length} businesses.`);
    return NextResponse.json({ success: true, businesses: formattedBusinesses });

  } catch (error: any) {
    console.error('CRITICAL SCRAPING ERROR:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch data' }, { status: 500 });
  }
}