export default handler => (req, res, next) => {
  Promise.resolve()
    .then(() => handler(req.body, req.user, req.params))
    .then(result => res.json(result || 'OK'))
    .catch(next)
}
