# SailPoint IdentityNow Task Manager

This project is a React application that allows you to manage SailPoint IdentityNow tasks.

## 🚀 Getting Started

### Prerequisites

Please use [developer-machine](https://github.com/turo/developer-machine) to install core development tooling.

```shell
~/code/developer-machine
./install frontend
```

### Initial Setup

To set up the project, simply run:

```bash
./script/setup
```

This will:

- Install all required dependencies (Node.js, Yarn)
- Set up Git hooks
- Install project dependencies
- Build the Docker image
- Create an `.env` file if it doesn't exist

## 🧪 Development

### Running in Development Mode

For local development with hot-reloading:

```bash
yarn dev
```

This will start the development server with live reloading, error reporting, and other development features.

### Running in Production Mode

To build and run the application in production mode:

```bash
./script/server
```

This will build and start the SailPoint Task Manager in a Docker container, accessible at http://localhost:3005.

Additional server commands:

```bash
./script/server stop      # Stop the server
./script/server restart   # Restart the server
./script/server logs      # View server logs
./script/server status    # Check server status
./script/server rebuild   # Rebuild and restart the server
```

### Running Tests

Run the test suite:

```bash
./script/test
```

This will run linting, unit tests, and type checking.

## 🐳 Docker Operations

The project includes Docker scripts to help manage container operations:

```bash
./script/docker build     # Build the Docker image
./script/docker push <tag> # Tag and push the Docker image
./script/docker clean     # Clean Docker resources
./script/docker prune     # Deep clean Docker system
```

## 🛠️ Scripts to Rule Them All

This project follows the ["Scripts to Rule Them All"](https://github.com/github/scripts-to-rule-them-all) pattern. All scripts can be found in the `script/` directory:

| Script             | Description                            |
| ------------------ | -------------------------------------- |
| `script/setup`     | Sets up the project for the first time |
| `script/bootstrap` | Installs/updates all dependencies      |
| `script/test`      | Runs the test suite                    |
| `script/server`    | Manages the application server         |
| `script/docker`    | Manages Docker operations              |

For more information, see [script/README.md](script/README.md).

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
