# ijspoort

Standalone desktop app voor toegangscontrole met Mifare Classic NFC tags ontwikkeld voor de [Deurnese IJsberen vzw](https://www.deurnese-ijsberen.be). Geschreven in [Electronjs](https://www.electronjs.org), met [Svelte](https://svelte.dev) componenten. [Pouchdb](https://pouchdb.com) database synchroniseert met online Couchdb (CouchDb, Cloudant, Pouchdb). De app werkt offline-first. Dus internet verbinding is geen absolute vereiste. Doch voor de veiligheid is het nodig om altijd verbinding te maken nadat nieuwe data is toegevoegd zodat de nieuwe data niet verloren kan gaan. Leden-data wordt verkregen door leden export vanuit [Assist](https://assistonline.eu). De aangemaakte tags worden gekoppeld aan de lidnummers.

Het programma kent twee algemene modi:

* een registratie-modus: om nieuwe tags te initialiseren (aan leden te koppelen), om leden-data in te laden (met xls bestanden vanuit Assist), om toegang met tags te registreren, om manuele toegangs-registratie uit te voeren (zonder tags).
* Een poort modus: enkel voor toegangs-registratie met tags waarbij eventueel een elektrische poort wordt aangestuurd.

Reguirements:
* OS Ubuntu 22.04
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
* [node-hid](https://github.com/node-hid/node-hid#compiling-from-source)
```
sudo apt-get install libusb-1.0
```
* [nfc-pcsc](https://github.com/pokusew/nfc-pcsc)
```
sudo apt-get install libpcsclite1 libpcsclite-dev
sudo apt-get install build-essential
sudo apt-get install gcc

```

Voor de poort-modus, aansturing door een Raspberry Pi 4B([Info](https://askubuntu.com/questions/1230947/gpio-for-raspberry-pi-gpio-group)):

```
sudo apt install rpi.gpio-common
sudo adduser <user> dialout
sudo reboot
```

Installatie:
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

Zie [dot_env_info](./dot_env_info) voor informatie over alle omgevingsvariabelen waarmee de applicatie opgestart wordt.

## MIT license

[MIT license](./LICENSE)
