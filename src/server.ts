import { app } from './app'

const color = '\u001b[32m'
const resetColor = '\u001b[0m'

app.listen({ host: '0.0.0.0', port: 3333 }).then((address) => {
  console.log(`🚀 HTTP server running at: ${color + address + resetColor}`)
})
