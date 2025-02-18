const { Menu, MenuItem } = require('electron');

const build_menu = (win) => {
	const menu = new Menu();

	const updateDataMenu = new Menu();
	updateDataMenu.append(new MenuItem({ label: 'Import Assist lidmaatschap', click: () => { win.webContents.send('menu.members.import'); }}));
	updateDataMenu.append(new MenuItem({ label: 'Verwijder lidmaatschapsperiode', click: () => { win.webContents.send('menu.members.remove'); }}));
	updateDataMenu.append(new MenuItem({ label: 'Verwijder persoonsdata zonder lidmaatschap', click: () => { win.webContents.send('menu.members.cleanup'); }}));

	const exportMenu = new Menu();
	exportMenu.append(new MenuItem({ label: 'Registraties CSV', click: () => { win.webContents.send('menu.reg.csv.export'); }}));
	exportMenu.append(new MenuItem({ label: 'Registratie Aantallen CSV', click: () => { win.webContents.send('menu.reg.count.csv.export'); }}));
	exportMenu.append(new MenuItem({ label: 'Registraties verdeling personen CSV', click: () => { win.webContents.send('menu.person.reg.count.csv.export'); }}));
	exportMenu.append(new MenuItem({ label: 'Database JSON', click: () => { win.webContents.send('menu.db.json.export'); }}));

	menu.append(new MenuItem({ label: 'Leden data', submenu: updateDataMenu }));
	menu.append(new MenuItem({ label: 'Export', submenu: exportMenu }));
	menu.append(new MenuItem({ label: 'Instellingen', click: () => { win.webContents.send('menu.open_config'); }} ));
	menu.append(new MenuItem({role: 'viewMenu'}));
	menu.append(new MenuItem({role: 'windowMenu'}));

	Menu.setApplicationMenu(menu);
}

module.exports = build_menu;