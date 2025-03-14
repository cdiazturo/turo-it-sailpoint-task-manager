# Scripts

## Available Scripts

### Core Scripts

| Script             | Description                                                                        |
| ------------------ | ---------------------------------------------------------------------------------- |
| `script/setup`     | Sets up the project for the first time after cloning or resets it to a clean state |
| `script/bootstrap` | Installs/updates all dependencies                                                  |
| `script/test`      | Runs the test suite                                                                |
| `script/server`    | Starts the application server                                                      |

### Docker Scripts

| Script          | Description               |
| --------------- | ------------------------- |
| `script/docker` | Manages Docker operations |

## Usage

### Setup and Bootstrap

To set up the project for the first time:

```bash
./script/setup
```

This will:

1. Install all required dependencies (Node.js, Yarn)
2. Set up Git hooks
3. Install project dependencies
4. Build the Docker image

### Running Tests

To run all tests:

```bash
./script/test
```

This will run linting, unit tests, and type checking.

### Managing the Server

Start the server:

```bash
./script/server
```

Additional server commands:

```bash
./script/server stop      # Stop the server
./script/server restart   # Restart the server
./script/server logs      # View server logs
./script/server status    # Check server status
./script/server rebuild   # Rebuild and restart the server
```

### Docker Operations

Build the Docker image:

```bash
./script/docker build
```

Push the Docker image:

```bash
./script/docker push <tag>
```

Clean Docker resources:

```bash
./script/docker clean
```

Deep clean Docker system (remove all unused containers, networks, images, and volumes):

```bash
./script/docker prune
```
