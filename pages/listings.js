// pages/listings.js

export async function getServerSideProps({ req }) {
  // BUILD the base URL dynamically:
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  // Fetch from your own API proxy:
  const response = await fetch(`${baseUrl}/api/listings`);
  const listings = response.ok ? await response.json() : [];

  return { props: { listings } };
}

export default function ListingsPage({ listings }) {
  return (
    <div style={{
      background: "#000", color: "#fff",
      fontFamily: "sans-serif", padding: 40,
      minHeight: "100vh"
    }}>
      <h2 style={{
        color: "#ff3333", fontSize: 32,
        marginBottom: 32,
        borderBottom: "2px solid #ff3333",
        paddingBottom: 8, textTransform: "uppercase"
      }}>
        Featured Listings
      </h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: 24
      }}>
        {listings.map((item, i) => (
          <div key={i} style={{
            background: "#111",
            border: "1px solid #ff3333",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
            transition: "transform 0.3s, box-shadow 0.3s",
            cursor: "pointer"
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(255,51,51,0.3)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.5)";
            }}
          >
            <img
              src={item.PhotoUrl || "https://via.placeholder.com/600x400?text=No+Image"}
              alt="Listing"
              style={{
                width: "100%",
                height: 200,
                objectFit: "cover"
              }}
            />
            <div style={{ padding: 16 }}>
              <h3 style={{
                margin: "0 0 8px 0", fontSize: 20, color: "#fff"
              }}>
                {item.StreetNumber} {item.StreetName} — ${item.ListPrice}
              </h3>
              <p style={{ color: "#ccc", margin: "4px 0" }}>
                📍 {item.City}, {item.PostalCode}
              </p>
              <p style={{ color: "#ccc", margin: "4px 0" }}>
                🛏 {item.BedroomsTotal} 🛁 {item.BathroomsTotal}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
