export function isValidSignupPassword(password: string) {
  return (
    password.length >= 6 &&
    password.length <= 128 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password)
  )
}
