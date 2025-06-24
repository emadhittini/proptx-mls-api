import { useState } from 'react';
import { Montserrat } from 'next/font/google';

// Load Montserrat font
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
});

// Server-side fetch, price + region filtering
export async function getServerSideProps({ req }) {
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  // Fetch all listings
  const res = await fetch(`${baseUrl}/api/listings`);
  const all = res.ok ? await res.json() : [];

  // Filter price between 400k and 2M
  const priceFiltered = all.filter(l => l.ListPrice >= 400000 && l.ListPrice <= 2000000);

  // Only Southern & West Ontario: Toronto, Peel, Halton
  const regions = ['Toronto', 'Peel', 'Halton'];
  const regionFiltered = priceFiltered.filter(l => regions.includes(l.CountyOrParish));

  return { props: { regionFiltered } };
}

export default function ListingsPage({ regionFiltered }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);

  // Search filter
  const matched = regionFiltered.filter(item => {
    const text = `${item.StreetNumber} ${item.StreetName} ${item.City}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  // Show first 6 by default, else all matches
  const display = query ? matched : matched.slice(0, 6);

  // Style objects
  const overlay = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.8)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000
  };
  const modalBox = {
    background: '#111', padding: '24px', borderRadius: '8px',
    maxWidth: '90%', maxHeight: '90%', overflow: 'auto', position: 'relative'
  };
  const closeBtn = {
    position: 'absolute', top: '8px', right: '8px',
    background: 'transparent', border: 'none', fontSize: '1.5rem', color: '#fff', cursor: 'pointer'
  };

  return (
    <div className={montserrat.className} style={{ background: '#000', color: '#fff', minHeight: '100vh', padding: '40px 20px' }}>
      <h2 style={{ color: '#ff3333', fontSize: '2rem', marginBottom: '16px' }}>Featured Listings</h2>

      <input
        type="text"
        placeholder="🔍 Search by address or city"
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{
          width: '100%', maxWidth: 400,
          padding: '12px 16px', fontSize: '1rem',
          borderRadius: '8px', border: '1px solid #444',
          marginBottom: '24px', background: '#111', color: '#fff'
        }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {display.map((item, i) => (
          <div
            key={i}
            onClick={() => setSelected(item)}
            style={{
              background: '#111', border: '1px solid #ff3333', borderRadius: '12px', overflow: 'hidden',
              transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'pointer'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.04)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(255,51,51,0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.6)';
            }}
          >
            <img
              src={item.PhotoUrl || 'https://via.placeholder.com/600x400?text=No+Image'}
              alt="Listing"
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            <div style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: '1.25rem' }}>
                {item.StreetNumber} {item.StreetName}
              </h3>
              <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#ccc' }}>
                ${item.ListPrice.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div style={overlay} onClick={() => setSelected(null)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} style={closeBtn}>&times;</button>
            <h3 style={{ margin: '0 0 16px' }}>
              {selected.StreetNumber} {selected.StreetName}
            </h3>
            <p style={{ color: '#ccc', marginBottom: '16px' }}>
              {selected.PublicRemarks}
            </p>
            {selected.PhotoUrl && (
              <img
                src={selected.PhotoUrl}
                alt="Main"
                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '4px' }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
