import { GetFirstPage, GetSecondPage, GetThirdPage } from '@/util/fetch-functions'
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'

const CachePage = {
  'first-page': GetFirstPage,
  'second-page': GetSecondPage,
  'third-page': GetThirdPage
} as const

const Cache = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { replace } = useRouter()

  if (typeof window !== 'undefined') {
    replace(`/${props.page}`)
  }

  return null
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { page: 'first-page' } },
      { params: { page: 'second-page' } },
      { params: { page: 'third-page' } }
    ],
    fallback: false
  }
}

export const getStaticProps = (async ({ params }) => {
  const page = params?.page as keyof typeof CachePage

  return {
    props: {
      ...(await CachePage[page]()),
      page
    },
    revalidate: 120
  }
}) satisfies GetStaticProps

export default Cache
