import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from '@/src/core/prisma/prisma.service'

@Injectable()
export class CategoryService {
	constructor(private readonly prismaService: PrismaService) {}

	public async findAll() {
		const categories = await this.prismaService.category.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				streams: {
					include: {
						user: true,
						category: true
					}
				}
			}
		})

		return categories
	}

	public async findRandom() {
		const total = await this.prismaService.category.count()

		const randomIndex = new Set<number>()

		while (randomIndex.size < 7) {
			const randomIndexValue = Math.floor(Math.random() * total)
			randomIndex.add(randomIndexValue)
		}

		const categories = await this.prismaService.category.findMany({
			include: {
				streams: {
					include: {
						user: true,
						category: true
					}
				}
			},
			take: total,
			skip: 0
		})

		return Array.from(randomIndex).map(index => categories[index])
	}

	public async findBySlug(slug: string) {
		const category = await this.prismaService.category.findUnique({
			where: {
				slug
			},
			include: {
				streams: {
					include: {
						user: true,
						category: true
					}
				}
			}
		})

		if (!category) {
			throw new NotFoundException('Category not found')
		}

		return category
	}
}
