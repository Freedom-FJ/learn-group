const data = 'ss'
console.log(data)
export const test = async () => {
  const data = await import('./lodash')
  console.log(data.default.map)
}

setTimeout(() => {
  test()
}, 3000)
export default  data