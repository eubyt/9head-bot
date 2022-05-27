import jwt from 'jsonwebtoken';
import Config from '@common/config';

export default {
  createLinkConnection: (userId: string, userName: string) => {
    const token = jwt.sign(
      {
        userId,
        userName,
      },
      Config.JWT_TOKEN,
      { expiresIn: '1h' },
    );

    return `http://localhost:3000/connections?token=${token}`;
  },
};
