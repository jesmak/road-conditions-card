# Road conditions card

Home Assistant dashboard card for road weather stations. It shows how much grip the road has on a meter, with the
road and air temperature, the road surface, wind, precipitation and visibility.

[![GitHub Release][releases-shield]][releases] [![GitHub Release Date][release-date-shield]][releases] [![HACS][hacs-shield]][hacs] [![License][license-shield]](LICENSE)

<p>
<img src="https://raw.githubusercontent.com/jesmak/road-conditions-card/main/docs/images/one-station-light.png#gh-light-mode-only" width="400" alt="One road weather station in good winter conditions, four of six parts of the meter lit in amber, with its temperatures, snow on the road, wind with gusts, snowfall, visibility and a road weather warning">
<img src="https://raw.githubusercontent.com/jesmak/road-conditions-card/main/docs/images/one-station-dark.png#gh-dark-mode-only" width="400" alt="One road weather station in good winter conditions, four of six parts of the meter lit in amber, with its temperatures, snow on the road, wind with gusts, snowfall, visibility and a road weather warning">
<img src="https://raw.githubusercontent.com/jesmak/road-conditions-card/main/docs/images/stations-light.png#gh-light-mode-only" width="400" alt="Three road weather stations as rows, each with its grip condition and a small meter, one of them very slippery with freezing rain">
<img src="https://raw.githubusercontent.com/jesmak/road-conditions-card/main/docs/images/stations-dark.png#gh-dark-mode-only" width="400" alt="Three road weather stations as rows, each with its grip condition and a small meter, one of them very slippery with freezing rain">
</p>

## What is it?

A custom card for the road weather stations of [Digitraffic Live](https://github.com/jesmak/digitraffic_live), the
integration for Fintraffic's open traffic data in Finland. You pick stations, and the card finds their sensors by
itself.

The grip on the road is the heart of it. Each station's measured friction is graded into six classes, from very
slippery to good grip, and shown on a meter that lights up to the station's class. Around it are the values that
explain it: road and air temperature, what is on the road, wind and its gusts, what is falling from the sky and how
far you can see.

One station fills the card. Several stations get a row each, with the grade and a small meter, so you can see the
roads you drive at a glance before you leave.

It needs Digitraffic Live 1.1.0 or newer, which has the grip condition, wind, precipitation and visibility sensors.

## Installation

### With HACS

1. Add this repository to HACS custom repositories with type **Dashboard**
2. Search for Road conditions card in HACS and download it
3. Refresh your browser

### Manual

1. Take `dist/road-conditions-card.js` from the source code of the [latest release][releases] and copy it to the
   `config/www` folder of your Home Assistant installation
2. In Home Assistant settings, open dashboards, click the three dots at the top right and open resources
3. Add a new resource with the path `/local/road-conditions-card.js` and type JavaScript
4. Refresh your browser

## Options

| Name       | Type   | Default  | Description                                                                     |
| ---------- | ------ | -------- | ------------------------------------------------------------------------------- |
| `type`     | string | required | `custom:road-conditions-card`                                                   |
| `stations` | list   | required | Road weather stations, as device ids or objects with a name. One fills the card |
| `title`    | string |          | Shown at the top of the card                                                    |

Each item of `stations` is a device id, or an object with these keys:

| Name     | Type   | Description                                                                                              |
| -------- | ------ | -------------------------------------------------------------------------------------------------------- |
| `device` | string | The road weather station's device in Digitraffic Live                                                    |
| `name`   | string | Replaces the station's own name, which is long, such as "Road 9 Hillside" for "Road 9 Example, Hillside" |

Everything can be set in the card's visual editor, where the station picker offers only road weather stations.

## What it shows

- **The grip condition** in words, the friction coefficient µ next to it, and the meter. The meter's six parts each
  have their own colour, from red for very slippery to green for good grip. The parts up to the station's class are
  lit in that class's colour, and the rest stay faint in their own.
- **Road and air temperature, road surface and wind.** Gusts are shown in brackets after the mean wind when they
  are at least 3 m/s stronger.
- **Precipitation** as a weather icon and a short word, such as snow, sleet or drizzle. The full description and the
  amount in mm/h are in its tooltip. Freezing drizzle, freezing rain and heavy precipitation are shown in the warning
  colour.
- **Visibility.**
- **The road weather warning**, when the station gives one.

A value the station doesn't measure is left out, so a station without a grip sensor shows no meter, and one without
a present weather sensor shows only whether it rains or snows. Clicking a value opens its sensor.

In the rows of several stations, each row shows the road temperature, the road surface and the wind, the grade with
its small meter, and freezing or heavy precipitation when there is some.

The grip classes follow the Finnish Road Administration's slipperiness classification. Digitraffic Live's README
has the limits.

## Sizes

In a sections view the card takes a whole section by default and can be made as narrow as half of one. Its values
follow the card's width. A narrow card has two to a row, a normal one three, and a card two sections wide has them
all on one row. A value too long for its column wraps rather than being cut.

<img src="https://raw.githubusercontent.com/jesmak/road-conditions-card/main/docs/images/narrow-light.png#gh-light-mode-only" width="250" alt="A very slippery station on a card half a section wide, its values two to a row and freezing rain wrapped onto two lines">
<img src="https://raw.githubusercontent.com/jesmak/road-conditions-card/main/docs/images/narrow-dark.png#gh-dark-mode-only" width="250" alt="A very slippery station on a card half a section wide, its values two to a row and freezing rain wrapped onto two lines">

<img src="https://raw.githubusercontent.com/jesmak/road-conditions-card/main/docs/images/wide-light.png#gh-light-mode-only" width="990" alt="A station with good grip on a card two sections wide, with the meter across the card and all six values on one row">
<img src="https://raw.githubusercontent.com/jesmak/road-conditions-card/main/docs/images/wide-dark.png#gh-dark-mode-only" width="990" alt="A station with good grip on a card two sections wide, with the meter across the card and all six values on one row">

## Colours

The meter's colours can be changed in a theme:

| Variable                                | Default                      |
| --------------------------------------- | ---------------------------- |
| `--road-conditions-very-slippery-color` | `--error-color`, `#db4437`   |
| `--road-conditions-slippery-color`      | `#f4511e`                    |
| `--road-conditions-fair-winter-color`   | `#fb8c00`                    |
| `--road-conditions-good-winter-color`   | `#ffb300`                    |
| `--road-conditions-fair-color`          | `#9ccc65`                    |
| `--road-conditions-good-color`          | `--success-color`, `#43a047` |

## Examples

### One station

```yaml
type: custom:road-conditions-card
stations:
  - 0123456789abcdef0123456789abcdef
```

### The roads to work

```yaml
type: custom:road-conditions-card
title: Road conditions
stations:
  - device: 0123456789abcdef0123456789abcdef
    name: Road 12 Lakeview
  - device: 1123456789abcdef0123456789abcdef
    name: Road 9 Hillside
  - device: 2123456789abcdef0123456789abcdef
    name: Road 3 Riverbend
```

Device ids are easiest to pick in the visual editor.

## Data

The values come from Digitraffic Live's sensors. The card itself fetches nothing. The data is Fintraffic's, from
[digitraffic.fi](https://www.digitraffic.fi/), under the Creative Commons Attribution 4.0 licence.

## Translating

The card's texts are in `src/localize/languages/`, one JSON file per language, named by its language code, such as
`en.json` and `fi.json`. To add a language, copy `en.json` to the new language's code, such as `sv.json`, and
translate the values. Nothing else needs changing. The card finds the file by itself and uses it when Home Assistant
is set to that language. A text left out falls back to English. The sensors' states, such as the grip condition and
the road surface, come from Digitraffic Live's own translations.

## Development

Requires Node 22.13 or newer.

```
npm install
npm run check
```

`npm run check` typechecks, lints, checks formatting, runs the tests and builds `dist/road-conditions-card.js`, which
is the file HACS installs and is committed to the repository.

| Path                          | What it contains                                                          |
| ----------------------------- | ------------------------------------------------------------------------- |
| `src/road-conditions-card.ts` | The card itself                                                           |
| `src/editor.ts`               | The visual editor                                                         |
| `src/stations.ts`             | Finding a station's sensors, and the meter, gusts and precipitation shown |
| `src/const.ts`                | The sensors, grip classes and icons                                       |
| `src/weather-icons.ts`        | The weather glyphs, from Weather Icons                                    |
| `src/localize/languages/`     | The card's texts, one JSON file per language                              |
| `docs/screenshots.json`       | The made-up data the README's screenshots are taken from                  |
| `tests/`                      | Tests, run with vitest                                                    |

## Support

Hey dude! Help me out for a couple of :beers: or a :coffee:!

[![coffee](https://www.buymeacoffee.com/assets/img/custom_images/black_img.png)](https://www.buymeacoffee.com/jesmak)

## Thanks

The weather icons are from [Weather Icons](https://erikflowers.github.io/weather-icons/) by Erik Flowers.

## License

MIT, see [LICENSE](LICENSE). The weather icons are under the SIL Open Font License 1.1, see
[LICENSE-weather-icons](LICENSE-weather-icons).

[releases-shield]: https://img.shields.io/github/release/jesmak/road-conditions-card.svg?style=for-the-badge
[release-date-shield]: https://img.shields.io/github/release-date/jesmak/road-conditions-card?style=for-the-badge
[releases]: https://github.com/jesmak/road-conditions-card/releases
[hacs-shield]: https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge
[hacs]: https://hacs.xyz/docs/faq/custom_repositories/
[license-shield]: https://img.shields.io/github/license/jesmak/road-conditions-card.svg?style=for-the-badge
