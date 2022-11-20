import {Client} from "minio";

type MinioOptions = {
  endPoint?: string;
  port?: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
}

const initializeClient = (options: MinioOptions): Client => {
  let {
        endPoint,
        port,
        useSSL,
        secretKey,
        accessKey
      } = options;

  if (!port) {
    port = 9000
  }

  if (!endPoint) {
    endPoint = "localhost"
  }

  const minioClient = new Client({
    endPoint,
    port,
    useSSL,
    accessKey,
    secretKey
  });

  return minioClient;
}

export {
  initializeClient
}