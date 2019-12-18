import * as io from "socket.io-client";

export class RecognizerConfig {
    public ioConnect(): void {
        io.connect("http://192.168.50.86:3000");
    }
}
