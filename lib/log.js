const core = require('@actions/core')

/**
 * Helper function to print out a formatted log message
 * @param msg
 */
function info(msg) {
  core.info(`chlgr - INFO - ${msg}`)
}

module.exports.info = info
