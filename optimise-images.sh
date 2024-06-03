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

    needs_resizing() {
        local img=$1
        local target_width=$2
        local target_height=$3
        local current_dimensions=$(identify -format "%wx%h" "$img")
        local current_width=${current_dimensions%x*}
        local current_height=${current_dimensions#*x}

needs_resizing() {
    # Check if the image needs resizing
    # $1: image path
    # $2: target width (-1 to ignore)
    # $3: target height (-1 to ignore)
    local img=$1
    local target_width=$2
    local target_height=$3
    local current_dimensions=$(identify -format "%wx%h" "$img")
    local current_width=${current_dimensions%x*}
    local current_height=${current_dimensions#*x}

    if [[ $target_width -ne -1 && $current_width -gt $target_width ]]; then
        echo "  - $img: resizing to ${target_width}x$target_height"
        echo "    Current dimensions: $current_dimensions"
        echo "    Target dimensions: ${target_width}x${target_height}"
        return 0
    fi

    if [[ $target_height -ne -1 && $current_height -gt $target_height ]]; then
        echo "  - $img: resizing to ${target_width}x$target_height"
        echo "    Current dimensions: $current_dimensions"
        echo "    Target dimensions: ${target_width}x${target_height}"
        return 0
    fi

    return 1
}
    }

    echo "> Resizing index background image..."
    index_bg="img/index-bg*"
    for img in $index_bg; do
        if needs_resizing $img -1 1350; then
            convert $img -resize x1350\> $img > /dev/null;
        fi
    done

    echo "> Resizing intro background image..."
    intro_bg="img/intro-bg*"
    for img in $intro_bg; do
        if needs_resizing $img 1920 1080; then
            convert $img -resize 1920x1080\> $img > /dev/null;
        fi
    done

    echo "> Resizing logos..."
    for img in img/logo*; do
        if [[ $img == *.svg ]]; then
            continue
        fi
        if needs_resizing $img 512 512; then
            convert $img -resize 512x512\> $img > /dev/null;
        fi
    done

    echo "> Resizing info panels..."
    for img in img/*-top.* img/*-bottom.*; do
        if needs_resizing $img -1 372; then
            convert $img -resize x372 $img > /dev/null;
        fi
    done

    echo "> Resizing activity images..."
    for activity in "${ACTIVITIES[@]}"; do
        path="img/$activity*";
        if needs_resizing $path -1 389; then
            convert $path -resize x389 $path > /dev/null;
        fi
    done

    echo "> Resizing quiz images..."
    for img in jeux/quiz/img/*; do
        if needs_resizing $img 600 600; then
            convert $img -resize 600x600\> $img > /dev/null;
        fi
    done

    echo "> Resizing blindtest images..."
    for img in jeux/blindtest/img/*; do
        if needs_resizing $img 600 600; then
            convert $img -resize 600x600\> $img > /dev/null;
        fi
    done

    echo "> Resizing 7differences images..."
    for img in jeux/7differences/img/*; do
        if needs_resizing $img 1026 1026; then
            convert $img -resize 1026x1026\> $img > /dev/null;
        fi
    done
}

# Function to optimise images
optimise_images() {
    echo "Optimizing images... (this may take a while)"
    
    echo "> Optimizing JPEG images..."
    find . -type f -iname '*.jpg' -exec sh -c '
        jpegtran -copy none -optimise -perfect -outfile /tmp/optimised.jpg {} > /dev/null
        if [ $(stat -c%s "/tmp/optimised.jpg") -lt $(stat -c%s "{}") ]; then
            printf "  - {}: optimised\n" >&2
            printf "    Original size:  $(stat -c%s "{}") bytes\n" >&2
            printf "    Optimised size: $(stat -c%s "/tmp/optimised.jpg") bytes\n" >&2
            mv /tmp/optimised.jpg {} > /dev/null
        fi
    ' \;
    find . -type f -iname '*.jpeg' -exec sh -c '
        jpegtran -copy none -optimise -perfect -outfile /tmp/optimised.jpeg {} > /dev/null
        if [ $(stat -c%s "/tmp/optimised.jpeg") -lt $(stat -c%s "{}") ]; then
            printf "  - {}: optimised\n" >&2
            printf "    Original size:  $(stat -c%s "{}") bytes\n" >&2
            printf "    Optimised size: $(stat -c%s "/tmp/optimised.jpeg") bytes\n" >&2
            mv /tmp/optimised.jpeg {} > /dev/null
        fi
    ' \;
    
    echo "> Optimizing PNG images..."
    find . -type f -iname '*.png' -exec sh -c '
        cp {} /tmp/original.png
        oxipng -q -o max -s -a --fast -Z -r /tmp/original.png > /dev/null
        if [ $(stat -c%s "/tmp/original.png") -lt $(stat -c%s "{}") ]; then
            printf "  - {}: optimised\n" >&2
            printf "    Original size:  $(stat -c%s "{}") bytes\n" >&2
            printf "    Optimised size: $(stat -c%s "/tmp/original.png") bytes\n" >&2
            mv /tmp/original.png {} > /dev/null
        fi
    ' \;
    
    echo "> Optimizing SVG images..."
    find . -type f -iname '*.svg' -exec sh -c '
        svgo -o /tmp/optimised.svg -i {} > /dev/null
        if [ $(stat -c%s "/tmp/optimised.svg") -lt $(stat -c%s "{}") ]; then
            printf "  - {}: optimised\n" >&2
            printf "    Original size:  $(stat -c%s "{}") bytes\n" >&2
            printf "    Optimised size: $(stat -c%s "/tmp/optimised.svg") bytes\n" >&2
            mv /tmp/optimised.svg {} > /dev/null
        fi
    ' \;
}

# Main script
if [[ $1 == "-h" || $1 == "--help" ]]; then
    echo "Usage: ./optimise-images.sh [OPTION]"
    echo "Optimise all images in the project by resizing them to the correct dimensions and losslessly compressing them."
    echo "Options:"
    echo "  -i, --install  Install dependencies (imagemagick, libjpeg-progs, oxipng [cargo], svgo [npm])"
    exit 0
fi

if [[ $1 == "-i" || $1 == "--install" ]]; then
    install_dependencies
fi

check_executables
resize_images
optimise_images
