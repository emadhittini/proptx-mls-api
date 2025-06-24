export async function getServerSideProps() {
  const response = await fetch("https://query.ampre.ca/odata/Property?$top=10", {
    headers: {
      Authorization: `Bearer ${process.env.PROPTX_TOKEN}`
    }
  });

  const data = await response.json();
  return {
    props: {
      listings: data.value
    }
  };
}

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
        paddingBottom: "8px"
      }}>
        Featured Listings
      </h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "24px"
      }}>
        {listings.map((item, index) => (
          <div key={index} style={{
            background: "#111",
            border: "1px solid #ff3333",
            borderRadius: "12px",
            overflow: "hidden"
          }}>
            <img
              src={item.PhotoUrl || "https://via.placeholder.com/600x400?text=No+Image"}
              alt="Listing"
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                transition: "transform 0.3s",
              }}
              onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseOut={e => e.currentTarget.style.transform = "scale(1.0)"}
            />
            <div style={{ padding: "16px" }}>
              <h3 style={{ marginBottom: "8px" }}>
                {item.StreetName} — ${item.ListPrice}
              </h3>
              <p style={{ margin: "4px 0", color: "#ccc" }}>
                📍 {item.City}, {item.PostalCode}
              </p>
              <p style={{ margin: "4px 0", color: "#ccc" }}>
                🛏 {item.BedroomsTotal} 🛁 {item.BathroomsTotal}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

