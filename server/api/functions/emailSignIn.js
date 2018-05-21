export default async ({ body: { enabled }, user }) => {
  if (enabled) {
    user.emailSignInEnabled = true
  } else {
    if (!user.googleSignInEnabled) {
      throw new Error('You still need SOME way to sign in!')
    }
    user.emailSignInEnabled = false
  }
  await user.save()
}
