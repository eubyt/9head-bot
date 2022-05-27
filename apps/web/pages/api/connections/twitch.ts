import { Twitch } from '@9head/core-api';
import { User, TwitchConnection, startDataSource } from '@9head/database';
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse<unknown>) {
  const { code, userId } = req.query;
  const twitch = new Twitch(process.env.NEXT_PUBLIC_TWITCH_CLIENT || 'none');
  if (!userId) {
    res.status(400).json({ error: 'Missing userId' });
    return;
  }

  try {
    await startDataSource(process.env.MONGO_URL || 'none');
    const accessTwitch = await twitch.getAccessToken(
      process.env.TWITCH_SECRET || 'none',
      String(code),
      'http://localhost:3000/connections',
    );

    await jwt.verify(
      String(userId),
      process.env.JWT_TOKEN || 'none',
      async (err: any, decoded: any) => {
        if (err) res.status(401).json({ error: 'Invalid JWT' });
        else {
          const userDiscord = await User.findOneBy({ userId: String(decoded.userId) });
          if (!userDiscord) {
            res.status(400).json({ error: 'User not found' });
            return;
          }
          const { data } = await twitch.getUserInfo(accessTwitch.access_token);
          userDiscord.connectionTwitch = new TwitchConnection(
            data[0].id,
            accessTwitch.access_token,
            accessTwitch.refresh_token,
          );
          await userDiscord.save();

          res.status(200).json({
            userId: decoded.userId,
          });
        }
      },
    );
  } catch (error) {
    res.status(500).json({
      error: "Couldn't get access token",
    });
  }
}
