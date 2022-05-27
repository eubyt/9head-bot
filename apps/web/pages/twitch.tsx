import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import styles from '../styles/ui.module.css';

const Twitch: NextPage = () => {
  const router = useRouter();
  const { code } = router.query;
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    const jwt = window.sessionStorage.getItem('token');
    if (loggedIn || code === undefined) {
      return;
    }

    if (jwt !== undefined || jwt !== null) {
      Axios.get(`/api/checklogin?token=${jwt}`)
        .then(() => {
          setLoggedIn(true);
          Axios.get(`/api/connections/twitch?code=${code}&userId=${jwt}`).then(() =>
            router.push('/connections'),
          );
        })
        .catch(() => {
          setLoggedIn(false);
        });
    }
  }, [loggedIn, code, router]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles['main-head']}>
          <div className={[styles.box, styles.full, styles['justify-center']].join(' ')}>
            <span className={styles.title}>Aguarde...</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Twitch;
