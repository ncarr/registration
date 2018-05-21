export default ({ user }) => {
  user.set({ submitted: null, status: 0 })
  return user.save()
}
