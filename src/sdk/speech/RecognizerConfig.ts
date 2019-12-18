import * as RecordRTC from "recordrtc";
import * as io from "socket.io-client";
import * as ss from "socket.io-stream";

export class RecognizerConfig {
    protected socket: any;
    protected stream: any;
    protected recorder: any;

    public async ioConnect(): Promise<any> {
       this.socket = io.connect("http://192.168.50.86:3000");
       this.stream = await this.getMedia();
       this.recorder = new RecordRTC.StereoAudioRecorder(this.stream, {
            mimeType: "audio/wav",
            type: "audio",
        });
    }

    public recordAudio(): void {
        this.recorder.clear();
        this.recorder.record();
    }

    public stopAudio(): Promise<any> {
        return new Promise((resolve: (value?: {} | PromiseLike<{}> | undefined) => void, reject: (reason?: any) => void) => {
            try {
              this.recorder.stop((blob: any) => {
                const stream = ss.createStream({});
                ss(this.socket, {}).emit("audio", stream);
                ss.createBlobReadStream(blob, {}).pipe(stream);
                ss(this.socket, {}).on("sttresult", (data: any) => {
                  if (data.err) {
                    reject("Issue at DeepSpeech side");
                  } else {
                    resolve(data.text);
                  }
                });
              });
            } catch (err) {
              reject(err);
            }
          });
    }

    private async getMedia(): Promise<any> {
        let stream = null;
        const constraints = { audio: true };
        try {
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            return stream;
        } catch (err) {
            throw err;
        }
    }
}
