import fs from 'fs'
import { ec } from 'elliptic'
import KeyEncoder from 'key-encoder'

export let privateKey, publicKey
try {
  privateKey = fs.readFileSync('./secrets/privatekey.txt')
  publicKey = fs.readFileSync('./secrets/publickey.txt')
} catch (e) {
  const curve = ec('p256')
  const keyEncoder = new KeyEncoder({
    curveParameters: [1, 2, 840, 10045, 3, 1, 7],
    privatePEMOptions: { label: 'EC PRIVATE KEY' },
    publicPEMOptions: { label: 'PUBLIC KEY' },
    curve
  })
  const keyPair = curve.genKeyPair()
  privateKey = keyEncoder.encodePrivate(keyPair.getPrivate('hex'), 'raw', 'pem')
  publicKey = keyEncoder.encodePublic(keyPair.getPublic().encode('hex'), 'raw', 'pem')
  if (!fs.existsSync('./secrets')) {
    fs.mkdirSync('./secrets')
  }
  fs.writeFileSync('./secrets/privatekey.txt', privateKey)
  fs.writeFileSync('./secrets/publickey.txt', publicKey)
}
