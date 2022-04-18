import { NextApiHandler } from 'next';
import scrape from '@/utils/api/scrape';
import { ServerResponses } from 'additional.d.ts';

const handler: NextApiHandler = async (req, res) => {
  const { url } = req.body;
  if (!url || url.trim() === '') {
    res
      .status(ServerResponses.HttpStatus.BadRequest)
      .json({ error: 'Invalid param url, cannot be empty' });
    return;
  }
  try {
    const result = await scrape(url);
    res.json(result);
  } catch (e) {
    console.error(e);
    res
      .status(ServerResponses.HttpStatus.ServerError)
      .json({ error: `cannot scrape url: ${e}` });
  }
};

export default handler;
