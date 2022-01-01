/* eslint-disable id-length */
import { NextApiHandler } from 'next';
import scrape from '@/utils/api/scrape';


const handler: NextApiHandler = async (req, res) => {
  const { url } = req.body;
  const result = await scrape(url);
  res.json(result);
};

export default handler;
