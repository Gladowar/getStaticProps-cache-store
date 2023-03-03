# Using a single Dynamic (ISR) Page as a cache store for a NextJS app

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

This project uses getStaticProps so to see the intended effect, you should run it in production mode.

```bash
pnpm i
 # then
pnpm build
 # then
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Motivation

Sometimes using getStaticProps in a page is not possible because we're dependent on EACH request given to us by getServerSideProps in context (more info below) but parts of that getServerSideProps is static and same for all users.

context available in getStaticProps:

Note: since the page is static, we don't have access to request and response.

```typescript
type GetStaticPropsContext<
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData
> = {
  params?: Params
  preview?: boolean
  previewData?: Preview
  locale?: string
  locales?: string[]
  defaultLocale?: string
}
```

context available in getServerSideProps:

Here we have access to request, response and query.

```typescript
type GetServerSidePropsContext<
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData
> = {
  req: IncomingMessage & {
    cookies: NextApiRequestCookies
  }
  res: ServerResponse
  params?: Params
  query: ParsedUrlQuery
  preview?: boolean
  previewData?: Preview
  resolvedUrl: string
  locale?: string
  locales?: string[]
  defaultLocale?: string
}
```

Sure we can count on the Backend's caching layer (if it has one) but We're still fetching data from a Backend that could be thousands of Kilometers away which counts for tens of milliseconds (best case scenario) but fetching data from another page in the same server is definitely faster.

## How

NextJS appends the stringified data returning from get\*Props at the end of a page's html in script tag with the id "**\_\_NEXT_DATA\_\_**", we can use this to our advantage.

In the ghost page `cache/[page]` which has no content on the screen and could redirect a user on the client to the page that cache is for, we call getStaticProps (with [ISR](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration), if needed) & getStaticPaths and get the data we want from an API which NextJS fetches that data and caches it in a json file.

In `(first-page|second-page|third-page).tsx`, in the getServerSideProps function we fetch the corresponding cache page and convert it to text and parse that text to HTML and getElementById "**\_\_NEXT_DATA\_\_**" and parse that JSON and validate it using zod (I used minimal validation to be sure data exists but you could go further and validate the whole thing), if validation succeeds, we return that data as props to page, if for whatever reason it failed, we get the fresh data from the API.

Look at the code to learn more.

## How much faster is this

It really depends what you are caching and how fast and how far your backend is from your frontend.

Of course getting data from a static page on the same server is always going to be way faster than getting data from a remote server.

In this little example with getting data from [JSONPlaceholder](https://jsonplaceholder.typicode.com), It's (considering my network) at least 50 times faster.
