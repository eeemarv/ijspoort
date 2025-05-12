"use strict";

import fs from 'fs';
import { Buffer } from 'buffer';

class SPIDevice {
  constructor(device = '/dev/spidev0.0') {
    this.fd = fs.openSync(device, 'r+');
  }

  transferSync(txBuffer) {
    const rxBuffer = Buffer.alloc(txBuffer.length);
    fs.writeSync(this.fd, txBuffer);
    fs.readSync(this.fd, rxBuffer);
    return rxBuffer;
  }

  close() {
    fs.closeSync(this.fd);
  }
}

export { SPIDevice };
