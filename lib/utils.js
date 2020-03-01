const core = require('@actions/core')

function isDryRun() {
  return process.env['DRY_RUN'] !== undefined || core.getInput('dry-run') !== ''
}

module.exports.isDryRun = isDryRun
