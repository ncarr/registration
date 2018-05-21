export default async ({ user, cookies: { token } }) => {
  user.tokens = [token]
  await user.save()
}
