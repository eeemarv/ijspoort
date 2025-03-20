import rpio from 'rpio';

const rtest = () => {

rpio.spiBegin();
rpio.spiChipSelect(0);                  /* Use CE0 */
rpio.spiSetCSPolarity(0, rpio.LOW);
rpio.spiSetClockDivider(128);           /*  128 == 1.95MHz */
rpio.spiSetDataMode(0);

var tx = Buffer.from([0x03, 0x08, 0x08, 0x08]);
var rx = Buffer.alloc(4);
var i, j = 0;

console.log('-- spi test ---');

for (i = 0; i < 128; i++) {
        tx[1] = i;
        rpio.spiTransfer(tx, rx, 4);
        for (j = 0; j < 4; j++){
                console.log('tx ' + tx[j]);
                console.log('rx ' + rx[j]);
        }
        console.log(' -- ' + i);
}
rpio.spiEnd();
};

export { rtest };
