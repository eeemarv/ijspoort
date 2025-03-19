import rpio from 'rpio';

const run_rtest = () => {

rpio.spiBegin();
rpio.spiChipSelect(0);                  /* Use CE0 */
rpio.spiSetCSPolarity(0, rpio.LOW);
rpio.spiSetClockDivider(128);           /*  128 == 1.95MHz */
rpio.spiSetDataMode(0);

var tx = Buffer.from([0x3, 0x0, 0x0, 0x0]);
var rx = Buffer.alloc(4);
var out;
var i, j = 0;

for (i = 0; i < 128; i++, ++j) {
        tx[1] = i;
        rpio.spiTransfer(tx, rx, 4);
        out = ((rx[2] << 1) | (rx[3] >> 7));
        process.stdout.write(out.toString(16) + ((j % 16 == 0) ? '\n' : ' '));
}
rpio.spiEnd();
};

export { rtest };
