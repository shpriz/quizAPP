#!/bin/bash

# Log file location
LOG_FILE="/var/log/auto-pull.log"

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Create log file if it doesn't exist
touch "$LOG_FILE"

# Repository directory
REPO_DIR="https://github.com/shpriz/quizAPP.git"

# Function to check if there are changes
check_for_changes() {
    cd "$REPO_DIR" || exit 1
    git remote update
    UPSTREAM=${1:-'@{u}'}
    LOCAL=$(git rev-parse @)
    REMOTE=$(git rev-parse "$UPSTREAM")
    BASE=$(git merge-base @ "$UPSTREAM")

    if [ "$LOCAL" = "$REMOTE" ]; then
        return 1  # Up-to-date
    else
        return 0  # Need to pull
    fi
}

# Main execution
log_message "Starting auto-pull check"

# Check if repository directory exists
if [ ! -d "$REPO_DIR" ]; then
    log_message "Error: Repository directory not found"
    exit 1
fi

# Navigate to repository
cd "$REPO_DIR" || exit 1

# Check if git is installed
if ! command -v git &> /dev/null; then
    log_message "Error: git is not installed"
    exit 1
fi

# Try to pull changes
if check_for_changes; then
    log_message "Changes detected, pulling updates..."
    git pull
    if [ $? -eq 0 ]; then
        log_message "Successfully pulled changes"
        
        # Restart Docker containers if needed
        if [ -f "docker-compose.yml" ]; then
            log_message "Restarting Docker containers..."
            docker-compose down && docker-compose up -d
            if [ $? -eq 0 ]; then
                log_message "Successfully restarted Docker containers"
            else
                log_message "Error restarting Docker containers"
            fi
        fi
    else
        log_message "Error pulling changes"
    fi
else
    log_message "Repository is up to date"
fi
