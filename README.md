# Baby အတွက် တောင်းပန်တဲ့ Website 💗

A complete, responsive, Burmese-language interactive apology website inspired by the supplied video.

## How to open

1. Unzip the download.
2. Open `index.html` in Chrome, Safari, or your iPhone browser after deploying it.
3. Tap the pink buttons to read through all seven pages. On page 3, press and hold the angry cartoon to increase the apology counter.

Everything (HTML, CSS, JS, illustrations) is included locally. The only optional external resource is a Google font; if offline, the browser uses its local Myanmar font.

## Customize the Burmese text

Open `index.html` in VS Code and search for `Baby` and `ကိုကို`, then change them to your own names. You can also edit the longer message inside `<article class="letter-paper">`.

- `index.html` — page content and Burmese messages
- `style.css` — colors, layout, mobile responsiveness, and animation
- `script.js` — transitions, buttons, tap-to-apologize, sound, and hearts
- `assets/` — three locally stored custom cartoon illustrations

## Share it with her

For GitHub Pages: upload the files to a GitHub repository (preserving the `assets` folder), open **Settings → Pages → Deploy from a branch → main / root**. Then share the generated URL. You can alternatively drag the entire folder to Netlify Drop.

## Features

- Burmese-first design that works on mobile and desktop
- 7 interactive screens, progress dots, a back button
- Tap/hold apology counter with speech bubbles
- Interactive blue/pink choice buttons
- Long heartfelt letter on a lined paper card
- Heart confetti finale and replay button
- Optional sound (off by default) and reduced-motion support

Note: This is a visually faithful recreation of the overall flow seen in the user-provided video. Some details, images, and exact text are adapted because a screen recording is not the original source code or original design assets.
