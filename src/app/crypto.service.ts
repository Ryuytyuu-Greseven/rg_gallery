import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  constructor() {}

  encryptService(dataToEncrypt: any) {
    try {
      const encryptedText = CryptoJS.AES.encrypt(
        JSON.stringify(dataToEncrypt),
        environment.enc_key
      ).toString();
      // console.log('\n\nEncoded String', encryptedText);
      // console.log(this.decryptService(encryptedText));

      return encryptedText;
    } catch (error) {
      return;
    }
  }

  // decrypt data using nodejs crypto module
  decryptService(dataToDecrypt: any) {
    try {
      const bytes = CryptoJS.AES.decrypt(dataToDecrypt, environment.enc_key);
      const decryptedText = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      // console.log('\n\nDecoded String', decryptedText);

      return decryptedText;
    } catch (error) {
      return false;
    }
  }
}
