import { dialog, ipcMain } from 'electron';
import * as fs from 'fs';
import * as XLSX from 'xlsx';

XLSX.set_fs(fs);

const listen_import_file = (win) => {
	console.log('listen import_file.select');

	ipcMain.handle('assist_file.select', async () => {
		console.log('assist_file.select');
		try {
			const {canceled, filePaths} = await dialog.showOpenDialog(win, {
				properties: ['openFile'],
					filters: {name: 'MS Excell', extensions: ['xls', 'xlsx']},
					message: 'Import xlsx leden uit Assist'
			});
			if (canceled){
				console.log('assist_file.select canceled');
				return;
			}
			if (!filePaths){
				console.log('assist_file.select empty');
				return;
			}
			console.log('assist_file.select file', filePaths[0]);
			return filePaths[0];
		} catch (err) {
			console.log(err);
			return;
		}
	});

	ipcMain.handle('assist_file.get_json', async (event, file) => {
		const workbook = XLSX.readFile(file);
		const sheet_name_list = workbook.SheetNames;
		return XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {defval: '', raw: false});
	});
};

export default listen_import_file;
