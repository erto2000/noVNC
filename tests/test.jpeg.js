const expect = chai.expect;

import Websock from '../core/websock.js';
import Display from '../core/display.js';

import JPEGDecoder from '../core/decoders/jpeg.js';

import FakeWebSocket from './fake.websocket.js';

function testDecodeRect(decoder, x, y, width, height, data, display, depth) {
    let sock;

    sock = new Websock;
    sock.open("ws://example.com");

    sock.on('message', () => {
        decoder.decodeRect(x, y, width, height, sock, display, depth);
    });

    // Empty messages are filtered at multiple layers, so we need to
    // do a direct call
    if (data.length === 0) {
        decoder.decodeRect(x, y, width, height, sock, display, depth);
    } else {
        sock._websocket._receiveData(new Uint8Array(data));
    }

    display.flip();
}

describe('JPEG Decoder', function () {
    let decoder;
    let display;

    before(FakeWebSocket.replace);
    after(FakeWebSocket.restore);

    beforeEach(function () {
        decoder = new JPEGDecoder();
        display = new Display(document.createElement('canvas'));
        display.resize(4, 4);
    });

    it('should handle JPEG rects', function (done) {
        let data = [
            // JPEG data
            0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46,
            0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x01, 0x2c,
            0x01, 0x2c, 0x00, 0x42, 0xff, 0xdb, 0x00, 0x43,
            0x00, 0x03, 0x02, 0x02, 0x03, 0x02, 0x02, 0x03,
            0x03, 0x03, 0x03, 0x04, 0x03, 0x03, 0x04, 0x05,
            0x08, 0x05, 0x05, 0x04, 0x04, 0x05, 0x0a, 0x07,
            0x07, 0x06, 0x08, 0x0c, 0x0a, 0x0c, 0x0c, 0x0b,
            0x0a, 0x0b, 0x0b, 0x0d, 0x0e, 0x12, 0x10, 0x0d,
            0x0e, 0x11, 0x0e, 0x0b, 0x0b, 0x10, 0x16, 0x10,
            0x11, 0x13, 0x14, 0x15, 0x15, 0x15, 0x0c, 0x0f,
            0x17, 0x18, 0x16, 0x14, 0x18, 0x12, 0x14, 0x15,
            0x14, 0xff, 0xdb, 0x00, 0x43, 0x01, 0x03, 0x04,
            0x04, 0x05, 0x04, 0x05, 0x09, 0x05, 0x05, 0x09,
            0x14, 0x0d, 0x0b, 0x0d, 0x14, 0x14, 0x14, 0x14,
            0x14, 0x14, 0x14, 0x14, 0x14, 0x14, 0x14, 0x14,
            0x14, 0x14, 0x14, 0x14, 0x14, 0x14, 0x14, 0x14,
            0x14, 0x14, 0x14, 0x14, 0x14, 0x14, 0x14, 0x14,
            0x14, 0x14, 0x14, 0x14, 0x14, 0x14, 0x14, 0x14,
            0x14, 0x14, 0x14, 0x14, 0x14, 0x14, 0x14, 0x14,
            0x14, 0x14, 0x14, 0x14, 0x14, 0x14, 0xff, 0xc0,
            0x00, 0x11, 0x08, 0x00, 0x04, 0x00, 0x04, 0x03,
            0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11,
            0x01, 0xff, 0xc4, 0x00, 0x1f, 0x00, 0x00, 0x01,
            0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
            0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09,
            0x0a, 0x0b, 0xff, 0xc4, 0x00, 0xb5, 0x10, 0x00,
            0x02, 0x01, 0x03, 0x03, 0x02, 0x04, 0x03, 0x05,
            0x05, 0x04, 0x04, 0x00, 0x00, 0x01, 0x7d, 0x01,
            0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12, 0x21,
            0x31, 0x41, 0x06, 0x13, 0x51, 0x61, 0x07, 0x22,
            0x71, 0x14, 0x32, 0x81, 0x91, 0xa1, 0x08, 0x23,
            0x42, 0xb1, 0xc1, 0x15, 0x52, 0xd1, 0xf0, 0x24,
            0x33, 0x62, 0x72, 0x82, 0x09, 0x0a, 0x16, 0x17,
            0x18, 0x19, 0x1a, 0x25, 0x26, 0x27, 0x28, 0x29,
            0x2a, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3a,
            0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4a,
            0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a,
            0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a,
            0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a,
            0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89, 0x8a,
            0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99,
            0x9a, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6, 0xa7, 0xa8,
            0xa9, 0xaa, 0xb2, 0xb3, 0xb4, 0xb5, 0xb6, 0xb7,
            0xb8, 0xb9, 0xba, 0xc2, 0xc3, 0xc4, 0xc5, 0xc6,
            0xc7, 0xc8, 0xc9, 0xca, 0xd2, 0xd3, 0xd4, 0xd5,
            0xd6, 0xd7, 0xd8, 0xd9, 0xda, 0xe1, 0xe2, 0xe3,
            0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xf1,
            0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9,
            0xfa, 0xff, 0xc4, 0x00, 0x1f, 0x01, 0x00, 0x03,
            0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
            0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
            0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09,
            0x0a, 0x0b, 0xff, 0xc4, 0x00, 0xb5, 0x11, 0x00,
            0x02, 0x01, 0x02, 0x04, 0x04, 0x03, 0x04, 0x07,
            0x05, 0x04, 0x04, 0x00, 0x01, 0x02, 0x77, 0x00,
            0x01, 0x02, 0x03, 0x11, 0x04, 0x05, 0x21, 0x31,
            0x06, 0x12, 0x41, 0x51, 0x07, 0x61, 0x71, 0x13,
            0x22, 0x32, 0x81, 0x08, 0x14, 0x42, 0x91, 0xa1,
            0xb1, 0xc1, 0x09, 0x23, 0x33, 0x52, 0xf0, 0x15,
            0x62, 0x72, 0xd1, 0x0a, 0x16, 0x24, 0x34, 0xe1,
            0x25, 0xf1, 0x17, 0x18, 0x19, 0x1a, 0x26, 0x27,
            0x28, 0x29, 0x2a, 0x35, 0x36, 0x37, 0x38, 0x39,
            0x3a, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49,
            0x4a, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59,
            0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69,
            0x6a, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79,
            0x7a, 0x82, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88,
            0x89, 0x8a, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97,
            0x98, 0x99, 0x9a, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6,
            0xa7, 0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4, 0xb5,
            0xb6, 0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3, 0xc4,
            0xc5, 0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xd2, 0xd3,
            0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda, 0xe2,
            0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea,
            0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9,
            0xfa, 0xff, 0xda, 0x00, 0x0c, 0x03, 0x01, 0x00,
            0x02, 0x11, 0x03, 0x11, 0x00, 0x3f, 0x00, 0xf9,
            0xf7, 0xfb, 0x67, 0x56, 0xff, 0x00, 0x9f, 0xf8,
            0x3f, 0xf0, 0x51, 0xa7, 0xff, 0x00, 0xf2, 0x3d,
            0x7e, 0x6f, 0xfd, 0xab, 0x94, 0x7f, 0xd0, 0x9a,
            0x8f, 0xfe, 0x0d, 0xc7, 0x7f, 0xf3, 0x61, 0xfd,
            0xa7, 0xff, 0x00, 0x10, 0x77, 0x0d, 0xff, 0x00,
            0x43, 0xec, 0xcf, 0xff, 0x00, 0x0b, 0xab, 0x1f,
            0xff, 0xd9,
        ];

        testDecodeRect(decoder, 0, 0, 4, 4, data, display, 24);

        let targetData = new Uint8Array([
            0xff, 0x00, 0x00, 255, 0xff, 0x00, 0x00, 255, 0xff, 0x00, 0x00, 255, 0xff, 0x00, 0x00, 255,
            0x00, 0xff, 0x00, 255, 0x00, 0xff, 0x00, 255, 0x00, 0xff, 0x00, 255, 0x00, 0xff, 0x00, 255,
            0x00, 0x00, 0xff, 255, 0x00, 0x00, 0xff, 255, 0x00, 0x00, 0xff, 255, 0x00, 0x00, 0xff, 255,
            0xff, 0x00, 0x00, 255, 0xff, 0x00, 0x00, 255, 0xff, 0x00, 0x00, 255, 0xff, 0x00, 0x00, 255
        ]);

        // Browsers have rounding errors, so we need an approximate
        // comparing function
        function almost(a, b) {
            let diff = Math.abs(a - b);
            return diff < 5;
        }

        display.onflush = () => {
            expect(display).to.have.displayed(targetData, almost);
            done();
        };
        display.flush();
    });

    it('should handle JPEG rects without Huffman and quantification tables', function (done) {
        let data1 = [
            // JPEG data
            0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46,
            0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x01, 0x2c,
            0x01, 0x2c, 0x00, 0x42, 0xff, 0xdb, 0x00, 0x43,
            0x00, 0x03, 0x02, 0x02, 0x03, 0x02, 0x02, 0x03,
            0x03, 0x03, 0x03, 0x04, 0x03, 0x03, 0x04, 0x05,
            0x08, 0x05, 0x05, 0x04, 0x04, 0x05, 0x0a, 0x07,
            0x07, 0x06, 0x08, 0x0c, 0x0a, 0x0c, 0x0c, 0x0b,
            0x0a, 0x0b, 0x0b, 0x0d, 0x0e, 0x12, 0x10, 0x0d,
            0x0e, 0x11, 0x0e, 0x0b, 0x0b, 0x10, 0x16, 0x10,
            0x11, 0x13, 0x14, 0x15, 0x15, 0x15, 0x0c, 0x0f,
            0x17, 0x18, 0x16, 0x14, 0x18, 0x12, 0x14, 0x15,
            0x14, 0xff, 0xdb, 0x00, 0x43, 0x01, 0x03, 0x04,
            0x04, 0x05, 0x04, 0x05, 0x09, 0x05, 0x05, 0x09,
            0x14, 0x0d, 0x0b, 0x0d, 0x14, 0x14, 0x14, 0x14,
            0x14, 0x14, 0x14, 0x14, 0x14, 0x14, 0x14, 0x14,
            0x14, 0x14, 0x14, 0x14, 0x14, 0x14, 0x14, 0x14,
            0x14, 0x14, 0x14, 0x14, 0x14, 0x14, 0x14, 0x14,
            0x14, 0x14, 0x14, 0x14, 0x14, 0x14, 0x14, 0x14,
            0x14, 0x14, 0x14, 0x14, 0x14, 0x14, 0x14, 0x14,
            0x14, 0x14, 0x14, 0x14, 0x14, 0x14, 0xff, 0xc0,
            0x00, 0x11, 0x08, 0x00, 0x04, 0x00, 0x04, 0x03,
            0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11,
            0x01, 0xff, 0xc4, 0x00, 0x1f, 0x00, 0x00, 0x01,
            0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
            0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09,
            0x0a, 0x0b, 0xff, 0xc4, 0x00, 0xb5, 0x10, 0x00,
            0x02, 0x01, 0x03, 0x03, 0x02, 0x04, 0x03, 0x05,
            0x05, 0x04, 0x04, 0x00, 0x00, 0x01, 0x7d, 0x01,
            0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12, 0x21,
            0x31, 0x41, 0x06, 0x13, 0x51, 0x61, 0x07, 0x22,
            0x71, 0x14, 0x32, 0x81, 0x91, 0xa1, 0x08, 0x23,
            0x42, 0xb1, 0xc1, 0x15, 0x52, 0xd1, 0xf0, 0x24,
            0x33, 0x62, 0x72, 0x82, 0x09, 0x0a, 0x16, 0x17,
            0x18, 0x19, 0x1a, 0x25, 0x26, 0x27, 0x28, 0x29,
            0x2a, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3a,
            0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4a,
            0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a,
            0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a,
            0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a,
            0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89, 0x8a,
            0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99,
            0x9a, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6, 0xa7, 0xa8,
            0xa9, 0xaa, 0xb2, 0xb3, 0xb4, 0xb5, 0xb6, 0xb7,
            0xb8, 0xb9, 0xba, 0xc2, 0xc3, 0xc4, 0xc5, 0xc6,
            0xc7, 0xc8, 0xc9, 0xca, 0xd2, 0xd3, 0xd4, 0xd5,
            0xd6, 0xd7, 0xd8, 0xd9, 0xda, 0xe1, 0xe2, 0xe3,
            0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xf1,
            0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9,
            0xfa, 0xff, 0xc4, 0x00, 0x1f, 0x01, 0x00, 0x03,
            0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
            0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
            0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09,
            0x0a, 0x0b, 0xff, 0xc4, 0x00, 0xb5, 0x11, 0x00,
            0x02, 0x01, 0x02, 0x04, 0x04, 0x03, 0x04, 0x07,
            0x05, 0x04, 0x04, 0x00, 0x01, 0x02, 0x77, 0x00,
            0x01, 0x02, 0x03, 0x11, 0x04, 0x05, 0x21, 0x31,
            0x06, 0x12, 0x41, 0x51, 0x07, 0x61, 0x71, 0x13,
            0x22, 0x32, 0x81, 0x08, 0x14, 0x42, 0x91, 0xa1,
            0xb1, 0xc1, 0x09, 0x23, 0x33, 0x52, 0xf0, 0x15,
            0x62, 0x72, 0xd1, 0x0a, 0x16, 0x24, 0x34, 0xe1,
            0x25, 0xf1, 0x17, 0x18, 0x19, 0x1a, 0x26, 0x27,
            0x28, 0x29, 0x2a, 0x35, 0x36, 0x37, 0x38, 0x39,
            0x3a, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49,
            0x4a, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59,
            0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69,
            0x6a, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79,
            0x7a, 0x82, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88,
            0x89, 0x8a, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97,
            0x98, 0x99, 0x9a, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6,
            0xa7, 0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4, 0xb5,
            0xb6, 0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3, 0xc4,
            0xc5, 0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xd2, 0xd3,
            0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda, 0xe2,
            0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea,
            0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9,
            0xfa, 0xff, 0xda, 0x00, 0x0c, 0x03, 0x01, 0x00,
            0x02, 0x11, 0x03, 0x11, 0x00, 0x3f, 0x00, 0xf9,
            0xf7, 0xfb, 0x67, 0x56, 0xff, 0x00, 0x9f, 0xf8,
            0x3f, 0xf0, 0x51, 0xa7, 0xff, 0x00, 0xf2, 0x3d,
            0x7e, 0x6f, 0xfd, 0xab, 0x94, 0x7f, 0xd0, 0x9a,
            0x8f, 0xfe, 0x0d, 0xc7, 0x7f, 0xf3, 0x61, 0xfd,
            0xa7, 0xff, 0x00, 0x10, 0x77, 0x0d, 0xff, 0x00,
            0x43, 0xec, 0xcf, 0xff, 0x00, 0x0b, 0xab, 0x1f,
            0xff, 0xd9,
        ];

        testDecodeRect(decoder, 0, 0, 4, 4, data1, display, 24);

        display.fillRect(0, 0, 4, 4, [128, 128, 128, 255]);

        let data2 = [
            // JPEG data
            0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46,
            0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x01, 0x2c,
            0x01, 0x2c, 0x00, 0x73, 0xff, 0xc0, 0x00, 0x11,
            0x08, 0x00, 0x04, 0x00, 0x04, 0x03, 0x01, 0x11,
            0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01, 0xff,
            0xda, 0x00, 0x0c, 0x03, 0x01, 0x00, 0x02, 0x11,
            0x03, 0x11, 0x00, 0x3f, 0x00, 0xf9, 0xf7, 0xfb,
            0x67, 0x56, 0xff, 0x00, 0x9f, 0xf8, 0x3f, 0xf0,
            0x51, 0xa7, 0xff, 0x00, 0xf2, 0x3d, 0x7e, 0x6f,
            0xfd, 0xab, 0x94, 0x7f, 0xd0, 0x9a, 0x8f, 0xfe,
            0x0d, 0xc7, 0x7f, 0xf3, 0x61, 0xfd, 0xa7, 0xff,
            0x00, 0x10, 0x77, 0x0d, 0xff, 0x00, 0x43, 0xec,
            0xcf, 0xff, 0x00, 0x0b, 0xab, 0x1f, 0xff, 0xd9,
        ];

        testDecodeRect(decoder, 0, 0, 4, 4, data2, display, 24);

        let targetData = new Uint8Array([
            0xff, 0x00, 0x00, 255, 0xff, 0x00, 0x00, 255, 0xff, 0x00, 0x00, 255, 0xff, 0x00, 0x00, 255,
            0x00, 0xff, 0x00, 255, 0x00, 0xff, 0x00, 255, 0x00, 0xff, 0x00, 255, 0x00, 0xff, 0x00, 255,
            0x00, 0x00, 0xff, 255, 0x00, 0x00, 0xff, 255, 0x00, 0x00, 0xff, 255, 0x00, 0x00, 0xff, 255,
            0xff, 0x00, 0x00, 255, 0xff, 0x00, 0x00, 255, 0xff, 0x00, 0x00, 255, 0xff, 0x00, 0x00, 255
        ]);

        // Browsers have rounding errors, so we need an approximate
        // comparing function
        function almost(a, b) {
            let diff = Math.abs(a - b);
            return diff < 5;
        }

        display.onflush = () => {
            expect(display).to.have.displayed(targetData, almost);
            done();
        };
        display.flush();
    });
});
