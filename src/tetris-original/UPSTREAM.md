# React Tetris source

Based on [chvin/react-tetris](https://github.com/chvin/react-tetris) at commit
`89435b72f127b67f95870c515a130cbff38fd7cf` (Apache-2.0, as declared in
the upstream `package.json`). The original interface, controls, scoring table,
randomizer, and `music.mp3` are retained.

Local changes: Reset starts at Level 1; Web Audio resumes after an input gesture;
touch controls use pointer events and suppress long-press selection; the original
number sprite is bundled; Ghost and consecutive line-clear bonuses are added.
The combo bonus is 50 points for the second consecutive clearing placement,
100 for the third, and so on. A placement without a line clear resets the combo.

Run `npm ci --legacy-peer-deps` and `npm run build` from this directory. Copy
the generated files in `docs/` into the website's `tetris/` directory, keeping
`tetris/LICENSE.txt` and the original source link. The website's Jekyll config
excludes `src/`, so these development files are not published as site pages.
