const exec = require('@actions/exec')
const { info } = require('./log')
const { isDryRun } = require('./utils')

/**
 * Checks if the current working tree is clean
 * @returns {Promise<boolean>}
 */
module.exports.isGitWorkingTreeClean = async function isGitWorkingTreeClean() {
  let output = ''
  const options = {}
  options.listeners = {
    stdout: data => {
      output += data.toString()
    },
    stderr: data => {
      output += data.toString()
    }
  }
  await exec.exec(`git`, ['status', '--porcelain'], options).catch(() => {})
  return output == ''
}

/**
 * Class that contains helper methods for working with git
 */
module.exports.GitHelper = class GitHelper {
  constructor(env) {
    this.env = env
  }

  /**
   * Setups git client and ensures a full git history to work with
   * @returns {Promise<void>}
   */
  async init() {
    await this.setupGitConfig()
    await this.ensureFullHistory()
  }

  /**
   * Configure username / email in order to work with the git client
   * @returns {Promise<void>}
   */
  async setupGitConfig() {
    info('configuring git client')
    await exec.exec(`git config user.email "${this.env.config.git_email}"`)
    await exec.exec(`git config user.name "${this.env.config.git_user}"`)
  }

  /**
   * Function to ensure we are not just dealing with a shallow checkout
   * @returns {Promise<void>}
   */
  async ensureFullHistory() {
    info('ensuring current git history')
    await exec.exec(`git fetch --unshallow`)
  }

  /**
   *
   * @param commit_msg
   * @returns {Promise<void>}
   */
  async addChanges(commit_msg) {
    info('adding changes')
    await exec.exec(`git add CHANGELOG.md`)
    await exec.exec(`git commit -m "${commit_msg}"`)
  }

  /**
   *
   * @returns {Promise<void>}
   */
  async pushChanges() {
    info('pushing to remote')
    if (!isDryRun()) {
      await exec.exec(
        `git push https://${this.env.config.token}:@github.com/${this.env.repo_context.owner}/${this.env.repo_context.repo}.git +${this.env.config.release_branch}`
      )
      info('success')
    } else {
      info(`skipped - currently running in dry-run mode`)
    }
  }

  /**
   *
   * @param env
   * @returns {Promise<void>}
   */
  async createReleaseBranch() {
    await exec.exec(`git checkout -b ${this.env.config.release_branch}`)
  }

  /**
   *
   * @returns {Promise<void>}
   */
  async checkoutAndUpdateReleaseBranch() {
    await exec.exec(`git checkout ${this.env.config.release_branch}`)
    await exec.exec(`git rebase origin/${this.env.config.base_branch}`)
  }
}
