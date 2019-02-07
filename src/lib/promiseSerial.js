const concat = left => right => Array.prototype.concat.call(left, right)

const reducer = (promise, func) =>
  promise.then(result => func().then(concat(result)))

const promiseSerial = funcs => funcs.reduce(reducer, Promise.resolve([]))

export default promiseSerial
