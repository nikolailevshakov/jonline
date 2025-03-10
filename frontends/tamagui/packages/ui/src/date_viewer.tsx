
import { Heading, Tooltip } from "@jonline/ui";
import moment from "moment";

export type DateViewerProps = {
  date?: string
  prefix?: string
  disableTooltip?: boolean
}
export const DateViewer = ({ date, prefix, disableTooltip = false }: DateViewerProps) => {
  if (!date) return <></>;

  const component = <Heading size="$1" marginVertical='auto' mr='$2'>
    {moment.utc(date).local().startOf('seconds').fromNow()}
  </Heading>;

  return disableTooltip
    ? component
    : <Tooltip placement="bottom-start">
      <Tooltip.Trigger>
        {component}
      </Tooltip.Trigger>
      <Tooltip.Content>
        <Heading size='$2'>{prefix != undefined ? `${prefix} ` : ''}{moment.utc(date).local().format("ddd, MMM Do YYYY, h:mm:ss a")}</Heading>
      </Tooltip.Content>
    </Tooltip>;
}
