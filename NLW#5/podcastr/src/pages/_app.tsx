import '../styles/global.scss';

//Importações dos components
import { Header } from '../components/Header';
import { Player } from '../components/Player';

import { PlayerContext } from '../contexts/playerContext';

import styles from '../styles/app.module.scss'
import { useState } from 'react';

function MyApp({ Component, pageProps }) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEspisodeIndex, setcurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);


  function play (episode){
    setEpisodeList([episode]);
    setcurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function setIsPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  return (
    <PlayerContext.Provider 
      value={{ 
        episodeList, 
        currentEspisodeIndex, 
        play, 
        isPlaying, 
        togglePlay,
        setIsPlayingState
      }}>

      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContext.Provider>
  )
}

export default MyApp
