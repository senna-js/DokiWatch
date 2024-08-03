import { Menu } from "@vidstack/react"
import { FastForwardIcon } from "@vidstack/react/icons"

export const SkipButtons = (props: SkipButtonProps) => {
    if (!props.loadSkipButton)
        return null;
    return (
        <Menu.Root className="vds-menu" >
            <Menu.Button className="vds-menu-button vds-button w-28 ml-2 border border-white bg-transparent hover:bg-white hover:text-blue-200 transition-colors duration-300" onClick={props.handleSkip} aria-label="SKIP INTRO/OUTRO">
                <span className="vds-menu-item-label m-1 text-nowrap font-poppins text-orange-300">{props.skipText}</span>
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