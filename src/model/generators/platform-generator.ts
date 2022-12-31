import * as xiaomiMiioTemplate from "./platform_templates/xiaomiMiio.json";
import * as krzysztofHajdamowiczMiio2Template from "./platform_templates/KrzysztofHajdamowicz_miio2.json";
import * as marotowebViomiseTemplate from "./platform_templates/marotoweb_viomise.json";
import * as rand256ValetudoReTemplate from "./platform_templates/rand256_valetudo_re.json";
import * as sendCommandTemplate from "./platform_templates/send-command.json";
import * as alOneHassXiaomiMiotTemplate from "./platform_templates/al-one_hass-xiaomi-miot.json";
import * as tykarolViomiVacuumV8Template from "./platform_templates/tykarol_viomi_vacuum_v8.json";
import * as hypferValetudoTemplate from "./platform_templates/hypfer_valetudo.json";
import * as neatoTemplate from "./platform_templates/neato.json";
import * as roombaTemplate from "./platform_templates/roomba.json";
import * as setupDecimalTemplate from "./platform_templates/setup_decimal.json";
import * as setupIntegerTemplate from "./platform_templates/setup_integer.json";
import * as dreameVacuumTemplate from "./platform_templates/send-command.json";
import { MapModeConfig, PlatformTemplate, TileFromAttributeTemplate, TileFromSensorTemplate } from "../../types/types";
import { HomeAssistant } from "custom-card-helpers";
import { compare } from "compare-versions";
import { SelectionType } from "../map_mode/selection-type";

export class PlatformGenerator {
    public static XIAOMI_MIIO_PLATFORM = "default";
    public static KRZYSZTOFHAJDAMOWICZ_MIIO2_PLATFORM = "KrzysztofHajdamowicz/miio2";
    public static MAROTOWEB_VIOMISE_PLATFORM = "marotoweb/viomise";
    public static RAND256_VALETUDO_RE_PLATFORM = "rand256/ValetudoRE";
    public static SEND_COMMAND_PLATFORM = "send_command";
    public static ALONE_XIAOMI_MIOT_PLATFORM = "al-one/hass-xiaomi-miot";
    public static TYKAROL_VIOMI_VACUUM_V8_PLATFORM = "tykarol/viomi-vacuum-v8";
    public static HYPFER_VALETUDO_PLATFORM = "Hypfer/Valetudo";
    public static NEATO_PLATFORM = "Neato";
    public static ROOMBA_PLATFORM = "Roomba";
    public static SETUP_INTEGER_PLATFORM = "Setup integer";
    public static SETUP_DECIMAL_PLATFORM = "Setup decimal";
    public static DREAME_VACUUM_PLATFORM = "Dreame Vacuum";
    
    private static DOCUMENTATION_URL_FORMAT =
        "https://github.com/PiotrMachowski/lovelace-xiaomi-vacuum-map-card/tree/master/docs/templates/{0}.md";

    private static TEMPLATES = new Map<string, PlatformTemplate>([
        [PlatformGenerator.XIAOMI_MIIO_PLATFORM, xiaomiMiioTemplate as PlatformTemplate],
        [PlatformGenerator.KRZYSZTOFHAJDAMOWICZ_MIIO2_PLATFORM, krzysztofHajdamowiczMiio2Template],
        [PlatformGenerator.MAROTOWEB_VIOMISE_PLATFORM, marotowebViomiseTemplate],
        [PlatformGenerator.TYKAROL_VIOMI_VACUUM_V8_PLATFORM, tykarolViomiVacuumV8Template],
        [PlatformGenerator.HYPFER_VALETUDO_PLATFORM, hypferValetudoTemplate],
        [PlatformGenerator.RAND256_VALETUDO_RE_PLATFORM, rand256ValetudoReTemplate as PlatformTemplate],
        [PlatformGenerator.SEND_COMMAND_PLATFORM, sendCommandTemplate],
        [PlatformGenerator.ALONE_XIAOMI_MIOT_PLATFORM, alOneHassXiaomiMiotTemplate],
        [PlatformGenerator.NEATO_PLATFORM, neatoTemplate],
        [PlatformGenerator.ROOMBA_PLATFORM, roombaTemplate],
        [PlatformGenerator.SETUP_INTEGER_PLATFORM, setupIntegerTemplate],
        [PlatformGenerator.SETUP_DECIMAL_PLATFORM, setupDecimalTemplate],
        [PlatformGenerator.DREAME_VACUUM_PLATFORM, dreameVacuumTemplate],
    ]);

    private static TEMPLATE_DOCUMENTATIONS_URLS = new Map<string, string>([
        [PlatformGenerator.XIAOMI_MIIO_PLATFORM, "xiaomiMiio"],
        [PlatformGenerator.KRZYSZTOFHAJDAMOWICZ_MIIO2_PLATFORM, "krzysztofHajdamowiczMiio2"],
        [PlatformGenerator.MAROTOWEB_VIOMISE_PLATFORM, "marotowebViomise"],
        [PlatformGenerator.RAND256_VALETUDO_RE_PLATFORM, "rand256ValetudoRe"],
        [PlatformGenerator.SEND_COMMAND_PLATFORM, "sendCommand"],
        [PlatformGenerator.ALONE_XIAOMI_MIOT_PLATFORM, "alOneHassXiaomiMiot"],
        [PlatformGenerator.TYKAROL_VIOMI_VACUUM_V8_PLATFORM, "tykarolViomiVacuumV8"],
        [PlatformGenerator.HYPFER_VALETUDO_PLATFORM, "hypferValetudo"],
        [PlatformGenerator.NEATO_PLATFORM, "neato"],
        [PlatformGenerator.ROOMBA_PLATFORM, "roomba"],
        [PlatformGenerator.SETUP_INTEGER_PLATFORM, "setup"],
        [PlatformGenerator.SETUP_DECIMAL_PLATFORM, "setup"],
        [PlatformGenerator.DREAME_VACUUM_PLATFORM, "dreameVacuum"],
    ]);

    public static getPlatforms(): string[] {
        return Array.from(PlatformGenerator.TEMPLATES.keys());
    }

    public static getPlatformsDocumentationUrl(platform: string): string {
        const file =
            PlatformGenerator.TEMPLATE_DOCUMENTATIONS_URLS.get(platform) ??
            PlatformGenerator.TEMPLATE_DOCUMENTATIONS_URLS.get(PlatformGenerator.XIAOMI_MIIO_PLATFORM) ??
            "";
        return PlatformGenerator.DOCUMENTATION_URL_FORMAT.replace("{0}", file);
    }

    public static isValidModeTemplate(platform: string, template?: string): boolean {
        return (
            template !== undefined &&
            Object.keys(this.getPlatformTemplate(platform).map_modes.templates).includes(template)
        );
    }

    public static getModeTemplate(platform: string, template: string): MapModeConfig {
        return this.getPlatformTemplate(platform).map_modes.templates[template];
    }

    public static generateDefaultModes(platform: string): MapModeConfig[] {
        return this.getPlatformTemplate(platform).map_modes.defaultTemplates.map(dt => ({ template: dt }));
    }

    public static getTilesFromAttributesTemplates(platform: string): TileFromAttributeTemplate[] {
        return this.getPlatformTemplate(platform).tiles.from_attributes ?? [];
    }

    public static getTilesFromSensorsTemplates(platform: string): TileFromSensorTemplate[] {
        return this.getPlatformTemplate(platform).tiles.from_sensors ?? [];
    }

    public static usesSensors(hass: HomeAssistant, platform: string): boolean {
        const sensorsFrom = this.getPlatformTemplate(platform).sensors_from;
        if (sensorsFrom) {
            return compare(hass.config.version.replace(/\.*[a-z].*/, ""), sensorsFrom, ">=");
        }
        return false;
    }

    public static getRoomsTemplate(platform: string): string | undefined {
        const platformTemplate = this.getPlatformTemplate(platform);
        for (const templateName in platformTemplate.map_modes.templates) {
            const template = platformTemplate.map_modes.templates[templateName];
            if (template.selection_type === SelectionType[SelectionType.ROOM]) {
                return templateName;
            }
        }
        return undefined;
    }

    private static getPlatformTemplate(platform: string): PlatformTemplate {
        return (
            this.TEMPLATES.get(platform) ??
            this.TEMPLATES.get(this.XIAOMI_MIIO_PLATFORM) ??
            ({
                templates: [],
                defaultTemplates: {},
            } as unknown as PlatformTemplate)
        );
    }
}
