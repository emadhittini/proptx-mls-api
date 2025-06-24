import { useState } from 'react';

// Fetch listings on the server
export async function getServerSideProps({ req }) {
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  const response = await fetch(`${baseUrl}/api/listings`);
  const listings = response.ok ? await response.json() : [];

  return { props: { listings } };
}

// Render listings with search and styling
export default function ListingsPage({ listings }) {
  const [query, setQuery] = useState('');
  const filtered = listings.filter(item => {
    const text = `${item.StreetNumber} ${item.StreetName} ${item.City}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  return (
    <div style={{ background: '#000', color: '#fff', fontFamily: 'sans-serif', padding: 40, minHeight: '100vh' }}>
      <h2 style={{ color: '#ff3333', fontSize: 32, marginBottom: 24, textTransform: 'uppercase' }}>
        Featured Listings
      </h2>

      <input
        type="text"
        placeholder="Search by address or city"
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '16px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          marginBottom: '24px'
        }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        {filtered.map((item, i) => (
          <div
            key={i}
            style={{
              background: '#111',
              border: '1px solid #ff3333',
              borderRadius: 12,
              overflow: 'hidden',
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(255,51,51,0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.5)';
            }}
          >
            <img
              src={item.PhotoUrl || 'https://via.placeholder.com/600x400?text=No+Image'}
              alt="Listing"
              style={{ width: '100%', height: 200, objectFit: 'cover' }}
            />
            <div style={{ padding: 16 }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: 20, color: '#fff' }}>
                {item.StreetNumber} {item.StreetName} — ${item.ListPrice}
              </h3>
              <p style={{ color: '#ccc', margin: '4px 0' }}>
                📍 {item.City}, {item.PostalCode}
              </p>
              <p style={{ color: '#ccc', margin: '4px 0' }}>
                🛏 {item.BedroomsTotal} 🛁 {item.BathroomsTotal}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
