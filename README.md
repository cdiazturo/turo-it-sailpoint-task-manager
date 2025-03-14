# {**PROJECT_NAME**}

Template for Typescript Repositories

This project follows the [scripts to rule them all](https://github.com/github/scripts-to-rule-them-all) convention.

## Initial bootstrap

Once the repository is created, there is a `Initial bootstrapping` action that will run and replace all placeholders
with the correct values. It will also create a new commit with the changes.

## Local dev

Please use [developer-machine](https://github.com/turo/developer-machine) to install core development tooling.

```shell
~/code/developer-machine
./install frontend
```

To setup the project, simply run:

```bash
./script/setup
```

## Running the tests

Run the tests

```bash
./script/test
```

## GitHub Workflows

The supported workflows for GitHub are found in files in the `.github/workflows` directory.

### Sync environment from template repo Workflow

The `sync-environment.yaml` file from the `global` directory should have been moved up to this directory
to properly establish the "Sync environment from template repo" workflow. This workflow
is intended to be run on a periodic basis and copies certain files from the typescript-template repo
into derivative repositories, those repositories created by using typescript-template as its template
at GitHub repository creation time. This allows desired changes to typescript-template to be propagated to
all of its derivative repos.

If there are any files that come from the template that you would like to make changes to you have to create a
`sync-environment.patch` git patch file with those desired modifications.

In order to create a patch file, you can use the following command:

```shell
# 1. Update the files that you want to override
# 2. Create the patch
git diff --no-prefix --binary > sync-environment.patch
# 3. Commit the patch file
```

### CI Workflow

This workflow to accomplish standard CI tasks for Pull Requests (PR).

### Release Workflow

This workflow to accomplish standard Releasing of a derivative repository upon merge of a PR to the
default branch.
