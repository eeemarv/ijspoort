# ijspoort

Standalone desktop app voor toegangscontrole met Mifare Classic NFC tags ontwikkeld voor de [Deurnese IJsberen vzw](https://www.deurnese-ijsberen.be). Geschreven in [Electronjs](https://www.electronjs.org), met [Svelte](https://svelte.dev) componenten. [Pouchdb](https://pouchdb.com) database synchroniseert met online Couchdb (CouchDb, Cloudant, Pouchdb). De app werkt offline-first. Dus internet verbinding is geen absolute vereiste. Doch voor de veiligheid is het nodig om altijd verbinding te maken nadat nieuwe data is toegevoegd zodat de nieuwe data niet verloren kan gaan. Leden-data wordt verkregen door leden export vanuit [Assist](https://assistonline.eu). De aangemaakte tags worden gekoppeld aan de lidnummers.

## Modi

Het programma kent twee algemene modi:

* een registratie-modus: om nieuwe tags te initialiseren (aan leden te koppelen), om leden-data in te laden (met xls bestanden vanuit Assist), om toegang met tags te registreren, om manuele toegangs-registratie uit te voeren (zonder tags).
* Een poort modus: enkel voor toegangs-registratie met tags waarbij eventueel een elektrische poort wordt aangestuurd.

## Reguirements

* OS Ubuntu 22.04, 24.04
* NFC tag reader ACR122u
* NFC tag reader MFRC522 (Kiosk modus met Raspberry Pi 4B)

## Dependencies

* ACR122u driver

```bash
sudo apt-get install libnfc-bin
sudo apt-get install pcscd pcsc-tools
```

[Blacklist pre-installed drivers](https://oneguyoneblog.com/2016/11/02/acr122u-nfc-usb-reader-linux-mint/)


```bash
sudo nano /etc/modprobe.d/blacklist.conf
```

Voeg toe aan het einde van dit bestand:

```bash
install nfc /bin/false
install pn533 /bin/false
```

* [nfc-pcsc](https://github.com/pokusew/nfc-pcsc)

```bash
sudo apt-get install libpcsclite1 libpcsclite-dev
sudo apt-get install build-essential
sudo apt-get install gcc
sudo apt-get install gpiod libgpiod2 libgpiod-dev libnode-dev
```

Voor de kiosk-modus met buzzer en MFRC522 Mifare tag lezer moet de user toegang hebben tot
/dev/gpiochipX (buzzer pin) en /dev/spidevO.O (MFRC522).

```bash
sudo groupadd spi
sudo groupadd gpiochip
sudo usermod -aG gpiochip,spi $USER
```

Geef schrijf/lees rechten voor de `spi` en `gpiochip` groepen met udev rules.

```bash
sudo nano /etc/udev/roles.d/90-gpiochip.rules

# /etc/udev/roles.d/90-gpiochip.rules
KERNEL=="gpiochip*", SUBSYSTEM=="gpio", MODE="0660", GROUP="gpiochip"
```

```bash
sudo nano /etc/udev/roles.d/91-spi.rules

# /etc/udev/roles.d/91-spi.rules
SUBSYSTEM=="spidev", GROUP="spi", MODE="0660"
```

Herlaad udev rules en reboot

```bash
sudo udevadm control --reload-rules
sudo udevadm trigger
sudo reboot
```

Check na reboot de rechten.

```bash
> ls -l /dev/spidev*
crw-rw----+ 1 root spi 153, 0 Jun 21 08:30 /dev/spidev0.0
crw-rw----+ 1 root spi 153, 1 Jun 21 08:30 /dev/spidev0.1

> ls -l /dev/gpiochip*
crw-rw----+ 1 root gpiochip 254, 0 Jun 21 08:30 /dev/gpiochip0
crw-rw----  1 root gpiochip 254, 1 Jun 21 08:30 /dev/gpiochip1
```

[Installeer node 22 en npm met nvm (Node Version Manager)](https://github.com/nvm-sh/nvm)

```bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash
# reopen terminal
nvm install 22
```

[Installeer yarn](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable)

```bash
npm install --global yarn
```

Installeer node-gyp

```bash
yarn global add node-gyp
```

Installeer Git

```bash
sudo apt-get install git
```

Download code

```bash
git clone https://github.com/eeemarv/ijspoort
```

```
In de nieuw gecreëerde directory `ijspoort`, installeer node modules

```bash
yarn install
```

Build

```bash
yarn build
```

Start app (dev mode)

```bash
yarn dev
```

Build Linux

```bash
yarn build:linux
```

[Voor mogelijk probleem met node-gyp](https://github.com/electron/rebuild/issues/1116)

```bash
pip install setuptools
# or
python3 -m pip install --break-system-packages setuptools
```

Voor ARM builds (Raspberry Pi, Orange Pi), see [these workarounds](https://www.beekeeperstudio.io/blog/electron-apps-for-arm-and-raspberry-pi)

```bash
export SNAPCRAFT_BUILD_ENVIRONMENT=host
export USE_SYSTEM_FPM=true
yarn run electron-builder --arm64 --armv7l --linux
```

De builds worden gegenereerd in de `dist` directory.
[Voor AppImage is in Ubuntu 22.04 `libfuse2` nodig](https://askubuntu.com/questions/1403811/appimage-on-ubuntu-22-04)

```bash
sudo add-apt-repository universe
sudo apt-get install libfuse2
```

Zie [dot_env_info](./dot_env_info) voor informatie over alle omgevingsvariabelen waarmee de applicatie opgestart wordt, te plaatsen in een `.env` bestand in de zelfde directory als de AppImage.

De applicatie opstarten kan waarschijnlijk enkel [zonder sandbox](https://authmane512.medium.com/solve-the-suid-sandbox-helper-binary-was-found-but-is-not-configured-correctly-3-solutions-4f1425a9a76c).

```bash
cd dist
./ijspoort.AppImage --no-sandbox
```

## MIT license

[MIT license](./LICENSE)
