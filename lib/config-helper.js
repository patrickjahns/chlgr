const core = require('@actions/core')

const COMMIT_MSG_PREFIX = '[RELEASE]'
const CHANGELOG_FILE = 'CHANGELOG.md'
const BASE_BRANCH = 'master'
const RELEASE_BRANCH = 'release/next'
const RELEASE_VERSION = 'unknown'
const GIT_USERNAME = 'GitHub Action'
const GIT_EMAIL = 'action@github.com'

module.exports.getConfig = function getConfig() {
  let config = {}
  config.git_token = core.getInput('token') || process.env['GITHUB_TOKEN'] || ''
  if (!config.git_token) {
    throw new Error('No github token provided')
  }
  config.workspace = process.env['GITHUB_WORKSPACE'] || undefined
  if (!config.workspace) {
    throw new Error(
      'could not determine workspace, please use  actions/checkout or provide GITHUB_WORKSPACE environment variable'
    )
  }
  config.commit_msg_prefix =
    core.getInput('commit-msg-prefix') ||
    process.env['CHLGR_COMMIT_MSG_PREFIX'] ||
    COMMIT_MSG_PREFIX
  config.changelog_file =
    core.getInput('changelog-file') ||
    process.env['CHLGR_CHANGELOG_FILE'] ||
    CHANGELOG_FILE
  config.base_branch =
    core.getInput('base-branch') ||
    process.env['CHLGR_BASE_BRANCH'] ||
    BASE_BRANCH
  config.release_branch =
    core.getInput('release-branch') ||
    process.env['CHLGR_RELEASE_BRANCH'] ||
    RELEASE_BRANCH
  config.release_version =
    core.getInput('release-version') ||
    process.env['CHLGR_RELEASE_VERSION'] ||
    RELEASE_VERSION
  config.git_user =
    core.getInput('git-user') ||
    process.env['CHLGR_GIT_USERNAME'] ||
    GIT_USERNAME
  config.git_email =
    core.getInput('git-email') || process.env['CHLGR_GIT_EMAIL'] || GIT_EMAIL
  return config
}
