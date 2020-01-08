"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var io = require("socket.io-client");
var ss = require("../js/socket.io-stream");
var recorder_1 = require("./recorder");
var DeepSpeech = /** @class */ (function () {
    function DeepSpeech() {
    }
    DeepSpeech.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, input, err_1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 4, , 5]);
                                    this.socket = io.connect("http://192.168.50.86:3000");
                                    this.context = new AudioContext();
                                    _a = this;
                                    return [4 /*yield*/, this.getMediaStream()];
                                case 1:
                                    _a.stream = _b.sent();
                                    if (!(this.context.state == "suspended")) return [3 /*break*/, 3];
                                    return [4 /*yield*/, this.resumeAudioContext()];
                                case 2:
                                    _b.sent();
                                    _b.label = 3;
                                case 3:
                                    input = this.context.createMediaStreamSource(this.stream);
                                    this.recorder = new recorder_1.default(input, {
                                        numChannels: 1,
                                    });
                                    console.log("recorder....", this.recorder);
                                    resolve();
                                    return [3 /*break*/, 5];
                                case 4:
                                    err_1 = _b.sent();
                                    reject(err_1);
                                    return [3 /*break*/, 5];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    DeepSpeech.prototype.recordAudio = function () {
        this.recorder.clear();
        this.recorder.record();
    };
    DeepSpeech.prototype.stopAudio = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                _this.recorder.stop();
                _this.recorder.exportWAV(function (blob) {
                    var stream = ss.createStream();
                    ss(_this.socket).emit('audio', stream);
                    ss.createBlobReadStream(blob).pipe(stream);
                    ss(_this.socket).on('sttresult', function (stream, data) {
                        if (!stream || data.err) {
                            reject('Issue at DeepSpeech side');
                        }
                        else {
                            resolve(data.text);
                        }
                    });
                });
            }
            catch (err) {
                // console.log("error...",err);
                reject(err);
            }
        });
    };
    DeepSpeech.prototype.getMediaStream = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stream, constraints, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        stream = null;
                        constraints = {
                            audio: true,
                            echoCancellation: true,
                            noiseSuppression: true
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, navigator.mediaDevices.getUserMedia(constraints)];
                    case 2:
                        stream = _a.sent();
                        return [2 /*return*/, stream];
                    case 3:
                        err_2 = _a.sent();
                        throw err_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DeepSpeech.prototype.resumeAudioContext = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.context.resume().then(function () {
                // console.log('Playback resumed successfully');
                resolve();
            }).catch(function (err) {
                //   console.log("resumeAudioContext error",err)
                reject(err);
            });
        });
    };
    return DeepSpeech;
}());
exports.DeepSpeech = DeepSpeech;

//# sourceMappingURL=DeepSpeech.js.map
