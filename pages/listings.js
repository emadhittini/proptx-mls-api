import { useState } from 'react';
import { Montserrat } from 'next/font/google';

// Load Montserrat font\const montserrat = Montserrat({
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
  const regionFiltered = priceFiltered.filter(
    l => regions.includes(l.CountyOrParish)
  );

  return { props: { regionFiltered } };
}

export default function ListingsPage({ regionFiltered }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);

  // Search & dynamic slice
  const matched = regionFiltered.filter(item => {
    const text = `${item.StreetNumber} ${item.StreetName} ${item.City}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  // Default: show first 6; if searching, show all matched
  const display = query ? matched : matched.slice(0, 6);

  // Styles
  const overlay = { /* same overlayStyle as before */ };
  const modalBox = { /* same modalStyle as before */ };
  const closeBtn = { /* same closeStyle as before */ };

  return (
    <div className={montserrat.className} style={{ background: '#000', color: '#fff', padding: 40 }}>
      <h2 style={{ color: '#ff3333', marginBottom: 16 }}>Featured Listings</h2>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="🔍 Search by address or city"
        style={{ /* same input styling */ }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px,1fr))', gap: 24, marginTop: 24 }}>
        {display.map((item, i) => (
          <div key={i} onClick={() => setSelected(item)} style={{ /* card styles */ }}>
            <img src={item.PhotoUrl || 'https://via.placeholder.com/600x400'} alt="Listing" style={{ width: '100%', height: 200, objectFit: 'cover' }} />
            <div style={{ padding: 16 }}>
              <h3 style={{ margin: 0 }}>{item.StreetNumber} {item.StreetName}</h3>
              <p>${item.ListPrice.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div style={overlay} onClick={() => setSelected(null)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} style={closeBtn}>&times;</button>
            <h3>{selected.StreetNumber} {selected.StreetName}</h3>
            <p>{selected.PublicRemarks}</p>
            <img src={selected.PhotoUrl} alt="Main" style={{ width: '100%', maxHeight: 400, objectFit: 'cover' }} />
          </div>
        </div>
      )}
    </div>
  );
}
