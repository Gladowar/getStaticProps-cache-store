import { GetThirdPage } from '@/util/fetch-functions'
import { TextToObject } from '@/util/text-to-object'
import { ThirdPageCacheSchema } from '@/validations/validate-cache'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

const ThirdPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <p>
        This data comes from the &quot;ghost page&quot; (cache/[page]) which exports a
        getStaticProps function (ISR) but in this page, we use getServerSideProps
      </p>
      <p>This acts (kinda) like using getStaticProps and getServerSideProps together in a page.</p>
      <p>Props Size (KB): {Math.ceil(Buffer.byteLength(JSON.stringify(props)) / 1024)}</p>
      <p>Dynamic Data: {props.date}</p>
      <p>Static Data: {JSON.stringify(props, null, 2)}</p>
    </>
  )
}

export const getServerSideProps = (async () => {
  try {
    console.time('cache')
    const data = await TextToObject('third-page', ThirdPageCacheSchema)

    console.timeEnd('cache')
    return {
      props: {
        ...data,
        date: new Date().toString()
      }
    }
  } catch (error) {
    console.log({ error })
    console.time('fresh')
    const freshData = await GetThirdPage()

    console.timeEnd('fresh')
    return { props: { ...freshData, date: new Date().toString() } }
  }
}) satisfies GetServerSideProps

export default ThirdPage
