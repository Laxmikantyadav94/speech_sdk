import * as RecordRTC from "recordrtc";
import * as io from "socket.io-client";
import * as ss from '../js/socket.io-stream';
// const path = require('path');
//declare var ss: any;

export class RecognizerConfig {
    protected socket: any;
    protected stream: any;
    protected recorder: any;

    public async ioConnect(): Promise<any> {
        return new Promise(async (resolve: (value?: {} | PromiseLike<{}> | undefined) => void, reject: (reason?: any) => void) => {
            try {
                this.socket = io.connect("http://192.168.50.86:3000");
                this.stream = await this.getMedia();
                // await this.socketStream();
                console.log("stream....",this.stream);
                this.recorder = new RecordRTC.StereoAudioRecorder(this.stream, {
                        mimeType: "audio/wav",
                        type: "audio",
                });
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    public recordAudio(): void {
        this.recorder.record();
    }

    public stopAudio(): Promise<any> {
        return new Promise((resolve: (value?: {} | PromiseLike<{}> | undefined) => void, reject: (reason?: any) => void) => {
            try {
              this.recorder.stop((blob: any) => {
                  console.log("blob...",blob);
                this.stream = ss.createStream();
                resolve();

                // ss(this.socket).emit("audio", this.stream);
                // ss.createBlobReadStream(blob).pipe(this.stream);
                // ss(this.socket).on("sttresult", (stream: any , data: any) => {
                //   if (!stream || data.err) {
                //     reject("Issue at DeepSpeech side");
                //   } else {
                //     resolve(data.text);
                //   }
               // });
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

//     private socketStream(): Promise<any>{
//          return new Promise((resolve, reject) => {
//            try {
//             // let pathScript = path.resolve(__dirname, '../js/socket.io-stream.js');
//              this.loadScript('../js/socket.io-stream.js',() => {
//                 console.log('recorderJS loaded');
//                resolve();
//              });
//            } catch (err) {
//              reject(err);
//            }
//          });
//     }

//     private loadScript(url: any, execFn : any) : void {
//         const script = document.createElement('script');
//         script.type = 'text/javascript';
//         script.src = url;
//         // script.async = sync ? sync : 'async';
//         if (execFn) {
//           script.onload = execFn;
//         }
//         document.getElementsByTagName('head')[0].appendChild(script);
//       }
}
