# ijspoort

Standalone desktop app voor toegangscontrole met Mifare Classic NFC tags ontwikkeld voor de [Deurnese IJsberen vzw](https://www.deurnese-ijsberen.be). Geschreven in [Electronjs](https://www.electronjs.org), met [Svelte](https://svelte.dev) componenten. [Pouchdb](https://pouchdb.com) database synchroniseert met online Couchdb (CouchDb, Cloudant, Coucbbase, Pouchdb). De app werkt offline-first. Dus internet verbinding is geen absolute vereiste. Doch voor de veiligheid is het nodig om altijd verbinding te maken nadat nieuwe data is toegevoegd zodat de nieuwe data niet verloren kan gaan. Leden-data wordt verkregen door leden export vanuit [Assist](https://assistonline.eu). De aangemaakte tags worden gekoppeld aan de lidnummers.

Het programma kent twee algemene modi:

* een registratie-modus: om nieuwe tags te initialiseren (aan leden te koppelen), om leden-data in te laden (met xls bestanden vanuit Assist), om toegang met tags te registreren, om manuele toegangs-registratie uit te voeren (zonder tags).
* Een poort modus: enkel voor toegangs-registratie met tags waarbij eventueel een elektrische poort wordt aangestuurd.

Reguirements:
* OS Ubuntu 20.04
* NFC tag reader ACR122u

Dependencies:
* ACR122u driver: `sudo apt-get install libnfc-bin`
* Zie [nfc-pcsc](https://github.com/pokusew/nfc-pcsc)

Installatie:
```
yarn install
yarn upgrade
```
Run app:
```
yarn start
```

Plaats in een .env tekstbestand in de root de (geheime) environment variabelen. Let op, de environment variabelen wordt alleen geladen bij het opstarten van het programma (Het is dus nodig het programma opnieuw op te starten als een variabele aangepast wordt).

De toegang tot de online remote database (bvb. De [Cloudant](https://www.ibm.com/cloud/cloudant) service van IBM):

```
DB_URL=
DB_PASSWORD=
DB_USERNAME=
```
Elk tag wordt uniek schrijf- en leesbeveiligd met aparte A en B sleutels, die aangemaakt worden vanuit geheime feeds.
```
FEED_A=.zWemmen_is_geZond.
FEED_B=..wAter..IS..nIet..dRooG..
```
Het resetten van tags is enkel mogelijk met deze variabelen op "1":
```
NFC_RESET_WRITABLE_ENABLED=1
NFC_RESET_ENABLED=1
```
Assist import
```
ASSIST_IMPORT_YEAR=2021
ASSIST_ONLY_MEMBER_ON_EVEN_BALANCE=1 #enkel lid wanneer lidgeld betaald is.
ASSIST_REMOVE_NON_MEMBERS=1 #verwijder eerder toegevoegde leden wanneer niet aanwezig in deze Assist import.
```
Prefixen van de remote en lokale databases:
```
DB_REMOTE_PREFIX=ijs_
DB_LOCAL_PREFIX=ijs_
```
Om het programma in "poort modus" te laten draaien, voeg toe:
```
GATE=1
```
De "debug modus" geeft extra informatie tijdens programma ontwikkeling:
```
DEBUG=1
```

## MIT license

[MIT license](./LICENSE)
