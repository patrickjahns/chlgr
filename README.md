# chlgr
![test](https://github.com/patrickjahns/chlgr/workflows/test/badge.svg?branch=master&style=flat)
![license](https://img.shields.io/github/license/patrickjahns/chlgr)

Creates a changelog and provides the content via pull requests to be merged for a release

## Introduction

This action provides the functionality of [github-changelog-generator](https://github.com/github-changelog-generator/github-changelog-generator) to easily and automatically manage a human readable changelog.
chlgr differentiates itself from other changelog actions, by managing the changelog in a separate branch and as well as maintaining and creating a pull request with the changelog.

The rationale behind here is, that released artifacts should contain a up-to-date changelog with the correct version set.


## Usage

<!-- start usage -->
```yaml
- uses: patrickjahns/chlgr@v1
  with:
    # A prefix to be used for the commit msg and pr title
    # Default: [RELEASE]
    commit-msg-prefix: ''

    # The filename of the changelog
    # Default: CHANGELOG.md
    changelog-file: ''

    # The base for the pull-request chlgr creates
    # Default: master
    base-branch: ''

    # The branch used by chlgr for pushing the changelog and basing the pull request
    # off towards `base-branch`
    # Default: release/next
    release-branch: ''

    # If provided, this will be used as version for the changelog and the pull request
    # title
    # Default: unknown
    release-version: ''

    # If set, the action will not push the changelog or create a pull request
    dry-run: ''

    # Auth token used to push the changes back to github and create the pull request
    # with. [Learn more about creating and using encrypted secrets](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets)
    # Default: ${{ github.token }}
    token: ''
```
<!-- end usage -->

## Examples

### Basic example

```yaml
name: Update Changelog
on:
  push:
    branches:
      - master

jobs:
  changelog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - name: update changelog
        uses: patrickjahns/chlgr@v1
```


### Passing a version to the action

```yaml
name: Update Changelog
on:
  push:
    branches:
      - master

jobs:
  changelog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - name: calculate next version
        id: version
        uses: patrickjahns/version-drafter-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - name: update changelog
        uses: patrickjahns/chlgr@v1
        with:
          release-version: ${{ steps.version.outputs.next-version }}
```

## Extended configuration

This action utilizes [github-changelog-generator](https://github.com/github-changelog-generator/github-changelog-generator) therefor all [configuration options](https://github.com/github-changelog-generator/github-changelog-generator/wiki/Advanced-change-log-generation-examples)
are also applicable for this action by creating a [`.github_changelog_generator` params file](https://github.com/github-changelog-generator/github-changelog-generator#params-file).

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
