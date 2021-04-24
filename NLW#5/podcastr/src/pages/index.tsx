import { GetStaticProps } from 'next'
import Image from 'next/image'

import { api } from '../services/api'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { convertDurationTimeToTimeString } from '../utils/convertDurationTimeToTimeString'

import styles from './home.module.scss'

type Espisodes = {
  id: string;
  url: string,
  title: string;
  members: string;
  duration: number;
  thumbnail: string;
  description: string;
  publishedAt: string;
  durationAsString: string
}

type HomeProps = {
  latestEpisodes: Espisodes[];
  allEpisodes: Espisodes[];
}

export default function Home({latestEpisodes, allEpisodes}: HomeProps) {
  return(
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
      
        <ul>
          {latestEpisodes.map(episode => {
            return(
              <li key={episode.id}>
                <Image 
                  width={192}
                  height={192}
                  src={episode.thumbnail} 
                  alt={episode.title}
                  objectFit="cover"
                />

                <div className={styles.episodeDetails}>
                  <a href="">{episode.title}</a>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button">
                  <img src="/play-green.svg" alt="Tocar Episodio"/>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
      </section>

    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit:12,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const episodes = data.map( episode => {
    return {
      id: episode.id,
      title: episode.title,
      members: episode.members,
      thumbnail: episode.thumbnail,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}),
      description: episode.description,
      url: episode.file.url,
      duration: Number(episode.file.duration),
      durationAsString: convertDurationTimeToTimeString(Number(episode.file.duration))
    };
  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  }
}