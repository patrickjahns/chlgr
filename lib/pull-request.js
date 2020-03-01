const { info } = require('./log')
const { isDryRun } = require('./utils')

/**
 *
 * @param env
 * @param commit_msg
 * @param body
 * @returns {Promise<void>}
 */
async function createOrUpdatePr(env, commit_msg, body) {
  info('checking for pull request')
  const { data: pr } = await env.octokit.pulls.list({
    state: 'open',
    base: env.config.base_branch,
    head: `${env.repo_context.owner}:${env.config.release_branch}`,
    ...env.repo_context
  })

  if (pr.length == 0) {
    info('no pull request found - creating')
    if (!isDryRun()) {
      const pr_result = await env.octokit.pulls.create({
        title: commit_msg,
        head: env.config.release_branch,
        base: env.config.base_branch,
        body: body,
        maintainer_can_modify: true,
        ...env.repo_context
      })
      const pr_id = pr_result.data.number
      info(`success - created pull request with id: ${pr_id}`)
    } else {
      info(`skipped - currently running in dry-run mode`)
    }
  } else {
    const pr_id = pr[0].number
    info(`found pull request with id: ${pr_id} - updating`)
    if (!isDryRun()) {
      await env.octokit.pulls.update({
        pull_number: pr_id,
        title: commit_msg,
        body: body,
        ...env.repo_context
      })
      info(`success - updated pull request with id: ${pr_id}`)
    } else {
      info(`skipped - currently running in dry-run mode`)
    }

    // TODO: if updated, leave a comment when the changelog was updated??
  }
}

module.exports.createOrUpdatePr = createOrUpdatePr
