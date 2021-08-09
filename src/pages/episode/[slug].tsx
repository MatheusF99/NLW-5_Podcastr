import { GetStaticProps } from "next"
import { useRouter } from "next/router"
import { api } from "../../services/api"
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString"
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

export default function Episode() {

  const router = useRouter()

  return (
    <h1>{router.query.slug}</h1>
  )
}

export const getStaticProps: GetStaticProps = async (ctx) => {

  const { slug } = ctx.params

  const { data } = await api.get(`/episode/${slug}`)

  const episode = {
    id: data.id,
    title: data.title,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', {
      locale: ptBR
    }),
    thumbnail: data.thumbnail,
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    url: data.file.url,
    description: data.description
  }

  return {
    props: {
      episode
    },
    revalidate: 60 * 60 * 24
  }
}