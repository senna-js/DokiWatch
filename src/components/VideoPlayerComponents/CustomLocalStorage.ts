import { LocalMediaStorage, SerializedVideoQuality } from "@vidstack/react";

const INVALIDATE_TIME = 7 * 24 * 60 * 60 * 1000; // 7 days

interface timeObject {
  time: number;
  invalidateTime: number;
}

type timeData = { [key: string]: timeObject };

const getStorageObject = (key: string, subKey: string) => {
  const storage = localStorage.getItem(key);
  return storage ? JSON.parse(storage)[subKey] : null;
};

const setStorageObject = (key: string, subKey: string, value: any) => {
  const storage = localStorage.getItem(key);
  const storageObj = storage ? JSON.parse(storage) : {};
  storageObj[subKey] = value;
  localStorage.setItem(key, JSON.stringify(storageObj));
};

const isTimeObject = (timeObj: unknown): timeObj is timeObject => {
  if (typeof timeObj !== "object") return false;
  if (!timeObj) return false;
  if (!("time" in timeObj) || typeof timeObj["time"] !== "number") return false;
  if (
    !("invalidateTime" in timeObj) ||
    typeof timeObj["invalidateTime"] !== "number"
  )
    return false;
  return true;
};

const cleanTimeObject = (key: string) => {
  const timeDataObject = getStorageObject(key, "time") || {};
  const newtimeDataObject: timeData = {};

  for (const epId in timeDataObject) {
    const timeData: unknown = timeDataObject[epId];
    // console.log(timeObj)
    if (typeof timeData === "number") {
      const timeObj: timeObject = {
        time: timeData,
        invalidateTime: Date.now() + INVALIDATE_TIME,
      };
      newtimeDataObject[epId] = timeObj;
    }

    if (!isTimeObject(timeData)) continue;

    if (timeData.invalidateTime > Date.now()) {
      newtimeDataObject[epId] = timeData;
    }
  }

  setStorageObject(key, "time", newtimeDataObject);
};

export class CustomLocalStorage extends LocalMediaStorage {
  private key: string;
  private epId: string;

  constructor(key: string, epId: string) {
    super();
    this.key = key;
    this.epId = epId;
    cleanTimeObject(this.key);
  }

  clearCurrentEpisodeTime (): Promise<void> {
    const timeObj: timeData = getStorageObject(this.key, "time") || {};
  
    if (timeObj[this.epId]) delete timeObj[this.epId];
    setStorageObject(this.key, "time", timeObj);
    return Promise.resolve();
  }

  getVolume(): Promise<number | null> {
    const volume = getStorageObject(this.key, "volume");
    return Promise.resolve(volume);
  }
  setVolume(volume: number): Promise<void> {
    setStorageObject(this.key, "volume", volume);
    return Promise.resolve();
  }
  getMuted(): Promise<boolean | null> {
    const muted = getStorageObject(this.key, "muted");
    return Promise.resolve(muted);
  }
  setMuted(muted: boolean): Promise<void> {
    setStorageObject(this.key, "muted", muted);
    return Promise.resolve();
  }
  getPlaybackRate(): Promise<number | null> {
    const playbackRate = getStorageObject(this.key, "playbackRate");
    return Promise.resolve(playbackRate);
  }
  setPlaybackRate(rate: number): Promise<void> {
    setStorageObject(this.key, "playbackRate", rate);
    return Promise.resolve();
  }
  getVideoQuality(): Promise<SerializedVideoQuality | null> {
    const videoQuality = getStorageObject(this.key, "videoQuality");
    return Promise.resolve(videoQuality);
  }
  setVideoQuality(videoQuality: SerializedVideoQuality): Promise<void> {
    setStorageObject(this.key, "videoQuality", videoQuality);
    return Promise.resolve();
  }
  getLang(): Promise<string | null> {
    const lang = getStorageObject(this.key, "lang");
    return Promise.resolve(lang);
  }

  setLang(lang: string): Promise<void> {
    setStorageObject(this.key, "lang", lang);
    return Promise.resolve();
  }
  getCaptions(): Promise<boolean | null> {
    const captions = getStorageObject(this.key, "captions");
    return Promise.resolve(captions);
  }

  setCaptions(enabled: boolean): Promise<void> {
    setStorageObject(this.key, "captions", enabled);
    return Promise.resolve();
  }

  getAudioGain(): Promise<number | null> {
    const audioGain = getStorageObject(this.key, "audioGain");
    return Promise.resolve(audioGain);
  }

  setAudioGain(gain: number): Promise<void> {
    setStorageObject(this.key, "audioGain", gain);
    return Promise.resolve();
  }
  getTime(): Promise<number | null> {
    const time: { [key: string]: timeObject } =
      getStorageObject(this.key, "time") || {};
    return Promise.resolve(time[this.epId].time || 0);
  }
  private debounce = false;
  setTime(time: number, ended: boolean): Promise<void> {
    if (ended) {
      const timeObj: timeData = getStorageObject(this.key, "time") || {};
      delete timeObj[this.epId];
      setStorageObject(this.key, "time", timeObj);
      return Promise.resolve();
    }
    if (this.debounce) return Promise.resolve();
    const timeObj: timeData = getStorageObject(this.key, "time") || {};

    timeObj[this.epId] = { time, invalidateTime: Date.now() + INVALIDATE_TIME };
    setStorageObject(this.key, "time", timeObj);

    this.debounce = true;
    setTimeout(() => {
      this.debounce = false;
    }, 5000);
    return Promise.resolve();
  }
}
