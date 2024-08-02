import { Menu } from "@vidstack/react"
import { FastForwardIcon } from "@vidstack/react/icons"

export const SkipButtons = (props: SkipButtonProps) => {
    if(!props.loadSkipButton)
        return null;
    return (
        <Menu.Root className="vds-menu" >
            <Menu.Button className="vds-menu-button vds-button w-28 ml-2" onClick={props.handleSkip} aria-label="Skip Intro/Outro">
                <span className="vds-menu-item-label m-1 text-nowrap text-orange-500">{props.skipText}</span>
                <FastForwardIcon className="vds-icon" />
            </Menu.Button>
        </Menu.Root >
    )
}

interface SkipButtonProps {
    handleSkip: () => void;
    skipText: string;
    loadSkipButton: boolean;
}