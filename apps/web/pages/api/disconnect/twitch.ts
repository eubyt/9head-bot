import type { NextApiRequest, NextApiResponse } from 'next';
import { User, startDataSource, TwitchConnection } from '@9head/database';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse<unknown>) {
  const { userId } = req.query;
  await startDataSource(process.env.MONGO_URL || 'none');
  await jwt.verify(
    String(userId),
    process.env.JWT_TOKEN || 'none',
    async (err: any, decoded: any) => {
      if (err) {
        res.status(401).json({ error: 'Invalid JWT' });
      } else {
        const userDiscord = await User.findOneBy({ userId: String(decoded.userId) });
        if (!userDiscord) {
          res.status(400).json({ error: 'User not found' });
          return;
        }
        userDiscord.connectionTwitch = new TwitchConnection('', '', '');
        if (userDiscord.connectionTwitch === null) {
          return;
        }
        await userDiscord.save();
        res.status(200).json({
          userId: decoded.userId,
          views: {
            twitch: (userDiscord.connectionTwitch as TwitchConnection)?.id !== '',
          },
        });
      }
    },
  );
}
