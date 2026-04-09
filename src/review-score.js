function average(items, selector) {
  if (!items.length) {
    return null
  }

  const total = items.reduce((sum, item) => sum + selector(item), 0)
  return Number((total / items.length).toFixed(2))
}

function summarizeReviewEnergy(observations) {
  return {
    averageScore: average(observations, (observation) => Number(observation.reviewEntertainmentScore || 0)),
    maintainerAmusementIndex: average(observations, (observation) => {
      const entertainment = Number(observation.reviewEntertainmentScore || 0)
      const moodWeight = observation.triageMood === 'delighted' ? 1.5 : observation.triageMood === 'uneasy' ? 0.75 : 1
      return entertainment * moodWeight
    })
  }
}

module.exports = {
  summarizeReviewEnergy
}
