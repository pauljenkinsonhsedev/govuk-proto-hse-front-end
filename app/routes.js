//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//
const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const { developments } = require('./data/developments')

// Normalise helper
function normalise(str) {
  return (str || '')
    .trim()
    .toLowerCase()
    .replace(/['']/g, "'")
}

// STEP 1: user selects building type
router.post('/check-details', (req, res) => {
  const buildingType = req.body.buildingType
  const matches = developments
    .filter(d => normalise(d['building-type']) === normalise(buildingType))
    .map(d => d['development-type'])
  const developmentTypes = [...new Set(matches)]
  const developmentType =
    developmentTypes.length === 1 ? developmentTypes[0] : null

  // Ensure array exists
  if (!req.session.data.developments) {
    req.session.data.developments = []
  }

  // SAVE ONE development (THIS IS THE FIX)
  req.session.data.developments.push({
    buildingType,
    developmentType
  })

  // clear temporary values
  delete req.session.data.buildingType
  delete req.session.data.developmentType

  // Save session before redirecting to ensure data is written on Azure
  req.session.save(() => {
    res.redirect('/check-details')
  })
})

// STEP 3: check page routing ONLY
router.post('/check-development-details', (req, res) => {
  const addMoreDevs = req.body['add-more-devs'] === 'true'
  if (addMoreDevs) {
    return res.redirect('/developed')
  }
  res.redirect('/draw-development-boundary')
})

router.get('/remove-development/:index', (req, res) => {
  const index = Number(req.params.index)
  const developments = req.session.data.developments || []
  const dev = developments[index]
  if (!dev) {
    // safety fallback
    return res.redirect('/check-details')
  }
  // store index so POST knows what to remove
  req.session.data.removeIndex = index
  res.render('remove-development', { dev })
})

router.post('/remove-development-answer', (req, res) => {
  const answer = req.body['remove-development']
  const index = req.session.data.removeIndex
  if (answer === 'yes') {
    if (Array.isArray(req.session.data.developments)) {
      req.session.data.developments.splice(index, 1)
    }
  }
  // clean up
  delete req.session.data.removeIndex

  // Save session before redirecting to ensure data is written on Azure
  req.session.save(() => {
    res.redirect('/check-details')
  })
})

// Show draw boundary page for a specific development
router.get('/draw-development-boundary', function (req, res) {
  const developments = req.session.data.developments || []
  let index = Number(req.query.dev)
  if (Number.isNaN(index) || index < 0) {
    index = 0
  }
  if (index >= developments.length) {
    return res.redirect('/check-development-details')
  }
  res.render('draw-development-boundary', {
    dev: developments[index],
    index,
    total: developments.length
  })
})

module.exports = router