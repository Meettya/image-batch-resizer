# image-batch-resizer

CLI script for asynchronous batch image resizing.

## Description:

This script asynchronously resizes image files, recursively searching for images in selected directory.

It relies on ImageMagick's ``convert`` functionality.

## Install:

    npm install image-batch-resizer -g

Before using ``image-batch-resizer`` you MUST install the ImageMagick suite and have the ``convert`` binary present!


For Mac OS X with installed ``brew`` 

    brew install imagemagick
    
For any other distrubution: Install ImageMagick according to your system's package management guidelines.

## Usage:

    $ image-batch-resizer -d ./image_dir

![](http://github.com/Meettya/image-batch-resizer/raw/master/screenshot.png) 

Calling without any arguments will show usage information

    $ image-batch-resizer 

    Image batch resizer v.0.7.7

    This script asynchronously resizes image files, recursively searching for images in selected directory.
    Usage: image-batch-resizer -d [start directory]

    Options:
      -d, --dir, --directory      Directory to start recursive search                 [required]
      -p, --prefix                Prefix for resized images                           [default: "res_"]
      -R, --remove-original-file  Remove original file after conversion ("yes"|"no")  [default: "no"]
      -s, --size                  New image size (add ">" to prevent upscale)         [default: "1920x1080>"]
      -w, --workers               Number of workers (parallel jobs)                   [default: "auto"]

### Size property:

Any valid ImageMagick geometry argument form may be used at "size" property (see ImageMagick [Image Geometry](http://www.imagemagick.org/script/command-line-processing.php#geometry)).

In default settings used ">" postfix:

  > `width`x`height>`  Shrinks images with dimension(s) larger than the corresponding `width` and/or `height` dimension(s).

If you would change --size - don`t forget about right postfix! 

## Thanks:

Thanks to [portsnap](https://github.com/portsnap) for grammatical errors fix.

Thanks to [soldair](https://github.com/soldair) for [node-walkdir](https://github.com/soldair/node-walkdir) - it really works on large directories.

## Develop:

Classes docs available at /docs folder
