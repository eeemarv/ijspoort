# ijspoort

Standalone desktop app voor toegangscontrole met Mifare Classic NFC tags ontwikkeld voor de [Deurnese IJsberen vzw](https://www.deurnese-ijsberen.be). Geschreven in [Electronjs](https://www.electronjs.org), met [Svelte](https://svelte.dev) componenten. [Pouchdb](https://pouchdb.com) database synchroniseert met online Couchdb (CouchDb, Cloudant, Coucbbase, Pouchdb). De app werkt offline-first. Dus internet verbinding is geen absolute vereiste. Doch voor de veiligheid is het nodig om altijd verbinding te maken nadat nieuwe data is toegevoegd zodat de nieuwe data niet verloren kan gaan. Leden-data wordt verkregen door leden export vanuit [Assist](https://assistonline.eu). De aangemaakte tags worden gekoppeld aan de lidnummers.

Het programma kent twee algemene modi:

* een registratie-modus: om nieuwe tags te initialiseren (aan leden te koppelen), om leden-data in te laden (met xls bestanden vanuit Assist), om toegang met tags te registreren, om manuele toegangs-registratie uit te voeren (zonder tags).
* Een poort modus: enkel voor toegangs-registratie met tags waarbij eventueel een elektrische poort wordt aangestuurd.

Reguirements:
* OS Ubuntu 20.04
* NFC tag reader ACR122u

Dependencies:
* ACR122u driver:
```
sudo apt-get install libusb-1.0
```
* [node-hid](https://github.com/node-hid/node-hid#compiling-from-source)
```
sudo apt-get install libnfc-bin
```
* [nfc-pcsc](https://github.com/pokusew/nfc-pcsc)
```
sudo apt-get install libpcsclite1 libpcsclite-dev
sudo apt-get install build-essential
sudo apt-get install gcc

```

Installatie:
```
yarn install
yarn upgrade
```
Run app (dev mode):
```
yarn start
```

Zie [./dot_env_info] voor informatie over alle omgevingsvariabelen waarmee de applicatie opgestart wordt.

## MIT license

[MIT license](./LICENSE)
