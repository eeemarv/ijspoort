const { Menu, MenuItem } = require('electron');
const { dialog } = require('electron');

const import_assist_xlsx = (win, eStore) => {
	const assist_import_year = eStore.get('assist_import_year');
	if (!assist_import_year){
		return;
	}
	const files = dialog.showOpenDialogSync(win, {
		properties: ['openFile'],
      filters: {name: 'MS Excell', extensions: ['xls', 'xlsx']},
      message: 'Import xlsx leden uit Assist, LIDJAAR ' + assist_import_year
	});
	if (!files){
			return;
	}
	win.webContents.send('xls.assist.import', files[0]);
};

const build_menu = (win, eStore) => {
	const menu = new Menu();

	const assist_import_year = eStore.get('assist_import_year');

	if(assist_import_year){
		const importMenu = new Menu();
		importMenu.append(new MenuItem({ label: 'leden Assist Xlsx ' + assist_import_year, click: () => import_assist_xlsx(win, eStore) }));
		menu.append(new MenuItem({ label: 'Import', submenu: importMenu }));
	}

	const exportMenu = new Menu();
	exportMenu.append(new MenuItem({ label: 'Registraties CSV', click: () => { win.webContents.send('reg.csv.export'); }}));
	exportMenu.append(new MenuItem({ label: 'Registratie Aantallen CSV', click: () => { win.webContents.send('reg.count.csv.export'); }}));
	exportMenu.append(new MenuItem({ label: 'Database JSON', click: () => { win.webContents.send('db.json.export'); }}));

	menu.append(new MenuItem({ label: 'Export', submenu: exportMenu }));
	menu.append(new MenuItem({ label: 'Instellingen', click: () => { win.webContents.send('open_config'); }} ));
	menu.append(new MenuItem({role: 'viewMenu'}));
	menu.append(new MenuItem({role: 'windowMenu'}));

	Menu.setApplicationMenu(menu);
}

module.exports = build_menu;