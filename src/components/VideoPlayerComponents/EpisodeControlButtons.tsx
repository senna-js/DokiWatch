import { Menu, Tooltip } from "@vidstack/react";
import { NextIcon, PreviousIcon } from "@vidstack/react/icons";

export const EpisodeControlButtons = (props: EpisodeControlButtonsProps) => {
    return (
        <>
            {props.hasPreviousEpisode &&
                <Menu.Root className="vds-menu">
                    <Tooltip.Root>
                        <Tooltip.Trigger asChild className="vds-tooltip-trigger">
                            <Menu.Button className="vds-menu-button vds-button" onSelect={props.handlePreviousEpisode} aria-label="Previous Episode">
                                <PreviousIcon className="vds-icon" />
                            </Menu.Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content className="vds-tooltip-content">
                            Previous Episode
                        </Tooltip.Content>
                    </Tooltip.Root >
                </Menu.Root >
            }
            {
                props.hasNextEpisode &&
                <Menu.Root className="vds-menu">
                    <Tooltip.Root >
                        <Tooltip.Trigger asChild className="vds-tooltip-trigger">
                            <Menu.Button className="vds-menu-button vds-button" onSelect={props.handleNextEpisode} aria-label="Next Episode">
                                <NextIcon className="vds-icon" />
                            </Menu.Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content className="vds-tooltip-content">
                            Next Episode
                        </Tooltip.Content>
                    </Tooltip.Root >
                </Menu.Root>
            }
        </>
    )
}

interface EpisodeControlButtonsProps {
    hasNextEpisode: boolean;
    handleNextEpisode: () => void;
    hasPreviousEpisode: boolean;
    handlePreviousEpisode: () => void;
}