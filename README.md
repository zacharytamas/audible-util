# audible-util

This is a command line utility I wrote to expedite the conversion of my
legally purchased Audible books to a more portable format (mp4) and to
split them by chapter. I listen to them in [Overcast](https://overcast.fm/)
with its Smart Speed functionality.

It requires `ffmpeg` to be installed on the system. In my case (macOS) it
is available easily via Brew.

This isn't really intended at this point to be polished and generally
useful, I just found myself doing these things manually all the time and it
was annoying. That said, though, for an experienced developer it should be
pretty easy to make this work for you.

Assuming you have `python` and `ffmpeg`, you can run this pretty quickly:

    yarn install
    yarn main

By default it will look for any `.aax` files in `$HOME/Downloads` and start
working on them all. You must create a `config.json` in the root of this 
project with _at least_ the `activationBytes` key set. This is your 
encryption key from Audible which you must have already determined by 
other means.
