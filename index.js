const { run } = require('./lib/main')
const core = require('@actions/core')

// run the action
run().catch(error => {
  // Action threw an error. Fail the action with the error message.
  core.setFailed(error.message)
})
