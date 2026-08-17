export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body; 
  const { ZNN_ACCESS_TOKEN, AM_TOKEN, AM_API_BASE } = process.env;

  try {
    const url = new URL(`${AM_API_BASE}/send`);
    if (email) url.searchParams.append('email', email); 

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'X-ZNN-Access': ZNN_ACCESS_TOKEN,
        'X-AM-Token': AM_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.text();
    
    try {
      res.status(response.status).json(JSON.parse(data));
    } catch {
      res.status(response.status).send(data);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}