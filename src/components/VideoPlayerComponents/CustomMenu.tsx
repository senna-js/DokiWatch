import { Tooltip, Menu } from "@vidstack/react"
import { SettingsIcon } from "@vidstack/react/icons"
import { QualitySubmenu } from "./QualitySubmenu"
import { CaptionsSubmenu } from "./CaptionsSubmenu"
import { SpeedSubmenu } from "./SpeedSubmenu"
import { SrcSubmenu } from "./SrcSubmenu"

export const CustomMenu = (props: CustomMenuProps) => (
    <Menu.Root className="vds-menu">
        <Tooltip.Root >
            <Tooltip.Trigger asChild className="vds-tooltip-trigger">
                <Menu.Button className="vds-menu-button vds-button" aria-label="Settings">
                    <SettingsIcon className="vds-rotate-icon vds-icon" />
                </Menu.Button>
            </Tooltip.Trigger>
            <Tooltip.Content className="vds-tooltip-content">
                Settings
            </Tooltip.Content>
        </Tooltip.Root >
        <Menu.Items className="vds-menu-items" placement="top" offset={0}>
            {
                <>
                    <QualitySubmenu />
                    <CaptionsSubmenu />
                    <SpeedSubmenu />
                    <SrcSubmenu streamType={props.trueStreamType} setStreamType={(streamType: StreamType) => props.setStreamType(streamType)} hasDub={props.hasDub} />
                </>
            }
        </Menu.Items>
    </Menu.Root>

)

interface CustomMenuProps {
    trueStreamType: StreamType;
    setStreamType: (streamType: StreamType) => void;
    hasDub: boolean;
}

enum StreamType {
    sub,
    dub
}