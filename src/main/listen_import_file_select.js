import { dialog, ipcMain } from 'electron';

const listen_import_file_select = (win) => {
	console.log('listen import_file.select');

	ipcMain.on('import_file.select', async (event) => {
		console.log('import_file.select');
		try {
			const res = await dialog.showOpenDialog(win, {
				properties: ['openFile'],
					filters: {name: 'MS Excell', extensions: ['xls', 'xlsx']},
					message: 'Import xlsx leden uit Assist'
			});
			if (res.canceled){
				console.log('import_file.canceled');
				event.reply('import_file.canceled');
				return;
			}
			if (!res.filePaths){
				console.log('import_file.empty');
				event.reply('import_file.empty');
				return;
			}
			console.log('open dialog filePaths: ', res.filePaths);
			console.log('import_file.selected', res.filePaths[0]);
			event.reply('import_file.selected', res.filePaths[0]);
			return;
		} catch (err) {
			console.log(err);
		}
	});
};

export default listen_import_file_select;
