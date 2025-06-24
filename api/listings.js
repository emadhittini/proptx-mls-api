// api/listings.js

export default async function handler(req, res) {
  // Fetch the first 10 listings from PropTx OData
  const response = await fetch(
    "https://query.ampre.ca/odata/Property?$top=10",
    {
      headers: {
        Authorization: `Bearer ${process.env.PROPTX_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    const text = await response.text();
    return res.status(502).send(`PropTx API error: ${text}`);
  }

  const data = await response.json();
  res.status(200).json(data.value);
}
