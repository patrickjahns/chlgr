const fs = require('fs')
const { info } = require('./log')
const exec = require('@actions/exec')

/**
 * Parses a changelog markdown file to look for the latest changes by
 * looking for starting ## and ending ## tags
 *
 * @param changelog
 * @returns {string}
 */
function getLatestChanges(changelog) {
  let changelog_content = fs.readFileSync(changelog, 'utf8')
  let start = changelog_content.indexOf('## [')
  let end = changelog_content.indexOf('## [', start + 4)
  return changelog_content.slice(start, end)
}

/**
 *
 * @param changes
 * @param changelog
 */
function writeChangelog(changes, changelog) {
  if (!fs.existsSync(changelog)) {
    fs.writeFileSync(changelog, changes)
    return
  }

  let current_changelog = fs.readFileSync(changelog, 'utf8')
  let splitter = current_changelog.indexOf('## [')
  let full_changes =
    current_changelog.slice(0, splitter) +
    changes +
    current_changelog.slice(splitter)
  fs.writeFileSync(changelog, full_changes)
}

/**
 *
 * @param workspace
 * @param repository
 * @param token
 * @returns {Promise<void>}
 */
async function generateChangelog(env) {
  const temporary_changelog = `${env.config.changelog_file}.tmp`
  info('executing github-changelog-generator')
  await exec.exec(
    `docker run --rm -v ${env.config.workspace}:/usr/local/src/your-app ferrarimarco/github-changelog-generator ` +
      `--user ${env.repo_context.owner} ` +
      `--project ${env.repo_context.repo} ` +
      `--token ${env.config.git_token} ` +
      `--future-release ${env.config.release_version} ` +
      `--output ${temporary_changelog}`
  )
  const changelog_entries = getLatestChanges(temporary_changelog)
  fs.unlinkSync(temporary_changelog)
  writeChangelog(changelog_entries, env.config.changelog_file)
}

module.exports.generateChangelog = generateChangelog
module.exports.getLatestChanges = getLatestChanges
