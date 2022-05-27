import Axios from 'axios';
import * as qs from 'qs';

class Pastebin {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  public async createPaste(content: string, name: string, contentType: string) {
    const queryParams = {
      api_dev_key: this.key,
      api_paste_code: content,
      api_paste_private: 1,
      api_paste_name: name,
      api_paste_expire_date: '10M',
      api_paste_format: contentType,
      api_user_key: '',
      api_option: 'paste',
    };

    const { data } = await Axios.post(
      'https://pastebin.com/api/api_post.php',
      qs.stringify(queryParams),
      {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      },
    );

    return data;
  }
}

export default Pastebin;
