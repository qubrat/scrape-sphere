import 'server-only';
import crypto from 'crypto';

const ALG = 'aes-256-cbc'; // 32 bytes long key

export function symmetricEncrypt(data: string) {
	const key = process.env.ENCRYPTION_KEY as string;
	if (!key) throw new Error('Encryption key not found');

	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv(ALG, Buffer.from(key, 'hex'), iv);
	let encrypted = cipher.update(data);
	encrypted = Buffer.concat([encrypted, cipher.final()]);
	return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function symmetricDecrypt(encrypted: string) {
	const key = process.env.ENCRYPTION_KEY as string;
	if (!key) throw new Error('Encryption key not found');

	const [ivHex, encryptedHex] = encrypted.split(':');
	const iv = Buffer.from(ivHex, 'hex');
	const encryptedText = Buffer.from(encryptedHex, 'hex');
	const decipher = crypto.createDecipheriv(ALG, Buffer.from(key), iv);
	let decrypted = decipher.update(encryptedText);
	decrypted = Buffer.concat([decrypted, decipher.final()]);
	return decrypted.toString();
}
