#!/bin/bash

# Define constants
readonly ACTIVITIES=(
    "tourisme"
    "traversemanche"
    "chantierport"
    "environnement"
    "historiqueport"
    "fonctionnementport"
    "lesacteurs"
)

# Function to install dependencies
install_dependencies() {
    set -e
    echo "Installing dependencies..."

    command -v apt-get >/dev/null 2>&1 || {
        echo >&2 "apt-get is required to automatically install dependencies. Please install the following dependencies manually: imagemagick, libjpeg-progs, oxipng, svgo. Aborting."
        exit 1
    }

    # Update package lists
    echo "Updating package lists..."
    sudo apt-get update

    # Install required packages
    if ! command -v convert >/dev/null 2>&1; then
        sudo apt-get install -y imagemagick
    fi

    if ! command -v cjpeg >/dev/null 2>&1; then
        sudo apt-get install -y libjpeg-progs
    fi

    if ! command -v svgo >/dev/null 2>&1; then
        if ! command -v npm >/dev/null 2>&1; then
            sudo apt-get install -y npm
        fi
        sudo npm install -g svgo
    fi

    if ! command -v oxipng >/dev/null 2>&1; then
        if ! command -v cargo >/dev/null 2>&1; then
            curl https://sh.rustup.rs -sSf | sh -s -- -y
        fi
        cargo install oxipng
    fi
}

# Function to check if required executables exist
check_executables() {
    local commands=("convert" "find" "jpegtran" "oxipng" "svgo")
    for cmd in "${commands[@]}"; do
        command -v $cmd >/dev/null 2>&1 || {
            echo >&2 "I require '$cmd' but it's not installed.  Run the script with '-i' or '--install' to install dependencies. Aborting."
            exit 1
        }
    done
}

# Function to resize images
resize_images() {
    echo "Resizing images..."
    echo "> Resizing index background image..."
    index_bg="img/index-bg*"
    convert $index_bg -resize x1350 $index_bg > /dev/null;

    echo "> Resizing intro background image..."
    intro_bg="img/intro-bg*"
    convert $intro_bg -resize 1920x1080\> $intro_bg > /dev/null;

    echo "> Resizing logos..."
    for img in img/logo*; do
        if [[ $img == *.svg ]]; then
            continue
        fi
        convert $img -resize 512x512\> $img > /dev/null;
    done

    echo "> Resizing info panels..."
    for img in img/*-top.* img/*-bottom.*; do
        convert $img -resize x372 $img > /dev/null;
    done

    echo "> Resizing activity images..."
    for activity in "${ACTIVITIES[@]}"; do
        path="img/$activity*";
        convert $path -resize x389 $path > /dev/null;
    done

    echo "> Resizing quiz images..."
    for img in jeux/quiz/img/*; do
        convert $img -resize 600x600\> $img > /dev/null;
    done
}

# Function to optimize images
optimize_images() {
    echo "Optimizing images... (this may take a while)"
    
    echo "> Optimizing JPEG images..."
    find img -type f -iname '*.jpg' -exec jpegtran -copy none -optimize -perfect -outfile {} {} \; > /dev/null
    find img -type f -iname '*.jpeg' -exec jpegtran -copy none -optimize -perfect -outfile {} {} \; > /dev/null
    
    echo "> Optimizing PNG images..."
    oxipng -q -o max -s -a --fast -Z -r . > /dev/null
    
    echo "> Optimizing SVG images..."
    find img -type f -iname '*.svg' -exec svgo -i {} \; > /dev/null
}

# Main script
if [[ $1 == "-h" || $1 == "--help" ]]; then
    echo "Usage: ./optimize-images.sh [OPTION]"
    echo "Optimize all images in the project by resizing them to the correct dimensions and losslessly compressing them."
    echo "Options:"
    echo "  -i, --install  Install dependencies (imagemagick, libjpeg-progs, oxipng [cargo], svgo [npm])"
    exit 0
fi

if [[ $1 == "-i" || $1 == "--install" ]]; then
    install_dependencies
fi

check_executables
resize_images
optimize_images
