// pages/listings.js

// 1) Fetch listings on the server
export async function getServerSideProps() {
  const response = await fetch(
    "https://query.ampre.ca/odata/Property?$top=10",
    {
      headers: {
        Authorization: `Bearer ${process.env.PROPTX_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    return { props: { listings: [] } };
  }

  const data = await response.json();
  return { props: { listings: data.value } };
}

// 2) Render listings with black/red/white theme
export default function ListingsPage({ listings }) {
  return (
    <div style={{
      background: "#000",
      color: "#fff",
      fontFamily: "sans-serif",
      padding: "40px",
      minHeight: "100vh"
    }}>
      <h2 style={{
        color: "#ff3333",
        fontSize: "32px",
        marginBottom: "32px",
        borderBottom: "2px solid #ff3333",
        paddingBottom: "8px",
        textTransform: "uppercase"
      }}>
        Featured Listings
      </h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "24px"
      }}>
        {listings.map((item, i) => (
          <div key={i} style={{
            background: "#111",
            border: "1px solid #ff3333",
            borderRadius: "12px",
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
                height: "200px",
                objectFit: "cover"
              }}
            />
            <div style={{ padding: "16px" }}>
              <h3 style={{
                margin: "0 0 8px 0",
                fontSize: "20px",
                color: "#fff"
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
