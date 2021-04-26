import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import Image from 'next/image';
import Slider from 'rc-slider'

import 'rc-slider/assets/index.css'

import styles from './styles.module.scss'
import { convertDurationTimeToTimeString } from '../../utils/convertDurationTimeToTimeString';

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0)

  const { 
    episodeList, 
    currentEspisodeIndex, 
    isPlaying,
    isLooping,
    isShufflying,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setIsPlayingState,
    playPrevius,
    playNext,
    hasNext,
    hasPrevius,
    cleaPlayerState,
  } = usePlayer();

  useEffect(() => {
    // se nulo não haverá nunhum efeito colateral
    if(!audioRef.current) {
      return;
    }

    // verificamos qual a alteração e a tratamos
    if(isPlaying){
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying])

  function setupProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  function handleSeek (amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  function handleEpisodeEnded () {
    if(hasNext) {
      playNext()
    } else {
      cleaPlayerState()
    }
  }

  const episode = episodeList[currentEspisodeIndex];

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora"/>
        <strong>Tocando agora</strong>
      </header>

      { episode ? (
        <div className={styles.currentEpisode}>
          <Image 
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong>{ episode.title }</strong>
          <span>{ episode.members }</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
        <strong>Selecione um Podcast para ouvir</strong>
      </div>
      ) }

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
        <span>{convertDurationTimeToTimeString(progress)}</span>
          <div className={styles.slider}>
            { episode ? (
              <Slider
                max={ episode.duration }
                value={ progress } 
                onChange={ handleSeek }
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4}}
              />
            ) : (
              <div className={styles.emptySlider} />
            ) }
          </div>
          <span>{convertDurationTimeToTimeString(episode?.duration ?? 0)}</span>
        </div>

        { episode && (
          <audio 
            src={episode.url}
            ref={audioRef}
            autoPlay
            loop={ isLooping }
            onLoadedMetadata={setupProgressListener}
            onEnded={handleEpisodeEnded}
            onPlay={() => setIsPlayingState(true)}
            onPause={() => setIsPlayingState(false)}
          />
        )}

        <div className={styles.buttons}>
          <button 
            type="button" 
            disabled={!episode || episodeList.length == 1} 
            onClick={toggleShuffle}
            className={isShufflying ? styles.isActive : ''}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>

          <button 
            type="button" 
            onClick={playPrevius} 
            disabled={!episode || !hasPrevius}
          >
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>

          <button 
            type="button" 
            className={styles.playButton} 
            disabled={!episode}
            onClick={togglePlay}
          >
            { !isPlaying 
              ? (<img src="/play.svg" alt="Tocar" />)
              : (<img src="/pause.svg" alt="Pausar" />)
            }
          </button>

          <button 
            type="button" 
            onClick={playNext} 
            disabled={!episode || !hasNext}
          >
            <img src="/play-next.svg" alt="Tocar Proxima"/>
          </button>

          <button 
            type="button" 
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ''}
          > 
            <img src="/repeat.svg" alt="Repetir"/>
          </button>

        </div>
      </footer>
    </div>
  );
}