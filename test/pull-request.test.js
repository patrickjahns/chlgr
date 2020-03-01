const nock = require('nock')
const { createOrUpdatePr } = require('../lib/pull-request')
const github = require('@actions/github')
const octokit = new github.GitHub('test')

nock.disableNetConnect()

describe('pull-request', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it('will create a pull request if none is found', async () => {
    let env = {
      config: {
        base_branch: 'master',
        release_branch: 'release/next'
      },
      octokit: octokit,
      repo_context: {
        owner: 'patrickjahns',
        repo: 'chlgr'
      }
    }
    nock('https://api.github.com')
      .get('/repos/patrickjahns/chlgr/pulls')
      .query({ state: 'open', base: 'master', head: 'release/next' })
      .reply(200, [])
    nock('https://api.github.com')
      .post('/repos/patrickjahns/chlgr/pulls', body => {
        expect(body).toMatchObject({
          body: `test`,
          title: `test`,
          head: 'release/next',
          base: 'master',
          maintainer_can_modify: true
        })
        return true
      })
      .reply(200)
    await createOrUpdatePr(env, 'test', 'test')
    expect.assertions(1)
  })

  it('will update a pull request if one is found', async () => {
    let env = {
      config: {
        base_branch: 'master',
        release_branch: 'release/next'
      },
      octokit: octokit,
      repo_context: {
        owner: 'patrickjahns',
        repo: 'chlgr'
      }
    }
    nock('https://api.github.com')
      .get('/repos/patrickjahns/chlgr/pulls')
      .query({ state: 'open', base: 'master', head: 'release/next' })
      .reply(200, require('./fixtures/open_pull_request'))
    nock('https://api.github.com')
      .patch('/repos/patrickjahns/chlgr/pulls/5', body => {
        expect(body).toMatchObject({
          body: `test`,
          title: `test`
        })
        return true
      })
      .reply(200)
    await createOrUpdatePr(env, 'test', 'test')
    expect.assertions(1)
  })
})
