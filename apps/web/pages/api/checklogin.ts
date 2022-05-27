import type { NextApiRequest, NextApiResponse } from 'next';
import { User, startDataSource, TwitchConnection } from '@9head/database';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse<unknown>) {
  const { token } = req.query;
  if (token === undefined) {
    res.status(404).json({ error: 'Missing token' });
    return;
  }
  await startDataSource(process.env.MONGO_URL || 'none');

  await jwt.verify(
    String(token),
    process.env.JWT_TOKEN || 'none',
    async (err: any, decoded: any) => {
      if (err) res.status(401).json({ error: 'Invalid token' });
      else {
        const userDiscord = await User.findOneBy({ userId: String(decoded.userId) });
        if (!userDiscord) {
          res.status(400).json({ error: 'User not found' });
          return;
        }
        const twitchConnection: TwitchConnection =
          userDiscord.connectionTwitch || new TwitchConnection('', '', '');
        res.status(200).json({
          userId: decoded.userId,
          userName: decoded.userName,
          views: {
            twitch: twitchConnection.id !== '',
          },
        });
      }
    },
  );
}
