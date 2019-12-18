import * as io from "socket.io-client";

export class RecognizerConfig {
    socket: any;
    stream: any;

    public async ioConnect(): Promise<any> {
       this.socket= io.connect("http://192.168.50.86:3000");
        this.stream= await this.getMedia();
    }

    public async getMedia(): Promise<any> {
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
