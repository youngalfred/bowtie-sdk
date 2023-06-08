const getCookies = () =>
  document.cookie.split('; ').reduce((acc, next) => {
    const [key, value] = next.split('=')
    if (!key) {
      return acc
    }

    return {
      ...acc,
      [key]: value,
    }
  }, {})

module.exports = {
  getCookies,
  SESSION_ID: 'demo-session-id',
}
