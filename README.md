# QRKit

Free, private QR code tools that run entirely in your browser. No sign-ups — everything is processed on your device.

## Tools

| Tool | Description |
|------|-------------|
| [CodeRead — QR & barcode reader](coderead.html) | Read QR codes and barcodes (EAN, UPC, Code 128, Code 39, ITF and more) from your camera, a photo, or an image file. Decodes and formats links, JSON, Wi-Fi, contacts, payments and more on-device. Keeps a private scan history. |
| [Lens — QR Scanner](lens.html) | A minimal live QR scanner with scan history and bookmarks, all stored locally in your browser. Auto-starts the camera on the scan view. |
| [SGQR Generator](sgqr/) | Generate SGQR (Singapore Quick Response) payment payloads for PayNow, DBS PayLah! and other Singapore e-wallets. Includes a small SGQR payload library ([generate-sgqr.js](sgqr/generate-sgqr.js)). |

## Features

- 100% client-side — camera frames, images and scans never leave your device
- Scan history and bookmarks persisted in `localStorage`
- Installable as a PWA (`manifest.webmanifest` + service worker where provided)
- Dark/light themes, mobile-friendly layouts

## Run locally

Plain static HTML files — serve the folder with any static server:

```bash
cd qrkit
python3 -m http.server 8000
```

Then open http://localhost:8000/coderead.html (or lens.html, or sgqr/).

Camera access requires a secure context — use HTTPS or `localhost`. Scanning from image files also works when opening the HTML directly.

## Deploy to GitHub Pages

1. Create a new repository and push this folder's contents.
2. Enable **Pages** in repo settings (Deploy from branch → `main` / root).
3. Pages are served at `https://<user>.github.io/<repo>/` — e.g. `.../coderead.html`, `.../lens.html`, `.../sgqr/`.

Note: camera scanning will only work over HTTPS — GitHub Pages provides this automatically. Opening `file://` directly still allows image-file scanning.

## Structure

```
qrkit/
├── README.md             # This file
├── coderead.html         # CodeRead: QR & barcode reader
├── lens.html             # Lens: live QR scanner with history/bookmarks
├── manifest.webmanifest  # PWA manifest (CodeRead + Lens)
├── sw.js                 # Service worker (offline support)
├── icon.svg              # App icon
└── sgqr/
    ├── index.html           # SGQR generator UI
    ├── manifest.webmanifest # SGQR PWA manifest
    ├── generate-sgqr.js     # SGQR payload library
    └── readme.md            # SGQR library usage docs
```

## License

MIT
