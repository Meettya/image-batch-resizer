# image-batch-resizer

CLI script for asynchronous batch image resizing.

## Description:

This script asynchronously resizes image files, recursively searching for images in selected directory.

It relies on ImageMagick's ``convert`` functionality.

## Install:

    npm install image-batch-resizer -g

Before using ``image-batch-resizer`` you MUST install the ImageMagick suite and have the convert binary present!
Install ImageMagick according to your system's guidelines, many distributions provide a package manager to do so.

For Mac OS X with installed ``brew`` 

    brew install imagemagick

## Usage:

    $ image-batch-resizer -d ./image_dir

![](http://github.com/Meettya/image-batch-resizer/raw/master/screenshot.png) 

Calling without any arguments will show usage information

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



