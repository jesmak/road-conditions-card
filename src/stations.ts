/** What the card reads from a road weather station: its sensors, found through the device, and what their values mean. */
import {
    FREEZING,
    GRIP_SCALE,
    HEAVY,
    HEAVY_TEXTS,
    GUST_MARGIN,
    PLATFORM,
    PRECIPITATION_ICONS,
    PRECIPITATION_TYPE_ICONS,
    SENSORS,
} from "./const";
import type { SensorKey } from "./const";
import type { HassEntity, HomeAssistant } from "./hass";
import type { StationConfig } from "./types";

/** Stations written as plain device ids become objects, and empty ones are dropped. */
export function stationsOf(stations: Array<string | StationConfig> | undefined): StationConfig[] {
    // A single station written without the list around it is not a configuration the card can read.
    return (Array.isArray(stations) ? stations : [])
        .map((station) => (typeof station === "string" ? { device: station } : station))
        .filter((station) => !!station?.device);
}

/** The station's sensors by what they are. A sensor the station doesn't have is left out. */
export function stationSensors(hass: HomeAssistant, device: string): Partial<Record<SensorKey, string>> {
    const found: Partial<Record<SensorKey, string>> = {};
    for (const entry of Object.values(hass.entities ?? {})) {
        const key = entry?.translation_key as SensorKey | undefined;
        if (entry && entry.device_id === device && entry.platform === PLATFORM && key && SENSORS.includes(key)) {
            found[key] = entry.entity_id;
        }
    }
    return found;
}

/** The road weather stations there are, for the picker. Only a station has a road temperature sensor. */
export function stationDevices(hass: HomeAssistant): string[] {
    const devices = Object.values(hass.entities ?? {})
        .filter((entry) => entry?.platform === PLATFORM && entry.translation_key === "road_temperature" && entry.device_id)
        .map((entry) => entry?.device_id as string);
    return [...new Set(devices)];
}

export function stationName(hass: HomeAssistant, station: StationConfig): string {
    const device = hass.devices?.[station.device];
    return station.name || device?.name_by_user || device?.name || station.device;
}

/** The sensor's state, or nothing when the station doesn't measure it right now. */
export function reading(hass: HomeAssistant, entityId: string | undefined): HassEntity | undefined {
    const entity = entityId ? hass.states[entityId] : undefined;
    return entity && entity.state !== "unknown" && entity.state !== "unavailable" ? entity : undefined;
}

/** Where the condition sits on the scale, from 0 for very slippery to 5 for good grip. */
export function scalePosition(condition: string | undefined): number {
    return (GRIP_SCALE as readonly string[]).indexOf(condition ?? "");
}

/**
 * The scale's parts. Those up to the station's condition are lit in that condition's colour, like a meter; the rest
 * stay faint in their own.
 */
export function scale(condition: string | undefined): Array<{ condition: string; lit: boolean }> {
    const position = scalePosition(condition);
    return GRIP_SCALE.map((part, index) => ({ condition: index <= position ? GRIP_SCALE[position] : part, lit: index <= position }));
}

/** Gusts are worth showing only when they stand out from the mean wind. */
export function showGusts(speed: number, gusts: number | undefined): boolean {
    return gusts !== undefined && gusts - speed >= GUST_MARGIN;
}

/**
 * How precipitation is shown: its icon, the key of its short text, and whether it is worth noting (freezing or heavy).
 * The type, when the station tells it, wins over the amount code; light rain is drawn as showers either way.
 */
export function precipitation(type: string | undefined, code: string | undefined): { icon: string; text?: string; notable: boolean } {
    const heavy = HEAVY.includes(code ?? "");
    if (type && PRECIPITATION_TYPE_ICONS[type]) {
        const icon = type === "rain" && code === "light" ? "wi:showers" : PRECIPITATION_TYPE_ICONS[type];
        const text = (heavy && HEAVY_TEXTS[type]) || type;
        return { icon, text, notable: FREEZING.includes(type) || (heavy && type !== "none") };
    }
    const [icon, text] = (code && PRECIPITATION_ICONS[code]) || ["wi:na", undefined];
    return { icon, text, notable: heavy };
}
