import 'server-only';
import crypto from 'crypto';
const ALG = 'aes-256-cbc';

export function symmetricEncrypt(data: string) {
	const keyHex = process.env.ENCRYPTION_KEY as string;
	if (!keyHex) throw new Error('Encryption key not found');

	// Konwersja klucza z formatu hex na buffer
	const key = Buffer.from(keyHex, 'hex');

	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv(ALG, key, iv);
	let encrypted = cipher.update(data);
	encrypted = Buffer.concat([encrypted, cipher.final()]);
	return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function symmetricDecrypt(encrypted: string) {
	const keyHex = process.env.ENCRYPTION_KEY as string;
	if (!keyHex) throw new Error('Encryption key not found');

	// Konwersja klucza z formatu hex na buffer
	const key = Buffer.from(keyHex, 'hex');

	const [ivHex, encryptedHex] = encrypted.split(':');
	const iv = Buffer.from(ivHex, 'hex');
	const encryptedText = Buffer.from(encryptedHex, 'hex');
	const decipher = crypto.createDecipheriv(ALG, key, iv);
	let decrypted = decipher.update(encryptedText);
	decrypted = Buffer.concat([decrypted, decipher.final()]);
	return decrypted.toString();
}
