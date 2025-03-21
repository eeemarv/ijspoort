"use strict";

/**
 * based on https://github.com/miguelbalboa/rfid
 * mfrc522 manual chapter 9
 */

export const PCD_Reg = {
	  // Page 0: Command and status
	  // 0x00			// reserved for future use
	Command: 0x01 << 1,	// starts and stops command execution
	ComIEn: 0x02 << 1,	// enable and disable interrupt request control bits
	DivIEn: 0x03 << 1,	// enable and disable interrupt request control bits
	ComIrq: 0x04 << 1,	// interrupt request bits
	DivIrq:	0x05 << 1,	// interrupt request bits
	Error: 0x06 << 1,	// error bits showing the error status of the last command executed
	Status1: 0x07 << 1,	// communication status bits
	Status2: 0x08 << 1,	// receiver and transmitter status bits
	FIFOData: 0x09 << 1,	// input and output of 64 byte FIFO buffer
	FIFOLevel: 0x0A << 1,	// number of bytes stored in the FIFO buffer
	WaterLevel: 0x0B << 1,	// level for FIFO underflow and overflow warning
	Control: 0x0C << 1,	// miscellaneous control registers
	BitFraming: 0x0D << 1,	// adjustments for bit-oriented frames
	Coll: 0x0E << 1,	// bit position of the first bit-collision detected on the RF interface
		//						  0x0F			// reserved for future use
		// Page 1: Command
		// 						  0x10			// reserved for future use
	Mode: 0x11 << 1,	// defines general mode for transmitting and receiving
	TxMode: 0x12 << 1,	// defines transmission data rate and framing
	RxMode: 0x13 << 1,	// defines reception data rate and framing
	TxControl: 0x14 << 1,	// controls the logical behavior of the antenna driver pins TX1 and TX2
	TxASK: 0x15 << 1,	// controls the setting of the transmission modulation
	TxSel: 0x16 << 1,	// selects the internal sources for the antenna driver
	RxSel: 0x17 << 1,	// selects internal receiver settings
	RxThreshold: 0x18 << 1,	// selects thresholds for the bit decoder
	Demod: 0x19 << 1,	// defines demodulator settings
		// 0x1A	// reserved for future use
		// 0x1B	// reserved for future use
	MfTx: 0x1C << 1,	// controls some MIFARE communication transmit parameters
	MfRx: 0x1D << 1,	// controls some MIFARE communication receive parameters
		// 						  0x1E			// reserved for future use
	SerialSpeed: 0x1F << 1,	// selects the speed of the serial UART interface
    //
		// Page 2: Configuration
		// 						  0x20			// reserved for future use
	CRCResultH: 0x21 << 1,	// shows the MSB and LSB values of the CRC calculation
	CRCResultL: 0x22 << 1,
		// 						  0x23			// reserved for future use
	ModWidth: 0x24 << 1,	// controls the ModWidth setting?
		// 						  0x25			// reserved for future use
	RFCfg: 0x26 << 1,	// configures the receiver gain
	GsN: 0x27 << 1,	// selects the conductance of the antenna driver pins TX1 and TX2 for modulation
	CWGsP: 0x28 << 1,	// defines the conductance of the p-driver output during periods of no modulation
	ModGsP: 0x29 << 1,	// defines the conductance of the p-driver output during periods of modulation
	TMode: 0x2A << 1,	// defines settings for the internal timer
	TPrescaler: 0x2B << 1,	// the lower 8 bits of the TPrescaler value. The 4 high bits are in TModeReg.
	TReloadH: 0x2C << 1,	// defines the 16-bit timer reload value
	TReloadL: 0x2D << 1,
	TCounterValueH: 0x2E << 1,	// shows the 16-bit timer value
	TCounterValueL: 0x2F << 1,
    //
		// Page 3: Test Registers
		// 						  0x30			// reserved for future use
	TestSel1: 0x31 << 1,	// general test signal configuration
	TestSel2: 0x32 << 1,	// general test signal configuration
	TestPinEn: 0x33 << 1,	// enables pin output driver on pins D1 to D7
	TestPinValue: 0x34 << 1,	// defines the values for D1 to D7 when it is used as an I/O bus
	TestBus: 0x35 << 1,	// shows the status of the internal test bus
	AutoTest: 0x36 << 1,	// controls the digital self-test
	Version: 0x37 << 1,	// shows the software version
	AnalogTest: 0x38 << 1,	// controls the pins AUX1 and AUX2
	TestDAC1: 0x39 << 1,	// defines the test value for TestDAC1
	TestDAC2: 0x3A << 1,	// defines the test value for TestDAC2
	TestADC: 0x3B << 1		// shows the value of ADC I and Q channels
		// 						  0x3C			// reserved for production tests
		// 						  0x3D			// reserved for production tests
		// 						  0x3E			// reserved for production tests
		// 						  0x3F			// reserved for production tests
};
