import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from '@/src/core/prisma/prisma.service'

@Injectable()
export class ChannelService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findRecommendedChannels() {
		const channels = await this.prismaService.user.findMany({
			where: {
				isDeactivated: false
			},
			orderBy: {
				following: {
					_count: 'desc'
				}
			},
			include: {
				streams: true
			},
			take: 7
		})

		return channels
	}

	public async findByUsername(username: string) {
		const channel = await this.prismaService.user.findUnique({
			where: {
				username,
				isDeactivated: false
			},
			include: {
				socialLinks: {
					orderBy: {
						createdAt: 'asc'
					}
				},
				streams: {
					include: {
						category: true
					}
				},
				following: true
			}
		})

		if (!channel) {
			throw new NotFoundException('Channel not found')
		}

		return channel
	}

	public async findFollowersCount(channelId: string) {
		const count = await this.prismaService.follow.count({
			where: {
				following: {
					id: channelId
				}
			}
		})

		return count
	}

	public async findSponsorsByChannel(channelId: string) {
		const channel = await this.prismaService.user.findUnique({
			where: {
				id: channelId,
				isDeactivated: false
			}
		})

		if (!channel) {
			throw new NotFoundException('Channel not found')
		}

		const sponsors =
			await this.prismaService.sponsorshipSubscription.findMany({
				where: {
					channelId: channel.id
				},
				orderBy: {
					createdAt: 'desc'
				},
				include: {
					plan: true,
					user: true,
					channel: true
				}
			})

		return sponsors
	}
}
