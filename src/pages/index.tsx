import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Podcastr</title>
      </Head>

      <h1>hello world</h1>
    </div>
  )
}
