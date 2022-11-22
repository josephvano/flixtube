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
* Minio will store files locally by default at `$PWD/data/object`
* MongoDB will store data files locally at `$PWD/data/mongo`

## References

MinIO
* [Running as Container](https://min.io/docs/minio/container/index.html)
* [JavaScript SDK](https://min.io/docs/minio/linux/developers/javascript/minio-javascript.html)

MongoDB
* [DockerHub MongoDB Image](https://hub.docker.com/_/mongo)
* [Using TypeScript with MongoDB](https://www.mongodb.com/compatibility/using-typescript-with-mongodb-tutorial)


RabbitMQ
* [docker](https://hub.docker.com/_/rabbitmq)
* [configuration](https://www.rabbitmq.com/configure.html)