// @ts-check
"use strict";

/**
 * Based on https://github.com/miguelbalboa/rfid
 * Commands sent to the PICC.
 * https://www.nxp.com/docs/en/data-sheet/MFRC522.pdf
 */

const PICC_Cmd = {
		// The commands used by the PCD to manage communication with several PICCs (ISO 14443-3, Type A, section 6.4)
  REQA: 0x26,		// REQuest command, Type A. Invites PICCs in state IDLE to go to READY and prepare for anticollision or selection. 7 bit frame.
  WUPA: 0x52,		// Wake-UP command, Type A. Invites PICCs in state IDLE and HALT to go to READY(*) and prepare for anticollision or selection. 7 bit frame.
  CT: 0x88,		// Cascade Tag. Not really a command, but used during anti collision.
  SEL_CL1: 0x93,		// Anti collision/Select, Cascade Level 1
  SEL_CL2: 0x95,		// Anti collision/Select, Cascade Level 2
  SEL_CL3: 0x97,		// Anti collision/Select, Cascade Level 3
  HLTA: 0x50,		// HaLT command, Type A. Instructs an ACTIVE PICC to go to state HALT.
  RATS: 0xE0,     // Request command for Answer To Reset.
		// The commands used for MIFARE Classic (from http://www.mouser.com/ds/2/302/MF1S503x-89574.pdf, Section 9)
		// Use PCD_MFAuthent to authenticate access to a sector, then use these commands to read/write/modify the blocks on the sector.
		// The read/write commands can also be used for MIFARE Ultralight.
  MF_AUTH_KEY_A: 0x60,		// Perform authentication with Key A
  MF_AUTH_KEY_B: 0x61,		// Perform authentication with Key B
  MF_READ: 0x30,		// Reads one 16 byte block from the authenticated sector of the PICC. Also used for MIFARE Ultralight.
  MF_WRITE: 0xA0,		// Writes one 16 byte block to the authenticated sector of the PICC. Called "COMPATIBILITY WRITE" for MIFARE Ultralight.
  MF_DECREMENT: 0xC0,		// Decrements the contents of a block and stores the result in the internal data register.
  MF_INCREMENT: 0xC1,		// Increments the contents of a block and stores the result in the internal data register.
  MF_RESTORE: 0xC2,		// Reads the contents of a block into the internal data register.
  MF_TRANSFER: 0xB0,		// Writes the contents of the internal data register to a block.
		// The commands used for MIFARE Ultralight (from http://www.nxp.com/documents/data_sheet/MF0ICU1.pdf, Section 8.6)
		// The MF_READ and MF_WRITE can also be used for MIFARE Ultralight.
  UL_WRITE: 0xA2		// Writes one 4 byte page to the PICC.
};

export { PICC_Cmd };