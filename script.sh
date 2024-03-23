#!/bin/bash

# Check if Homebrew is installed, if not, install it
if ! command -v brew &> /dev/null; then
    echo "Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Check if Oh My Zsh is installed, if not, install it
if [ ! -d "$HOME/.oh-my-zsh" ]; then
    echo "Installing Oh My Zsh..."
    sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
else
    echo "Oh My Zsh is already installed."
fi

# Check if Python is installed via Homebrew, if not, install it
if ! brew list --formula | grep -q "python@"; then
    echo "Installing Python via Homebrew..."
    brew install python@3.9
else
    echo "Python is already installed via Homebrew."
fi

# Check if Yarn is installed via Homebrew, if not, install it
if ! command -v yarn &> /dev/null; then
    echo "Installing Yarn via Homebrew..."
    brew install yarn
else
    echo "Yarn is already installed."
fi

# Use Python3 to install pip packages
echo "Installing pip packages..."
python3 -m pip install --upgrade pip

echo "Installation complete."

# Restart Zsh to apply changes
exec zsh
