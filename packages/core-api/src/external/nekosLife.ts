import Axios from 'axios';

async function connectionNekoLife(
  options: 'hug' | 'kiss' | 'woof' | 'goose' | 'meow' | 'slap' | 'waifu',
) {
  const { data } = await Axios.get(`https://nekos.life/api/v2/img/${options}`);
  return data.url;
}

export default connectionNekoLife;
