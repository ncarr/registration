export default async ({ body: { enabled }, user }) => {
  if (enabled) {
    user.googleSignInEnabled = true
  } else {
    if (!user.emailSignInEnabled) {
      throw new Error('You still need SOME way to sign in!')
    }
    user.googleSignInEnabled = false
  }
  await user.save()
}
