import { BadRequestException, Logger } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'
import { hash } from 'argon2'

import { CATEGORIES_DATA } from './data/categories.data'
import { STREAM_TITLES } from './data/stream-titles.data'
import { USERNAMES } from './data/usernames.data'

const prisma = new PrismaClient({
	transactionOptions: {
		maxWait: 5000, // default is 2000
		timeout: 10000, // default is 5000
		isolationLevel: Prisma.TransactionIsolationLevel.Serializable // default is 'ReadCommitted'
	}
})

async function main() {
	try {
		Logger.log('Starting database seeding')

		await prisma.$transaction([
			prisma.user.deleteMany(),
			prisma.socialLink.deleteMany(),
			prisma.stream.deleteMany(),
			prisma.category.deleteMany(),
			prisma.notification.deleteMany(),
			prisma.notificationSettings.deleteMany()
		])

		// TODO: create seeder for notifications and notification settings

		await prisma.category.createMany({
			data: CATEGORIES_DATA
		})
		Logger.log('Categories seeded successfully')

		const categories = await prisma.category.findMany()

		const categoriesBySlug = Object.fromEntries(
			categories.map(category => [category.slug, category])
		)

		await prisma.$transaction(async tx => {
			for (const username of USERNAMES) {
				const randomCategory =
					categoriesBySlug[
						Object.keys(categoriesBySlug)[
							Math.floor(
								Math.random() *
									Object.keys(categoriesBySlug).length
							)
						]
					]

				const userExists = await tx.user.findUnique({
					where: { username }
				})

				if (!userExists) {
					const createdUser = await tx.user.create({
						data: {
							email: `${username}@example.com`,
							password: await hash('123123123'),
							username,
							displayName: username,
							avatar: `/teastream-record/uploads/${username}`,
							isEmailVerified: true,
							socialLinks: {
								createMany: {
									data: [
										{
											title: 'Telegram',
											url: `https://t.me/${username}`,
											position: 1
										},
										{
											title: 'Youtube',
											url: `https://youtube.com/${username}`,
											position: 2
										}
									]
								}
							},
							notificationSettings: {
								create: {
									siteNotifications: Math.random() < 0.5,
									telegramNotifications: Math.random() < 0.5
								}
							}
						}
					})
					const randomTitles = STREAM_TITLES[randomCategory.slug]
					const randomTitle =
						randomTitles[
							Math.floor(Math.random() * randomTitles.length)
						]

					await tx.stream.create({
						data: {
							title: randomTitle,
							thumbnailUrl: `/streams/${createdUser.username}.webp`,
							user: {
								connect: { id: createdUser.id }
							},
							category: {
								connect: { id: randomCategory.id }
							}
						}
					})

					Logger.log(
						`User ${username} and stream "${randomTitle}" seeded successfully`
					)
				}
			}
		})

		Logger.log('Database seeding completed successfully')
	} catch (error) {
		Logger.error(error)
		throw new BadRequestException('Error seeding the database')
	} finally {
		Logger.log('Disconnecting from the database')
		await prisma.$disconnect()
		Logger.log('Seeding completed')
	}
}

main()
