import { testConnection } from './database/connection';
import { iniciarMenuPrincipal } from './menus/mainMenu';

async function bootstrap(): Promise<void> {
	console.log('BookStore CLI - inicializando...');

	await testConnection();
	await iniciarMenuPrincipal();

	process.exit(0);
}

bootstrap();
