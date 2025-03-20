# ijspoort

Standalone desktop app voor toegangscontrole met Mifare Classic NFC tags ontwikkeld voor de [Deurnese IJsberen vzw](https://www.deurnese-ijsberen.be). Geschreven in [Electronjs](https://www.electronjs.org), met [Svelte](https://svelte.dev) componenten. [Pouchdb](https://pouchdb.com) database synchroniseert met online Couchdb (CouchDb, Cloudant, Pouchdb). De app werkt offline-first. Dus internet verbinding is geen absolute vereiste. Doch voor de veiligheid is het nodig om altijd verbinding te maken nadat nieuwe data is toegevoegd zodat de nieuwe data niet verloren kan gaan. Leden-data wordt verkregen door leden export vanuit [Assist](https://assistonline.eu). De aangemaakte tags worden gekoppeld aan de lidnummers.

Het programma kent twee algemene modi:

* een registratie-modus: om nieuwe tags te initialiseren (aan leden te koppelen), om leden-data in te laden (met xls bestanden vanuit Assist), om toegang met tags te registreren, om manuele toegangs-registratie uit te voeren (zonder tags).
* Een poort modus: enkel voor toegangs-registratie met tags waarbij eventueel een elektrische poort wordt aangestuurd.

Reguirements:
* OS Ubuntu 22.04, 24.04
* NFC tag reader ACR122u
* NFC tag reader MFRC522 (poort modus met Raspberry Pi 4B)

Dependencies:
* ACR122u driver:
```
sudo apt-get install libnfc-bin
sudo apt-get install pcscd pcsc-tools
```
[Blacklist pre-installed drivers](https://oneguyoneblog.com/2016/11/02/acr122u-nfc-usb-reader-linux-mint/)

```
sudo nano /etc/modprobe.d/blacklist.conf
```
Voeg toe aan het einde van dit bestand:
```
install nfc /bin/false
install pn533 /bin/false
```

```
* [nfc-pcsc](https://github.com/pokusew/nfc-pcsc)
```
sudo apt-get install libpcsclite1 libpcsclite-dev
sudo apt-get install build-essential
sudo apt-get install gcc

```

Voor de poort-modus, aansturing door een Raspberry Pi 4B([Info](https://askubuntu.com/questions/1230947/gpio-for-raspberry-pi-gpio-group)):

```
sudo apt-get install rpi.gpio-common
sudo adduser <user> dialout
sudo reboot
```
[Installeer node 22 en npm met nvm (Node Version Manager)](https://github.com/nvm-sh/nvm)
```
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash
# reopen terminal
nvm install 22
```
[Installeer yarn](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable)
```
npm install --global yarn
```
Installeer Git
```
sudo apt-get install git
```

Download code:
```
git clone https://github.com/eeemarv/ijspoort
```
In de nieuw gecreëerde directory `ijspoort`, installeer node modules met:
```
yarn install
```
Build:
```
yarn build
```
Start app (dev mode):
```
yarn dev
```
Build Linux
```
yarn build:linux
```
[Voor mogelijk probleem met node-gyp](https://github.com/electron/rebuild/issues/1116)
```
pip install setuptools
# or
python3 -m pip install --break-system-packages setuptools
```

Voor ARM builds (Raspberry Pi, Orange Pi), see [these workarounds](https://www.beekeeperstudio.io/blog/electron-apps-for-arm-and-raspberry-pi)
```
export SNAPCRAFT_BUILD_ENVIRONMENT=host
export USE_SYSTEM_FPM=true
yarn run electron-builder --arm64 --armv7l --linux
```

De builds worden gegenereerd in de `dist` directory.
[Voor AppImage is in Ubuntu 22.04 `libfuse2` nodig](https://askubuntu.com/questions/1403811/appimage-on-ubuntu-22-04):
```
sudo add-apt-repository universe
sudo apt-get install libfuse2
```
Zie [dot_env_info](./dot_env_info) voor informatie over alle omgevingsvariabelen waarmee de applicatie opgestart wordt, te plaatsen in een `.env` bestand in de zelfde directory als de AppImage.

De applicatie opstarten kan waarschijnlijk enkel [zonder sandbox](https://authmane512.medium.com/solve-the-suid-sandbox-helper-binary-was-found-but-is-not-configured-correctly-3-solutions-4f1425a9a76c).
```
cd dist
./ijspoort.AppImage --no-sandbox
```

## MIT license

[MIT license](./LICENSE)
