const github = require('@actions/github')
const { getConfig } = require('./config-helper')
const { getLatestChanges, generateChangelog } = require('./changelog')
const { createOrUpdatePr } = require('./pull-request')
const { info } = require('./log')
const { isGitWorkingTreeClean, GitHelper } = require('./git-helper')

module.exports.run = async function run() {
  info('running action')
  // TODO: only run on designated branches and designated events for safeguarding

  const config = getConfig()

  const env = {
    config: config,
    octokit: new github.GitHub(config.git_token),
    repo_context: github.context.repo
  }

  const githelper = new GitHelper(env)
  // initialize git functions
  await githelper.init()
  await githelper.createReleaseBranch()

  // generate the changelog
  await generateChangelog(env)

  // only continue if changes to the changelog are actually detected
  info('checking working tree for changes')
  if (await isGitWorkingTreeClean()) {
    info('working tree clean, nothing to do')
    return
  }

  const commit_msg = `${env.config.commit_msg_prefix} ${env.config.release_version}`
  // add Changelog.md and commit to working tree
  await githelper.addChanges(commit_msg)

  // push changes to remote
  await githelper.pushChanges()

  // parse changelog
  const changes = getLatestChanges(env.config.changelog_file)

  // create pull request
  await createOrUpdatePr(env, commit_msg, changes)

  info('finished')
}
