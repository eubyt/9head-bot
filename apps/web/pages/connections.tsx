import type { NextPage } from 'next';
import { Twitch } from '@9head/core-api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Axios from 'axios';
import styles from '../styles/ui.module.css';

const buttonLink = () => {
  const twitch = new Twitch(process.env.NEXT_PUBLIC_TWITCH_CLIENT || 'empty-client-id');
  const REDIRECT_URL = 'http://localhost:3000/twitch';
  return twitch.createAuthorizationUrl(REDIRECT_URL, ['user:read:email', 'user:read:email']);
};
const Home: NextPage = () => {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [twitch, setTwitch] = useState<boolean>(false);
  const [user, setUser] = useState<string>();
  const { token } = router.query;

  useEffect(() => {
    const jwt = token || window.sessionStorage.getItem('token');
    if (loggedIn) return;
    if (token !== undefined) {
      window.sessionStorage.setItem('token', String(token));
    }
    if (jwt !== undefined || jwt !== null) {
      Axios.get(`/api/checklogin?token=${jwt}`)
        .then(({ data }) => {
          setLoggedIn(true);
          setTwitch(data.views.twitch);
          setUser(data.userName);
        })
        .catch(() => {
          setLoggedIn(false);
        });
    }
  }, [loggedIn, token]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles['main-head']}>
          <div className={[styles.box, styles.full, styles['justify-center']].join(' ')}>
            <span className={styles.title}>Visualizar suas conexões</span>
          </div>
          {loggedIn ? (
            <div className={[styles.box, styles.full, styles['justify-center']].join(' ')}>
              <span className={styles['user-name']}>Olá, {user}</span>
            </div>
          ) : (
            <div className={[styles.box, styles.full, styles['justify-center']].join(' ')}>
              <span className={styles['user-name']}>Você deve se conectar para visualizar </span>
            </div>
          )}
        </div>
        <div className={styles['main-connections']}>
          {loggedIn ? (
            <div className={[styles.box, styles.full, styles['justify-center']].join(' ')}>
              <span className={styles['name-connection']}>
                <span>Twitch</span>
              </span>
              {twitch ? (
                <div
                  className={styles['button-desconnect']}
                  onClick={() => {
                    Axios.get(
                      `/api/disconnect/twitch?userId=${window.sessionStorage.getItem('token')}`,
                    ).then(() => {
                      window.location.reload();
                    });
                  }}
                  aria-hidden="true"
                >
                  Disconectar
                </div>
              ) : (
                <a className={styles['button-connection']} type="button" href={buttonLink()}>
                  Conectar
                </a>
              )}
            </div>
          ) : (
            <div />
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
