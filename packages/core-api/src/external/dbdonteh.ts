import Axios from 'axios';
import * as AxiosCache from 'axios-cache-adapter';

const cache = AxiosCache.setupCache({
  maxAge: 60 * 60 * 1000,
});

const api = Axios.create({
  adapter: cache.adapter,
});

const getShire = async () => {
  const { data } = await api.get('https://dbd.onteh.net.au/api/shrine');
  // console.log(request.fromCache);
  return data;
};

const perkInfo = async (perkName: string) => {
  const { data } = await api.get(`https://dbd.onteh.net.au/api/perkinfo?perk=${perkName}`);
  return data;
};

export default { getShire, perkInfo };
