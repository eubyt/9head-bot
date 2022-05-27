import Axios from 'axios';
import { queryParamsToString } from '../util';

class Twitch {
  public clientId: string;

  constructor(clientId: string) {
    this.clientId = clientId;
  }

  public createAuthorizationUrl(redirectUri: string, scopes: string[]): string {
    const queryParams = {
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      scope: scopes.join('+'),
    };

    return `https://id.twitch.tv/oauth2/authorize?${queryParamsToString(queryParams)}`;
  }

  public async getAccessToken(
    client_secret: string,
    code: string,
    redirectUri: string,
  ): Promise<any> {
    const { data } = await Axios.post('https://id.twitch.tv/oauth2/token', {
      client_id: this.clientId,
      client_secret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    });

    return data;
  }

  public async getUserInfo(accessToken: string): Promise<any> {
    const { data } = await Axios.get('https://api.twitch.tv/helix/users', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Client-ID': this.clientId,
      },
    });

    return data;
  }

  // eslint-disable-next-line class-methods-use-this
  public static async getUserResolver(id: string): Promise<any> {
    const { data } = await Axios.get(`https://api.ivr.fi/twitch/resolve/${id}?id=true`);

    return data;
  }

  // eslint-disable-next-line class-methods-use-this
  public static async getListModVip(channel: string): Promise<any> {
    const { data } = await Axios.get(`https://api.ivr.fi/twitch/modsvips/${channel}`, {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });

    return data;
  }
}

export default Twitch;
