import pinataSDK from '@pinata/sdk';

const pinata = pinataSDK(process.env.PINATA_API_KEY!, process.env.PINATA_SECRET_KEY!);

export async function uploadFileToIPFS(fileBuffer: Buffer, fileName: string) {
  const result = await pinata.pinFileToIPFS(fileBuffer, { pinataMetadata: { name: fileName } });
  return result.IpfsHash;
}

export async function uploadJSONToIPFS(json: object, name: string) {
  const result = await pinata.pinJSONToIPFS(json, { pinataMetadata: { name } });
  return result.IpfsHash;
}
