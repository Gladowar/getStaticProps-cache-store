const GetFirstPage = async () => {
  const [posts, comments] = await Promise.all([
    fetch('https://jsonplaceholder.typicode.com/posts'),
    fetch('https://jsonplaceholder.typicode.com/comments')
  ])

  const [pjson, cjson] = await Promise.all([posts.json(), comments.json()])

  return { posts: pjson, comments: cjson }
}

const GetSecondPage = async () => {
  const [albums, photos] = await Promise.all([
    fetch('https://jsonplaceholder.typicode.com/albums'),
    fetch('https://jsonplaceholder.typicode.com/photos')
  ])

  const [ajson, pjson] = await Promise.all([albums.json(), photos.json()])

  return { albums: ajson, photos: pjson }
}

const GetThirdPage = async () => {
  const [todos, users] = await Promise.all([
    fetch('https://jsonplaceholder.typicode.com/todos'),
    fetch('https://jsonplaceholder.typicode.com/users')
  ])

  const [tjson, ujson] = await Promise.all([todos.json(), users.json()])

  return { todos: tjson, users: ujson }
}

export { GetFirstPage, GetSecondPage, GetThirdPage }
