async function getPartialPortfolio(sessionId) {
  const response = await fetch(`/session/${sessionId}/progress`, {
    method: 'GET',
  })

  try {
    const { data: partialPortfolio } = await response.json()
    if (response.ok && partialPortfolio) {
      return partialPortfolio
    }
  } catch (error) {
    console.error(error)
    // TODO: Checkout the 401 error
    // fallthrough
  }

  return null
}

module.exports = {
  getPartialPortfolio,
}
