# Interactive Map Editor

A local-first interactive game map editor built with vanilla HTML, CSS, and JavaScript.

It lets users upload their own map images, place and manage custom markers, track collected items, switch between multiple maps, and back up or restore the entire project without a backend server.

## Features

### Map management
- Upload custom map images
- Manage multiple maps
- Switch, rename, and delete maps
- Pan and zoom the active map
- Reset the map view

### Marker editing
- Create custom markers by clicking a map position
- Edit, duplicate, drag, and delete markers
- Copy marker coordinates
- Display marker details in the sidebar
- Support marker types such as Boss, Chest, and NPC

### Search and progress tracking
- Search markers by name or type
- Filter by marker type, region, and rarity
- Hide collected markers
- Track collected progress per map
- Persist marker and collected state between browser sessions

### Backup and restore
- Export/import collected progress for the current map
- Export/import the complete multi-map project
- Full project backups include:
  - map metadata
  - map images
  - custom markers
  - collected states
  - marker type settings

## Data Storage

The project is local-first and does not require a backend database.

- `localStorage`
  - map metadata
  - custom marker data
  - collected states
  - current map selection
  - marker type settings
- `IndexedDB`
  - uploaded map images

Because data is stored in the browser, clearing browser site data may remove local project data. Use **Export Project** to create a portable backup.

## How to Use

1. Open the application.
2. Click **Upload Map** and select a map image.
3. Give the map a name.
4. Enable **Edit Mode**.
5. Click a position on the map.
6. Enter a marker name and choose its type.
7. Click **Create Marker**.
8. Use the marker tools to edit, duplicate, move, or delete markers.
9. Click markers in normal mode to update collected progress.
10. Use **Export Project** regularly to back up the complete project.

## Run Locally

This project uses `fetch()` to load local JSON files, so running it through a small local web server is recommended instead of opening `index.html` directly with `file://`.

For example, with VS Code you can use the **Live Server** extension and open `index.html`.

Project structure:

```text
InteractiveMap/
├─ index.html
├─ style.css
├─ app.js
├─ data/
│  ├─ items.json
│  └─ markerTypes.json
├─ icons/
└─ images/
```

## Deployment

The application is a static website and can be hosted with GitHub Pages.

Recommended GitHub Pages settings:

```text
Branch: main
Folder: /(root)
```

After GitHub Pages is enabled, the project site is expected to be available at:

```text
https://cpl326.github.io/InteractiveMap/
```

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- LocalStorage
- IndexedDB
- FileReader API

No frontend framework or backend service is required.

## Current Status

The core v1.0 workflow is complete and has been tested for:

- map upload and persistence
- switching between multiple maps
- marker CRUD and dragging
- filtering and search
- collected-state persistence
- map deletion and renaming
- full project export/import restore

## Future Ideas

Possible improvements for later versions:

- User-defined marker types
- Custom marker icons
- Improved mobile layout
- Shareable map/project files
- Cloud sync
- OCR-assisted marker placement

## License

No license has been added yet.
