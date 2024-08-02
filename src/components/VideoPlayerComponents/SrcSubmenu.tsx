import { Menu } from "@vidstack/react"
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon } from "@vidstack/react/icons"
enum StreamType {
  sub,
  dub
}

export const SrcSubmenu = (props: SrcSubmenuProps) => {
  const currentStreamType = ["Sub", "Dub"][props.streamType]
  return (
    <Menu.Root>
      <Menu.Button className="vds-menu-item">
        <ChevronLeftIcon className="vds-menu-close-icon" />
        <span className="vds-menu-item-icon">{"Stream Type"}</span>
        <span className="vds-menu-item-hint">{currentStreamType}</span>
        <ChevronRightIcon className="vds-menu-open-icon" />
      </Menu.Button>

      <Menu.Content className="vds-menu-items h-20">

        <Menu.RadioGroup className="vds-radio-group h-48" value={currentStreamType}>

          <Menu.Radio className="vds-radio" value={"Sub"} onSelect={() => props.setStreamType(StreamType.sub)} key={"Sub"}>
            <CheckIcon className="vds-icon" />
            <span className="vds-radio-label">{"Sub"}</span>
          </Menu.Radio>
          {props.hasDub &&
            <Menu.Radio className="vds-radio" value={"Dub"} onSelect={() => props.setStreamType(StreamType.dub)} key={"Dub"}>
              <CheckIcon className="vds-icon" />
              <span className="vds-radio-label">{"Dub"}</span>
            </Menu.Radio>
          }
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  )
}

interface SrcSubmenuProps {
  streamType: StreamType,
  setStreamType: (streamType: StreamType) => void
  hasDub: boolean
}