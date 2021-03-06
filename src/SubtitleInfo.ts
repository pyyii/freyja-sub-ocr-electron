import { isNumber, toInteger } from 'lodash'
import { v4 as uuidv4 } from 'uuid'

interface ISubtitleInfo {
    startFrame: number
    endFrame: number
    texts?: Array<string>
    startTime?: string
    endTime?: string
    box?: Int32Array
}

class SubtitleInfo implements ISubtitleInfo {
    startFrame: number
    endFrame: number
    texts: Array<string> = []
    startTime?: string
    endTime?: string
    box?: Int32Array
    id: string
    fps?: number

    constructor(subtitleInfo: ISubtitleInfo)

    constructor(startFrame: number, endFrame?: number)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(startFrame: number | ISubtitleInfo, endFrame?: number) {
        this.id = uuidv4()
        if (isNumber(startFrame)) {
            if (endFrame === undefined) {
                throw new Error('Cannot init class from the provided parameters')
            }
            this.startFrame = startFrame
            this.endFrame = endFrame
        } else {
            const subtitleInfo = startFrame
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
        if (this.texts.length === 0) {
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

    set text(value: string | undefined) {
        if (value !== undefined) {
            this.texts = [value]
        }
    }

    generateTime(fps: number): void {
        this.fps = fps

        let timeInt = Math.floor(this.startFrame * 1000 / fps)
        let timeStruct = new Date(timeInt)
        this.startTime = `${timeStruct.getUTCHours().toString().padStart(2, '0')}:${timeStruct.getUTCMinutes().toString().padStart(2, '0')}:${timeStruct.getUTCSeconds().toString().padStart(2, '0')}.${Math.floor(timeStruct.getUTCMilliseconds() / 10).toString().padStart(2, '0')}`

        timeInt = Math.floor(this.endFrame * 1000 / fps)
        timeStruct = new Date(timeInt)
        this.endTime = `${timeStruct.getUTCHours().toString().padStart(2, '0')}:${timeStruct.getUTCMinutes().toString().padStart(2, '0')}:${timeStruct.getUTCSeconds().toString().padStart(2, '0')}.${Math.floor(timeStruct.getUTCMilliseconds() / 10).toString().padStart(2, '0')}`
    }

    get startTimeValidated(): string | undefined {
        if (this.fps !== undefined) {
            this.generateTime(this.fps)
        }
        return this.startTime
    }

    set startTimeValidated(value: string | undefined) {
        if (value === undefined) {
            this.startTime = undefined
        } else {
            const match = /^(\d{2}):([0-5]\d):([0-5]\d).(\d{2})$/.exec(value)
            if (match) {
                this.startTime = value
                if (this.fps !== undefined) {
                    this.startFrame = Math.round(((toInteger(match[1]) * 60 + toInteger(match[2])) * 60 + toInteger(match[3]) + toInteger(match[4]) / 100) * this.fps)
                }
            }
        }
    }

    get endTimeValidated(): string | undefined {
        if (this.fps !== undefined) {
            this.generateTime(this.fps)
        }
        return this.endTime
    }

    set endTimeValidated(value: string | undefined) {
        if (value === undefined) {
            this.endTime = undefined
        } else {
            const match = /^(\d{2}):([0-5]\d):([0-5]\d).(\d{2})$/.exec(value)
            if (match) {
                this.endTime = value
                if (this.fps !== undefined) {
                    this.endFrame = Math.round(((toInteger(match[1]) * 60 + toInteger(match[2])) * 60 + toInteger(match[3]) + toInteger(match[4]) / 100) * this.fps)
                }
            }
        }
    }
}

export { ISubtitleInfo, SubtitleInfo }
