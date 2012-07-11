
# image-bath-resizer

CLI script for asynchronous bath image resizing.

## Description:

This script asynchronous convert image files, recursing walking deeply from selected directory.

Use ImageMagick ``convert`` inside.

## Install:

    npm install image-bath-resizer -g

! Before usage ``image-bath-resizer`` you MUST install ImageMagick binary !

For Mac OS with installed ``brew`` 

    brew install imagemagick

or find your way

## Usage:

    $ image-bath-resizer -d ./image_dir

![](http://github.com/Meettya/image-bath-resizer/raw/master/screenshot.png) 

Void call show help information

    $ ./bin/image-bath-resizer 

    Image bath resizer v.0.4.7

    Convert image files, recursing walking deeply from selected directory.
    Usage: image-bath-resizer -d [start directory]

    Options:
      -d, --dir, --directory  Directory to start recursing walking  [required]
      -p, --prefix            Prefix for resized images             [default: "res_"]
      -s, --size              Size for image resizing               [default: "1920x1080"]
      -w, --workers           Workers number(parallel jobs)         [default: 2]

