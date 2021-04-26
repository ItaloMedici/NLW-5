import { createContext, ReactNode, useContext, useState } from "react";

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}

type PlayerContextData = {
  episodeList: Episode[];
  currentEspisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShufflying: boolean;
  hasNext: boolean;
  hasPrevius: boolean;
  play: (episode: Episode) => void;
  playList: (list: Episode[], index: number) => void;
  setIsPlayingState: (state: boolean) => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  playNext: () => void;
  playPrevius: () => void;
  cleaPlayerState: () => void;
  
}
 
export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children: ReactNode;
} 

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEspisodeIndex, setcurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLoop] = useState(false);
  const [isShufflying, setIsSufflying] = useState(false);

  function play (episode: Episode){
    setEpisodeList([episode]);
    setcurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList (list: Episode[], index: number){
    setEpisodeList(list);
    setcurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function toggleLoop() {
    setIsLoop(!isLooping);
  }

  function toggleShuffle() {
    setIsSufflying(!isShufflying);
  }


  function setIsPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  function cleaPlayerState() {
    setEpisodeList([]);
    setcurrentEpisodeIndex(0);
  }

  const hasNext = isShufflying || (currentEspisodeIndex + 1) < episodeList.length;
  const hasPrevius = currentEspisodeIndex  > 0;

  function playNext () {
    if (isShufflying) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)

      setcurrentEpisodeIndex(nextRandomEpisodeIndex);
    } 
    else if (hasNext) {
      setcurrentEpisodeIndex(currentEspisodeIndex + 1);
    }
  }

  function playPrevius () {
    if (hasPrevius){
      setcurrentEpisodeIndex(currentEspisodeIndex - 1);
    }
  }

  return (
    <PlayerContext.Provider 
      value={{ 
        episodeList, 
        currentEspisodeIndex, 
        play,
        playList,
        playNext,
        playPrevius,
        isPlaying, 
        isLooping, 
        isShufflying, 
        togglePlay,
        toggleLoop,
        toggleShuffle,
        hasNext,
        hasPrevius,
        setIsPlayingState,
        cleaPlayerState
      }}
    >
        { children }
      </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext);
}