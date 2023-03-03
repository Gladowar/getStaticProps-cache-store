import { parseHTML } from 'linkedom'
import { z } from 'zod'

export const TextToObject = async <T extends z.ZodTypeAny>(
  page: 'first-page' | 'second-page' | 'third-page',
  schema: T
): Promise<z.infer<T>> => {
  const cachePage = await fetch(`${process.env.BASE_URL}/cache/${page}`)
  const text = await cachePage.text()

  const { document } = parseHTML(text)

  const NEXT_DATA = document.getElementById('__NEXT_DATA__')?.innerHTML

  if (!NEXT_DATA) {
    throw new Error(`${page}: No NEXT_DATA`)
  }

  const parsedDATA = JSON.parse(NEXT_DATA)

  const validationResult = await schema.safeParseAsync(parsedDATA.props.pageProps)

  if (!validationResult.success) {
    throw new Error(`${page}: Validation Failed`)
  }

  return validationResult.data
}
