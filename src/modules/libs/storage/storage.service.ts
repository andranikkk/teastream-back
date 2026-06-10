/* eslint-disable no-useless-catch */
import {
	DeleteObjectCommand,
	type DeleteObjectCommandInput,
	PutObjectCommand,
	type PutObjectCommandInput,
	S3Client
} from '@aws-sdk/client-s3'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class StorageService {
	private readonly client: S3Client
	private readonly bucket: string
	private readonly logger = new Logger(StorageService.name)

	public constructor(private readonly configService: ConfigService) {
		const endpoint = configService.getOrThrow<string>('S3_ENDPOINT')
		const region = configService.getOrThrow<string>('S3_REGION')

		this.logger.log(`Initializing S3 client with endpoint: ${endpoint}`)

		this.client = new S3Client({
			endpoint,
			region,
			forcePathStyle: true,
			credentials: {
				accessKeyId:
					configService.getOrThrow<string>('S3_ACCESS_KEY_ID'),
				secretAccessKey: configService.getOrThrow<string>(
					'S3_SECRET_ACCESS_KEY'
				)
			}
		})

		this.bucket = configService.getOrThrow<string>('S3_BUCKET_NAME')
		this.logger.log(`S3 bucket: ${this.bucket}`)
	}

	public async upload(buffer: Buffer, key: string, mimeType: string) {
		this.logger.log(
			`Starting upload: key=${key}, mimeType=${mimeType}, size=${buffer.length}`
		)

		const command: PutObjectCommandInput = {
			Bucket: this.bucket,
			Key: String(key),
			Body: buffer,
			ContentType: mimeType
		}

		try {
			const result = await this.client.send(new PutObjectCommand(command))
			this.logger.log(`✅ Upload successful: key=${key}`, result)
			return result
		} catch (error) {
			this.logger.error(
				`❌ Upload failed: key=${key}`,
				error instanceof Error ? error.message : error
			)
			throw error
		}
	}

	public async remove(key: string) {
		const command: DeleteObjectCommandInput = {
			Bucket: this.bucket,
			Key: String(key)
		}

		try {
			await this.client.send(new DeleteObjectCommand(command))
		} catch (error) {
			throw error
		}
	}
}
