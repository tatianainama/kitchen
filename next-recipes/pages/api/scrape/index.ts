import { NextApiHandler } from 'next';
import scrape from '@/utils/api/scrape';

enum HttpStatus {
  BadRequest = 400,
  ServerError = 500,
}

const handler: NextApiHandler = async (req, res) => {
  const { url } = req.body;
  if (!url) {
    res.status(HttpStatus.BadRequest).json({ error: 'Invalid param url, cannot be empty' });
    return;
  }
  try {
    const result = await scrape(url);
    res.json(result);
  } catch (e) {
    res.status(HttpStatus.ServerError).json({ error: `Error while scraping url ${url}: ${e}` });
  }
};

export default handler;
