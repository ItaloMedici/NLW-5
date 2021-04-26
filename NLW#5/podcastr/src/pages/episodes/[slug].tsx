import { GetStaticProps, GetStaticPaths } from 'next'
import { api } from '../../services/api';
import Link from 'next/link'
import Head from 'next/head';

import Image from 'next/image'
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { convertDurationTimeToTimeString } from '../../utils/convertDurationTimeToTimeString';

import styles from './episodes.module.scss';
import { usePlayer } from '../../contexts/PlayerContext';

type Espisodes = {
  id: string;
  url: string,
  title: string;
  members: string;
  duration: number;
  thumbnail: string;
  publishedAt: string;
  description: string
  durationAsString: string
}

type EpisodeProps = {
  episode: Espisodes,
}

export default function Episode({ episode }: EpisodeProps) {
  const { play } = usePlayer();

  return (
    <div className={styles.episodes}>
      <Head>
        <title>{episode.title} | Podcastr</title>
      </Head>

      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button"> 
            <img src="/arrow-left.svg" alt="Voltar"/>
          </button>
        </Link>
        <Image 
          width={700}        
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
        />
        <button type="button" onClick={() => play(episode)}>
          <img src="/play.svg" alt="Tocar episódio"/>
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div 
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />

    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const paths = data.map(episode => ({
    params: {
      slug: episode.id
    }
  }))

  return {
    paths,
    fallback: 'blocking'
  }
} 

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;  

  const { data } = await api.get(`/episodes/${slug}`);

  const episode = {
    id: data.id,
    title: data.title,
    members: data.members,
    thumbnail: data.thumbnail,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', {locale: ptBR}),
    description: data.description,
    url: data.file.url,
    duration: Number(data.file.duration),
    durationAsString: convertDurationTimeToTimeString(Number(data.file.duration))
  }

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24 // 24 hours
  }
} 