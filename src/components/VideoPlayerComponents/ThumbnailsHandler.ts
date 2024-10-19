const parseVttCueToJson = (cue: string, src: string): VTTJSON | null => {
  if (!cue) return null;
  const [time, image] = cue.split("\n");
  const [startTime, endTime] = time.split(" --> ");
  const [url, pos] = image.split("#xywh=");
  const [x, y, w, h] = pos.split(",").map(Number);

  // Convert time to seconds
  const timeToSeconds = (time: string) => {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const startSeconds = timeToSeconds(startTime);
  const endSeconds = timeToSeconds(endTime);

  // Create JSON object
  const jsonResult = {
    startTime: startSeconds,
    endTime: endSeconds,
    url: `${src}${url}`,
    coords: {
      x: x,
      y: y,
    },
    width: w,
    height: h,
  };

  return jsonResult;
};

const vttToArray = (vtt: string) => {
  const vttArray = vtt
    .split("\n\n")
    .map((cue) => cue.substring(cue.indexOf("\n") + 1).replace(/\n$/, ""));
  vttArray.shift();
  return vttArray;
};

export const VTTtoJSON = (vtt: string, src: string): VTTJSON[] => {
  const vttArray = vttToArray(vtt);
  return vttArray
    .map((vtt) => parseVttCueToJson(vtt, src))
    .filter((item) => item !== null);
};

export interface VTTJSON {
  startTime: number;
  endTime: number;
  url: string;
  coords: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
}
