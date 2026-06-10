import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class FileValidationPipe implements PipeTransform<Express.Multer.File> {
	transform(file: Express.Multer.File) {
		if (!file) {
			throw new BadRequestException('File is not loaded')
		}

		const allowedMimeTypes = [
			'image/jpeg',
			'image/jpg',
			'image/webp',
			'image/gif'
		]

		if (!allowedMimeTypes.includes(file.mimetype)) {
			throw new BadRequestException('File format is not supported')
		}

		const maxSize = 10 * 1024 * 1024 // 10MB
		if (file.size > maxSize) {
			throw new BadRequestException('File size is too large')
		}

		return file
	}
}
