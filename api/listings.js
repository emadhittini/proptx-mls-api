export default async function handler(req, res) {
  const response = await fetch("https://query.ampre.ca/odata/Property?$top=10", {
    headers: {
      Authorization: `Bearer ${process.env.PROPTX_TOKEN}`
    }
  });

  const data = await response.json();
  res.status(200).json(data.value);
}
