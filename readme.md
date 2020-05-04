
# @kwsites/cms-images

Extensions for working with images in an  [apostrophe](https://apostrophecms.org/) backed application.

## What you get

This module includes an 'improve' to the
[apostrophe-images](https://docs.apostrophecms.org/apostrophe/modules/apostrophe-images) and
[apostrophe-images-widgets](https://docs.apostrophecms.org/apostrophe/modules/apostrophe-images-widgets)
modules.

### apostrophe-images

- Adds support for tag filtering in the image manage / search dialog. Enabled by default but can
  be disabled by setting `apostrophe-images: { showTagFilter: false }`

### apostrophe-images-widgets

- Gallery mode image re-ordering with drag & drop: when showing a gallery of images, drag the
  thumbnails to re-order the images. (Disable with `apostrophe-images-widgets: { enableRouteReorder: false }`)
- Gallery expanded mode image re-focusing: when showing the expanded view of a single image from
  a gallery, allows for setting the focal point of the image by clicking in the image without needing
  to launch the image editor. (Disable with `apostrophe-images-widgets: { enableRouteFocalPoint: false }`)
- Adds support for layout selection based on the number of images chosen.

## How to include it

Install with `npm i @kwsites/cms-images` or `yarn add @kwsites/cms-images`.

Ensure your application also has a dependency on [@kwsites/cms-common](https://github.com/kwsites/cms-common),
which provides the less plugins used by this library to generate its theme.

Add the usual import to your `app.js`:

```
apostrophe({
   modules: {

      '@kwsites/cms-common': {},
      '@kwsites/cms-images': {},

   }
});
```

## Post-Install

At the time of publishing, [Apostrophe CMS](https://apostrophecms.org/) doesn't automatically support `@scoped/` dependency modules,
which causes an error when the CMS starts up and is unable to symlink the source of the modules into the `/public` folder correctly.

To resolve this, you need to manually create the directory `/public/modules/@kwsites` before starting the server. To have this run
automatically after installing dependencies, add the following to your `package.json` `scripts` block:

```json
{
  "scripts": {
    "postinstall": "mkdir -p ./public/modules/@kwsites"
  }
}
```


