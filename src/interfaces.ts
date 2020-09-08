import { isNumber } from 'lodash'

interface RectPos {
    top: number;
    left: number;
    bottom: number;
    right: number;
}

interface RenderedVideo {
    timestamp: number;
    data: Buffer | Buffer[];
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface IVideoProperties {
    duration: number;
    timeBase: number[];
    fps: number[];
    width: number;
    height: number;
}

class VideoProperties implements IVideoProperties {
    duration: number
    timeBase: number[]
    fps: number[]
    width: number
    height: number

    constructor(videoProperties: IVideoProperties)

    constructor(duration: number, timeBase?: number[], fps?: number[], width?: number, height?: number)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(duration: any, timeBase?: number[], fps?: number[], width?: number, height?: number) {
        if (isNumber(duration)) {
            if (duration === undefined || timeBase === undefined || fps === undefined || width === undefined || height === undefined) {
                throw new Error('Cannot init class from the provided parameters')
            }
            this.duration = duration
            this.timeBase = timeBase
            this.fps = fps
            this.width = width
            this.height = height
        } else {
            const videoProperties = duration as IVideoProperties
            this.duration = videoProperties.duration
            this.timeBase = videoProperties.timeBase
            this.fps = videoProperties.fps
            this.width = videoProperties.width
            this.height = videoProperties.height
        }
    }

    get unitFrame(): number {
        return this.timeBase[1] *
                this.fps[1] /
                this.timeBase[0] /
                this.fps[0]
    }

    get lastFrame(): number {
        return Math.floor(this.duration / this.unitFrame) - 1
    }
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface ISubtitleInfo {
    startFrame: number;
    endFrame: number;
    texts?: string[];
    startTime?: string;
    endTime?: string;
    box?: Int32Array;
}

class SubtitleInfo implements ISubtitleInfo {
    startFrame: number
    endFrame: number
    texts: string[] = []
    startTime?: string
    endTime?: string
    box?: Int32Array

    constructor(subtitleInfo: ISubtitleInfo)

    constructor(startFrame: number, endFrame?: number)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(startFrame: any, endFrame?: number) {
        if (isNumber(startFrame)) {
            if (startFrame === undefined || endFrame === undefined) {
                throw new Error('Cannot init class from the provided parameters')
            }
            this.startFrame = startFrame
            this.endFrame = endFrame
        } else {
            const subtitleInfo = startFrame as ISubtitleInfo
            this.startFrame = subtitleInfo.startFrame
            this.endFrame = subtitleInfo.endFrame
            this.texts = subtitleInfo.texts === undefined ? [] : subtitleInfo.texts
            this.startTime = subtitleInfo.startTime
            this.endTime = subtitleInfo.endTime
            this.box = subtitleInfo.box
        }
    }

    get text(): string | undefined {
        const freq = {} as Record<string, number>
        let maxFreq = 0
        let maxFreqText = ''
        if (this.texts === undefined || this.texts.length === 0) {
            return undefined
        }
        for (const text of this.texts) {
            freq[text] = text in freq ? freq[text] + 1 : 1
            if (freq[text] > maxFreq) {
                maxFreq = freq[text]
                maxFreqText = text
            }
        }
        return maxFreqText
    }
}

export { RectPos, RenderedVideo, VideoProperties, SubtitleInfo }
