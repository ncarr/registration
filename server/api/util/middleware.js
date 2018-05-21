export default handler => (req, res, next) => {
  Promise.resolve()
    .then(() => handler(req, res))
    .then(result => res.json(result || 'OK'))
    .catch(next)
}
