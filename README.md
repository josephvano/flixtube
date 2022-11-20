# flixtube

Following book Bootstrapping Microservices with Docker, Kubernetes and Terraform 

## Getting Started

### Configuration

Set the following environment variables locally

| Variable | Description | Value |
| ------------ | --------| -----------|
| DB_USER | MongoDB username | `root` |
| DB_PASSWORD | MongoDB password | `null` |
| STORAGE_KEY | MinIO username | `admin` |
| STORAGE_SECRET | MinIO password | `null` |

### Running

Modify the `docker-compose.yaml`  with desired credentials for minio bucket storage.

1. Start services
```sh
$ docker-compose up --build
```
2. Visit minio service to create a bucket `http://localhost:9090/`
3. Upload video file in bucket

Visit `http://localhost:4000`

## Notes
Minio will store files locally by default at `$PWD/data/object`


