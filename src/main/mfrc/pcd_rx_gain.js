"use strict";

/**
 * Based on https://github.com/miguelbalboa/rfid
 * MFRC522 RxGain[2:0] masks, defines the receiver's signal voltage gain factor (on the PCD).
 * Described in 9.3.3.6 / table 98 of the datasheet at http://www.nxp.com/documents/data_sheet/MFRC522.pdf
 */

export const PCD_RxGain = {
  g18dB: 0x00 << 4,	// 000b - 18 dB, minimum
  g23dB: 0x01 << 4,	// 001b - 23 dB
    //g18dB_2			= 0x02 << 4,	// 010b - 18 dB, it seems 010b is a duplicate for 000b
    //g23dB_2			= 0x03 << 4,	// 011b - 23 dB, it seems 011b is a duplicate for 001b
  g33dB: 0x04 << 4,	// 100b - 33 dB, average, and typical default
  g38dB: 0x05 << 4,	// 101b - 38 dB
  g43dB: 0x06 << 4,	// 110b - 43 dB
  g48dB: 0x07 << 4,	// 111b - 48 dB, maximum
  min: 0x00 << 4,	// 000b - 18 dB, minimum, convenience for g18dB
  avg: 0x04 << 4,	// 100b - 33 dB, average, convenience for g33dB
  max: 0x07 << 4		// 111b - 48 dB, maximum, convenience for g48dB
};