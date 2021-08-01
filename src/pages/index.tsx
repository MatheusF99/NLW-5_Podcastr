/* eslint-disable @next/next/no-img-element */
import { GetStaticProps } from 'next'
import Image from 'next/image'
import { api } from '../services/api'

import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'

import styles from '../styles/home.module.scss'

import playGreen from '../../public/play-green.svg'

interface EpisodesProps {
  id: string;
  title: string;
  members: string,
  publishedAt: string,
  thumbnail: string,
  description: string,
  duration: Number,
  durationAsString: string
  url: string
}

interface homeProps {
  lastestEpisodes: EpisodesProps[],
  allEpisodes: EpisodesProps[]
}

export default function Home({ lastestEpisodes, allEpisodes }: homeProps) {
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Ultimos Lançamentos</h2>
        <ul>
          {
            lastestEpisodes.map(episode => {
              return (
                <li key={episode.id}>
                  <Image width={192} height={192} src={episode.thumbnail} alt={episode.title} />
                  <div className={styles.episodesDetails}>
                    <a href="">{episode.title}</a>
                    <p>{episode.members}</p>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>
                  </div>
                  <button>
                    <Image src={playGreen} alt="play episodio" />
                  </button>
                </li>
              )
            })
          }
        </ul>
      </section>

      <section className={styles.allEpisodes}>

      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const data = response.data

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MM yy', {
        locale: ptBR
      }),
      thumbnail: episode.thumbnail,
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,
      description: episode.description
    }
  })

  const lastestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      lastestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8
  }
}