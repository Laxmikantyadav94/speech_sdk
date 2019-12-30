import * as io from "socket.io-client";
import * as ss from "../js/socket.io-stream";

declare var Recorder:any;

export class DeepSpeech {
    protected socket: any;
    protected stream: any;
    protected recorder: any;
    private context: AudioContext; 
    
    public async init(): Promise<any> {
        return new Promise(async (resolve: (value?: {} | PromiseLike<{}> | undefined) => void, reject: (reason?: any) => void) => {
            try {
                await this.loadRecorderJS();
                this.socket = io.connect("http://192.168.50.86:3000");
                this.context = new AudioContext();
                this.stream = await this.getMedia();
                if (this.context.state == "suspended") {
                    await this.resumeAudioContext();
                }
                const input = this.context.createMediaStreamSource(this.stream);
                this.recorder = new Recorder(input, {
                    numChannels: 1,
                  });
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    public recordAudio(): void {
        this.recorder.clear();
        this.recorder.record();
    }

    public stopAudio(): Promise<any> {
        return new Promise((resolve: (value?: {} | PromiseLike<{}> | undefined) => void, reject: (reason?: any) => void) => {
            try {
              
                this.recorder.stop();
                this.recorder.exportWAV((blob) => {
                const stream = ss.createStream();
                ss(this.socket).emit('audio', stream);
                ss.createBlobReadStream(blob).pipe(stream);
                ss(this.socket).on('sttresult', (stream,data) => {
                    if (!stream || data.err) {
                        reject('Issue at DeepSpeech side');
                    } else {
                        resolve(data.text);
                    }
                });
                });
            } catch (err) {
                // console.log("error...",err);
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

    private loadRecorderJS():Promise<any>{
     return new Promise((resolve, reject) => {
       try {
         this.loadScript('https://cdn.rawgit.com/mattdiamond/Recorderjs/08e7abd9/dist/recorder.js', () => {
        //    console.log('recorderJS loaded');
           resolve();
         });
       } catch (err) {
         reject(err);
       }
     });
   }

   private loadScript(url, execFn): void {
     const script = document.createElement('script');
     script.type = 'text/javascript';
     script.src = url;
     if (execFn) {
       script.onload = execFn;
     }
     document.getElementsByTagName('head')[0].appendChild(script);
   }

    private resumeAudioContext():Promise<any> {
        return new Promise((resolve, reject) => {
            this.context.resume().then(() => {
            // console.log('Playback resumed successfully');
            resolve();
          }).catch(err =>{
            //   console.log("resumeAudioContext error",err)
              reject(err);
          });
        });
      }
}
