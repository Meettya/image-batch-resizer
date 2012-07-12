
# image-batch-resizer

CLI script for asynchronous batch image resizing.

## Description:

This script asynchronous convert image files, recursing walking deeply from selected directory.

Use ImageMagick ``convert`` inside.

## Install:

    npm install image-batch-resizer -g

! Before usage ``image-batch-resizer`` you MUST install ImageMagick binary !

For Mac OS with installed ``brew`` 

    brew install imagemagick

or find your way

## Usage:

    $ image-batch-resizer -d ./image_dir

![](http://github.com/Meettya/image-batch-resizer/raw/master/screenshot.png) 

Void call show help information

    $ image-batch-resizer 

    Image batch resizer v.0.5.9

    Convert image files, recursing walking deeply from selected directory.
    Usage: image-batch-resizer -d [start directory]

    Options:
      -d, --dir, --directory      Directory to start recursing walking             [required]
      -p, --prefix                Prefix for resized images                        [default: "res_"]
      -R, --remove-original-file  Remove original file after convert ("yes"|"no")  [default: "no"]
      -s, --size                  Size for image resizing                          [default: "1920x1080"]
      -w, --workers               Workers number(parallel jobs)                    [default: "2"]



