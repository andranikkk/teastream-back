import { BadRequestException, Logger } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'
import { hash } from 'argon2'

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
			prisma.category.deleteMany()
		])

		const categoriesData = [
			{
				title: 'Minecraft',
				slug: 'minecraft',
				description:
					'A sandbox video game developed by Mojang Studios. Players can build and explore virtual worlds made up of blocks, gather resources, craft items, and survive against monsters. Minecraft offers both creative and survival modes, allowing players to unleash their creativity or test their survival skills in a procedurally generated world.',
				thumbnailUrl: '/categories/minecraft.webp'
			},
			{
				title: 'Grand Theft Auto V',
				slug: 'grand-theft-auto-v',
				description:
					'An action-adventure game developed by Rockstar North. Set in the fictional city of Los Santos, players take on the roles of three criminals as they plan and execute heists while navigating the open world. The game features a rich storyline, diverse missions, and an expansive multiplayer mode called GTA Online.',
				thumbnailUrl: '/categories/gta-v.webp'
			},
			{
				title: 'Rust',
				slug: 'rust',
				description:
					'A multiplayer survival game developed by Facepunch Studios. Players must gather resources, build shelters, and defend themselves against other players and environmental threats in a harsh open world. Rust emphasizes player interaction, base building, and combat, creating a dynamic and challenging survival experience.',
				thumbnailUrl: '/categories/rust.webp'
			},
			{
				title: 'Cyberpunk 2077',
				slug: 'cyberpunk-2077',
				description:
					'An open-world action role-playing game developed by CD Projekt Red. Set in the dystopian Night City, players assume the role of V, a mercenary with customizable cybernetic enhancements. The game features a rich narrative, immersive world-building, and a variety of gameplay styles, including combat, hacking, and exploration.',
				thumbnailUrl: '/categories/cyberpunk-2077.webp'
			},
			{
				title: 'Just Chatting',
				slug: 'just-chatting',
				description:
					'A category on Twitch where streamers engage with their audience through casual conversation, Q&A sessions, and interactive discussions. Just Chatting streams often focus on community building and allow viewers to connect with the streamer on a more personal level.',
				thumbnailUrl: '/categories/just-chatting.webp'
			},
			{
				title: 'Red Dead Redemption 2',
				slug: 'red-dead-redemption-2',
				description:
					'An action-adventure game developed by Rockstar Games. Set in the late 1800s, players follow the story of Arthur Morgan, an outlaw and member of the Van der Linde gang. The game features a vast open world, immersive storytelling, and a variety of activities such as hunting, fishing, and horseback riding.',
				thumbnailUrl: '/categories/red-dead-redemption-2.webp'
			},
			{
				title: 'Learning',
				slug: 'learning',
				description:
					'A category on Twitch where streamers focus on educational content, tutorials, and skill development. Learning streams cover a wide range of topics, including programming, art, music, language learning, and more. Viewers can interact with the streamer and ask questions to enhance their learning experience.',
				thumbnailUrl: '/categories/learning.webp'
			},
			{
				title: 'Fortnite',
				slug: 'fortnite',
				description:
					'A battle royale game developed by Epic Games. Players are dropped onto an island and must fight to be the last one standing. Fortnite features building mechanics, a variety of weapons and items, and regular updates with new content and events.',
				thumbnailUrl: '/categories/fortnite.webp'
			},
			{
				title: 'Counter-Strike: Global Offensive',
				slug: 'counter-strike-global-offensive',
				description:
					'A multiplayer first-person shooter developed by Valve and Hidden Path Entertainment. Players join either the Terrorist or Counter-Terrorist team and compete in various game modes, including bomb defusal and hostage rescue. The game emphasizes strategy, teamwork, and skillful shooting.',
				thumbnailUrl: '/categories/counter-strike-global-offensive.webp'
			},
			{
				title: 'Programming',
				slug: 'programming',
				description:
					'A category on Twitch where streamers focus on coding, software development, and technology-related content. Programming streams cover a wide range of topics, including web development, game development, data science, and more. Viewers can interact with the streamer and ask questions to enhance their learning experience.',
				thumbnailUrl: '/categories/programming.webp'
			},
			{
				title: 'Dota 2',
				slug: 'dota-2',
				description:
					"A multiplayer online battle arena (MOBA) game developed by Valve. Players control powerful heroes and work together in teams to destroy the opposing team's Ancient. Dota 2 features a complex strategy, deep gameplay mechanics, and a large competitive scene.",
				thumbnailUrl: '/categories/dota-2.webp'
			},
			{
				title: 'League of Legends',
				slug: 'league-of-legends',
				description:
					"A multiplayer online battle arena (MOBA) game developed by Riot Games. Players control champions with unique abilities and work together in teams to destroy the opposing team's Nexus. League of Legends features strategic gameplay, a large competitive scene, and regular updates with new content.",
				thumbnailUrl: '/categories/league-of-legends.webp'
			},
			{
				title: 'Valorant',
				slug: 'valorant',
				description:
					'A tactical first-person shooter developed by Riot Games. Players take on the role of agents with unique abilities and compete in team-based matches. Valorant emphasizes precise gunplay, strategic use of abilities, and teamwork to achieve victory.',
				thumbnailUrl: '/categories/valorant.webp'
			},
			{
				title: 'Music',
				slug: 'music',
				description:
					'A category on Twitch where streamers focus on music-related content, including live performances, music production, and discussions about music. Music streams allow viewers to enjoy and interact with their favorite musicians and discover new artists.',
				thumbnailUrl: '/categories/music.webp'
			},
			{
				title: 'Among Us',
				slug: 'among-us',
				description:
					'A multiplayer party game developed by InnerSloth. Players work together to complete tasks on a spaceship while trying to identify the impostors among them. Among Us emphasizes social deduction, teamwork, and deception.',
				thumbnailUrl: '/categories/among-us.webp'
			},
			{
				title: 'Sports',
				slug: 'sports',
				description:
					'A category on Twitch where streamers focus on sports-related content, including live game commentary, sports analysis, and discussions about various sports. Sports streams allow viewers to engage with their favorite sports and connect with other fans.',
				thumbnailUrl: '/categories/sports.webp'
			},
			{
				title: 'In Real Life',
				slug: 'in-real-life',
				description:
					'A category on Twitch where streamers share their daily lives, activities, and experiences with their audience. In Real Life (IRL) streams can include anything from travel vlogs and cooking sessions to outdoor adventures and personal discussions. IRL streams allow viewers to connect with streamers on a more personal level and experience different aspects of their lives.',
				thumbnailUrl: '/categories/in-real-life.webp'
			},
			{
				title: 'Art',
				slug: 'art',
				description:
					'A category on Twitch where streamers focus on art-related content, including live drawing sessions, painting tutorials, and discussions about various art forms. Art streams allow viewers to enjoy and interact with their favorite artists and discover new techniques and styles.',
				thumbnailUrl: '/categories/art.webp'
			}
		]

		await prisma.category.createMany({
			data: categoriesData
		})
		Logger.log('Categories seeded successfully')

		const categories = await prisma.category.findMany()

		const categoriesBySlug = Object.fromEntries(
			categories.map(category => [category.slug, category])
		)

		const streamTitles = {
			minecraft: [
				'Building a Castle in Minecraft',
				'Exploring a New Minecraft World',
				'Surviving the First Night in Minecraft',
				'Minecraft Redstone Contraptions',
				'Minecraft Speedrun Attempt',
				'Minecraft Hardcore Mode Challenge',
				'Minecraft Creative Mode Showcase'
			],
			'grand-theft-auto-v': [
				'GTA V Heist Planning and Execution',
				'Exploring Los Santos in GTA V',
				'GTA V Roleplay Adventures',
				'GTA V Stunt Challenges',
				'GTA V Online Missions',
				'GTA V Story Mode Walkthrough',
				'GTA V Custom Car Builds'
			],
			rust: [
				'Rust Base Building Tips',
				'Surviving in Rust',
				'Rust PvP Battles',
				'Rust Raiding Strategies',
				'Rust Resource Gathering',
				'Rust Clan Wars',
				'Rust Solo Adventures'
			],
			'cyberpunk-2077': [
				'Cyberpunk 2077 Story Walkthrough',
				'Cyberpunk 2077 Character Builds',
				'Cyberpunk 2077 Gameplay Tips',
				'Cyberpunk 2077 Side Quests',
				'Cyberpunk 2077 Cyberware Showcase',
				'Cyberpunk 2077 Night City Exploration',
				'Cyberpunk 2077 Mod Showcase'
			],
			'just-chatting': [
				'Just Chatting with the Community',
				'Q&A Session in Just Chatting',
				'Just Chatting: Sharing Personal Stories',
				'Just Chatting: Discussing Current Events',
				'Just Chatting: Community Game Night',
				'Just Chatting: Reacting to Memes',
				'Just Chatting: Planning Future Streams'
			],
			'red-dead-redemption-2': [
				'Red Dead Redemption 2 Story Walkthrough',
				'Red Dead Redemption 2 Hunting and Fishing',
				'Red Dead Redemption 2 Online Mode',
				'Red Dead Redemption 2 Roleplay Adventures',
				'Red Dead Redemption 2 Easter Eggs',
				'Red Dead Redemption 2 Character Builds',
				'Red Dead Redemption 2 Mod Showcase'
			],
			learning: [
				'Learning to Code: Python Basics',
				'Learning to Code: JavaScript Fundamentals',
				'Learning to Code: Web Development',
				'Learning to Code: Data Science',
				'Learning to Code: Game Development',
				'Learning to Code: Mobile App Development',
				'Learning to Code: Machine Learning'
			],
			fortnite: [
				'Fortnite Battle Royale Gameplay',
				'Fortnite Creative Mode Showcase',
				'Fortnite Building Tips and Tricks',
				'Fortnite Competitive Play',
				'Fortnite Challenges and Events',
				'Fortnite Streamer Highlights',
				'Fortnite New Season Overview'
			],
			'counter-strike-global-offensive': [
				'CS:GO Competitive Match',
				'CS:GO Strategy and Tactics',
				'CS:GO Weapon Guide',
				'CS:GO Map Walkthrough',
				'CS:GO Pro Player Highlights',
				'CS:GO Community Game Night',
				'CS:GO New Update Overview'
			],
			programming: [
				'Learning to Code: Python Basics',
				'Learning to Code: JavaScript Fundamentals',
				'Learning to Code: Web Development',
				'Learning to Code: Data Science',
				'Learning to Code: Game Development',
				'Learning to Code: Mobile App Development',
				'Learning to Code: Machine Learning'
			],
			'dota-2': [
				'Dota 2 Competitive Match',
				'Dota 2 Strategy and Tactics',
				'Dota 2 Hero Guide',
				'Dota 2 Map Walkthrough',
				'Dota 2 Pro Player Highlights',
				'Dota 2 Community Game Night',
				'Dota 2 New Update Overview'
			],
			'league-of-legends': [
				'League of Legends Competitive Match',
				'League of Legends Strategy and Tactics',
				'League of Legends Champion Guide',
				'League of Legends Map Walkthrough',
				'League of Legends Pro Player Highlights',
				'League of Legends Community Game Night',
				'League of Legends New Update Overview'
			],
			valorant: [
				'Valorant Competitive Match',
				'Valorant Strategy and Tactics',
				'Valorant Agent Guide',
				'Valorant Map Walkthrough',
				'Valorant Pro Player Highlights',
				'Valorant Community Game Night',
				'Valorant New Update Overview'
			],
			music: [
				'Live Music Performance',
				'Music Production Stream',
				'Music Theory Discussion',
				'Instrument Tutorial',
				'Songwriting Session',
				'Music Collaboration Stream',
				'Reacting to New Music Releases'
			],
			'among-us': [
				'Among Us Gameplay with Friends',
				'Among Us Strategy and Tips',
				'Among Us Roleplay Adventures',
				'Among Us Custom Game Modes',
				'Among Us Community Game Night',
				'Among Us Impostor Gameplay',
				'Among Us Crewmate Gameplay'
			],
			sports: [
				'Live Sports Commentary',
				'Sports Analysis and Discussion',
				'Reacting to Sports Highlights',
				'Sports Trivia and Games',
				'Sports Fan Q&A',
				'Sports History Discussion',
				'Previewing Upcoming Sports Events'
			],
			'in-real-life': [
				'Daily Life Vlog',
				'Cooking Stream',
				'Outdoor Adventure Stream',
				'Personal Storytime',
				'Q&A Session',
				'Reacting to Life Events',
				'Planning Future Activities'
			],
			art: [
				'Live Drawing Session',
				'Painting Tutorial',
				'Sculpting Stream',
				'Art Discussion and Critique',
				'Art Collaboration Stream',
				'Reacting to Art Trends',
				'Planning Future Art Projects'
			]
		}

		const usernames = [
			'GamerGirl123',
			'ProPlayer456',
			'StreamMaster789',
			'EpicGamer101',
			'GamingGuru202',
			'StreamQueen303',
			'GamerDude404',
			'ProGamer555',
			'StreamKing606',
			'GamerXtreme707',
			'AnotherGamer808',
			'GamingLegend909',
			'StreamBoss010',
			'GamerPro111',
			'ProPlayer222',
			'StreamMaster333',
			'EpicGamer444',
			'GamingGuru555',
			'StreamQueen666',
			'GamerDude777',
			'ProGamer888',
			'StreamKing999',
			'GamerXtreme000',
			'AnotherGamer111',
			'GamingLegend222',
			'StreamBoss333',
			'GamerPro444',
			'ProPlayer555',
			'StreamMaster666',
			'EpicGamer777',
			'GamingGuru888',
			'StreamQueen999',
			'GamerDude000',
			'ProGamer111',
			'StreamKing222',
			'GamerXtreme333',
			'AnotherGamer444',
			'GamingLegend555',
			'StreamBoss666',
			'GamerPro777',
			'ProPlayer888',
			'StreamMaster999',
			'EpicGamer000',
			'GamingGuru111',
			'StreamQueen222',
			'GamerDude333',
			'ProGamer444',
			'StreamKing555',
			'GamerXtreme666',
			'AnotherGamer777',
			'GamingLegend888'
		]

		await prisma.$transaction(async tx => {
			for (const username of usernames) {
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
							avatar: `/channels/${username}.webp`,
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
							}
						}
					})
					const randomTitles = streamTitles[randomCategory.slug]
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
