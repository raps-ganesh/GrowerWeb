import { Injectable } from '@angular/core';
import * as Forge from 'node-forge';

@Injectable({
    providedIn: 'root',
})
export class RSAHelper {
    publicKey: string =
        `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCTqqY19a0FnNqxe9B69+Kj+vnG
6qqdyJKFcpWMgRkKDZdXm0xC7yt7ETUl2nnSHnmFUhqboxenmZQ1jO4mfDjN0lx8
wjG2tMEu1QpBBB5q3/yjxZ4XiXNkArESQWlPDgANMx1drW0ZRmCrHwhUCnAF+grW
txPrD1j5AcvijRGCdQIDAQAB
-----END PUBLIC KEY-----`;

    constructor() { }

    encryptWithPublicKey(valueToEncrypt: string): string {
        const rsa = Forge.pki.publicKeyFromPem(this.publicKey);
        return window.btoa(rsa.encrypt(valueToEncrypt.toString()));
    }
}