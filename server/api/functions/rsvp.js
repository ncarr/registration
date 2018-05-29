export default async ({ user, body: { going } }) => {
  user.status = going ? 5 : 4
  await user.save()
}
