import { NextApiHandler } from 'next';
import scrape from 'backend/sources/scraper';
import { HttpStatus } from 'backend/types/serverResponse';

const handler: NextApiHandler = async (req, res) => {
  const { url } = req.body;
  if (!url || url.trim() === '') {
    res
      .status(HttpStatus.BadRequest)
      .json({ error: 'Invalid param url, cannot be empty' });
    return;
  }
  try {
    const result = await scrape(url);
    res.json(result);
  } catch (e) {
    console.error(e);
    res
      .status(HttpStatus.ServerError)
      .json({ error: `cannot scrape url: ${e}` });
  }
};

export default handler;
