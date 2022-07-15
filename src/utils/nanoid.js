const nanoid = (size = 21, prefix = '') => {
  let id = prefix
  // A compact alternative for `for (var i = 0; i < step; i++)`.
  let i = size
  while (i--) {
    // `| 0` is more compact and faster than `Math.floor()`.
    id += String.fromCharCode(33+((Math.random() * 93) | 0))
  }
  return id
}
export default nanoid