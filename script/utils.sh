#!/usr/bin/env bash

# Common utility functions for script/* files

# Color definitions
RESET="\033[0m"
BOLD="\033[1m"
RED="\033[31m"
GREEN="\033[32m"
YELLOW="\033[33m"
BLUE="\033[34m"
MAGENTA="\033[35m"
CYAN="\033[36m"

# Emoji definitions
EMOJI_SUCCESS="✅"
EMOJI_ERROR="❌"
EMOJI_WARNING="⚠️ "
EMOJI_INFO="ℹ️ "
EMOJI_ROCKET="🚀"
EMOJI_GEAR="⚙️ "
EMOJI_PACKAGE="📦"
EMOJI_TEST="🧪"
EMOJI_CLOCK="🕒"
EMOJI_DOCKER="🐳"

# Function to print a section header
section() {
  echo -e "\n${BOLD}${BLUE}${EMOJI_INFO} $1${RESET}\n"
}

# Function to print a success message
success() {
  echo -e "${GREEN}${EMOJI_SUCCESS} $1${RESET}"
}

# Function to print an error message
error() {
  echo -e "${RED}${EMOJI_ERROR} $1${RESET}"
}

# Function to print a warning message
warning() {
  echo -e "${YELLOW}${EMOJI_WARNING} $1${RESET}"
}

# Function to print an info message
info() {
  echo -e "${CYAN}${EMOJI_INFO} $1${RESET}"
}

# Function to print a command that will be executed
run_cmd() {
  echo -e "${MAGENTA}${EMOJI_GEAR} Running:${RESET} $1"
  eval "$1"
  if [ $? -ne 0 ]; then
    error "Command failed: $1"
    return 1
  fi
  return 0
}

# Function to check if a command exists
check_command() {
  if ! command -v "$1" &> /dev/null; then
    error "$1 command not found"
    return 1
  fi
  success "$1 found"
  return 0
}

# Function to handle errors
handle_error() {
  error "$1"
  exit 1
}
