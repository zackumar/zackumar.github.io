# @newspaper_snippets

> February 16th, 2021

Hi, again 👋!

I've been working on a one-day build lately that I thought was pretty interesting and I wanted to write down the thought process and go over it with y'all.

## A Little Overview

So, recently, I have built an Instagram bot that posts snippets of newspapers from exactly 100 years ago. Hence the name: newspaper_snippets! Here's what its jobs are:

-   Downloads a newspaper and converts it into a JPG.
-   Finds a good focal point (though not all of them are the greatest)
-   Crops an image with the size of 1024 by 1024 (Max 1:1 size for Instagram)
-   Posts in on Instagram at [@newspaper_snippets](https://www.instagram.com/newspaper_snippets/).

So let's get into it and I'll describe the project. I don't have any pictures to add at the moment to help with the flow of this entry, but I'll add some when I can.

## Where the Newspapers at?

So the most important job of the whole bot is to first find newspapers from exactly 100 years ago. Where do we start? There are a surprising amount of sites that allow you to do this, but I decided to use [Chronicling America by the Library of Congress](https://chroniclingamerica.loc.gov/). The Library of Congress has a very cool selection of things to look at, but Chronicling America has to be the top pick for me. So. Back to the topic at hand. First, we download a newspaper from their site. This required scraping and finding a JSON file that houses the links for newspapers of a given date range. Once you find that, you can access the link to download the PDF scan of the newspaper. Pretty cool right? I thought I'd have to use something like Puppeteer (or I guess pyppeteer because I decided to use Python), but the JSON file that the site uses internally for its newspaper carousel came in very handy. Something like this:

    https://chroniclingamerica.loc.gov/frontpages/2020-10-22.json

The link is simple, it’s the base URL `https://chroniclingamerica.loc.gov/frontpages/` with the date plus the `.json` extension. Then you get all the newspapers from that date. We choose a random one and a random page of that newspaper and done. Cool huh 😊?

Ok! So we have a PDF. What do we do now? Sadly, one of the defining features of this project was to use Python's OpenCV package, or cv2, but that requires images and cannot accept PDFs. So we have to convert it. Gladly, there is a package called pdf2image that will do all the dirty work for us. All you have to do is import it and convert it.

    from pdf2image import convert_from_path

    images = convert_from_path('pathToImage')
    for i in range(len(images)):
        image.save('image-' + str(i)  + '.jpg', 'JPEG')

Using `convert_from_path`, pdf2image converts each page of the pdf into a single image of the same scale. We use this to convert our large single-page PDFs into a single image to use with CV2.

## No One Wants Just Text!

Now let's find focal points. No one wants an image of just text--though some of the next _is_ pretty interesting to read. For this, we'll use `opencv-python`. It's great because it has all of the things we need to both find the image, but also process and crop it for Instagram.

First, we have to import it. And that's pretty simple.

    import cv2

I didn't implement and a big thing to find focal points like blob detection or anything as I still wanted this to be a simple one-day build. So the next best thing was to find boxes. The nice thing about newspapers, and especially old ones. Things that weren't text were bordered off with boxes, so that makes things especially easy.

To get started you need to read in your image and convert it to grayscale, clean it up a bit, then invert it.

    img = cv2.imread('tempImage.jpg')
    gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)

    retval, thresh = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)
    invert = 255-thresh

Next is to find the boxes! I use a series of kernels along with erosion and dilation to find vertical lines, then horizontal.

    vertical_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, kernel_length))
    vertical_erosion = cv2.erode(invert, vertical_kernel, iterations = 3)
    vertical_dilate=cv2.dilate(vertical_erosion, vertical_kernel, iterations = 3)

    horizontal_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (kernel_length, 1))
    horizontal_erosion = cv2.erode(invert, horizontal_kernel, iterations = 3)
    horizontal_dilate=cv2.dilate(horizontal_erosion, horizontal_kernel, iterations = 3)

Then, you can combine them together then invert them again.

    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    alpha = 0.5
    beta = 1.0 - alpha

    combined_lines_weighted = cv2.addWeighted(vertical_dilate, alpha, horizontal_dilate, beta, 0.0)
    combined_lines_erode = cv2.erode(~combined_lines_weighted, kernel, iterations = 3)
    retval, thresh1 = cv2.threshold(combined_lines_erode, 127, 255, cv2.THRESH_BINARY)

    combined_lines = 255-thresh1

This gives a single image with all horizontal and vertical lines combined together. Using this, we can find where they intersect and make boxes! To do this, well use `findContours`.

    contours, hierarchy = cv2.findContours(combined_lines, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

Then using these we can pick a random contour, adjust the bounding boxes to be a 1024 by 1024 image, and crop! You can easily use `numpy` to crop them as `cv2` represents images as arrays.

    cropped_img = img[y1:y2, x1:x2]

## The Grams

Okay. So we got the image. Next is the easy part, though not the cleanest part. I want to clean it up, but I'll explain what's messy along the way.

Now it's time to post the image on Instagram! This is where it gets messy. Instagram **_HATES_** bots. Like with a burning, fiery, destructive passion 🔥. There aren't many libraries that allow you to post on Instagram and the public API is limiting. So, my first option is to stick with Python (the cleanest solution) and use one of their libraries. Sadly all of them are not maintained and no longer work. Another option is to use `Pyppeteer`, a python clone of NodeJS's `Puppeteer`. This would allow us to control a web browser and post programmatically. Bad thing is, Instagram doesn't have a way to post through a browser well, not even if emulating the viewport of one. You need the app. Also for some reason, the latest update of pyppeteer AND puppeteer didn't like to use headless chromium and the nightly build of headless firefox it downloaded instead was buggy? But that's beside the point.

So what do we do? I found an npm package called `instagram-web-api` and,surprisingly it works! But it's NodeJS. But I sucked up until I can find another solution and I used that. I just had Python call a terminal command giving the file names and caption as parameters. It's a pretty easy library to use so I won't describe it here. But you log in and post the image. Simple.

## So Bam. We done!

Overall, this was pretty fun. I got to learn a lot of pretty cool things. There are multiple things I would like to fix though. So here is a mini todo list:

-   Better focal point detection. Such as prioritizing better images.
-   Better Instagram integration. May program my own python library.
-   Gain more followers. But it's not too important.

Those are all I can think of right now. But there are probably more.

But thanks for reading! Hope you enjoyed my rambles about this project. And you should check it out on Instagram at [@newspaper_snippets](https://instagram.com/newspaper_snippets) or check out the source code at [Github](https://github.com/zackumar/newspaper_snippets)!

---

**TL;DR**: NEWSPAPER SNIPPETS ARE COOL!!!! <3
