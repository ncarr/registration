export default async ({ user }) => {
  delete user.googleID
  await user.save()
}
