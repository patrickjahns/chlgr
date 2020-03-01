const { info } = require('./log')

/**
 *
 * @param env
 * @returns {Promise<void>}
 */
module.exports.ensureBaseBranchExists = async function ensureBaseBranchExists(
  env
) {
  info(`checking for base branch ${env.config.base_branch}`)
  await env.octokit.git
    .getRef({ ref: `heads/${env.config.base_branch}`, ...env.repo_context })
    .catch(() => {
      throw new Error(
        `Could not find base branch '${env.config.base_branch}' - please check your configuration`
      )
    })
  return true
}

module.exports.doesReleaseBranchExists = async function doesReleaseBranchExists(
  env
) {
  const result = await env.octokit.git
    .getRef({ ref: `heads/${env.config.release_branch}`, ...env.repo_context })
    .catch(() => {
      return undefined
    })
  return result != undefined
}
