import type { SponsorshipPlan, User } from '@prisma/client'

import type { SessionMetadata } from '@/src/shared/types/session-metadata.types'

export const MESSAGES = {
	welcome:
		`<b>Welcome to Teastream Bot!</b>\n\n` +
		`To start using the bot, please link your Telegram account with your Teastream account.\n\n` +
		`Click the button below to move to the notification settings page and follow the instructions there to link your account.`,
	authSuccess: 'Your Telegram account has been successfully linked!',
	invalidToken: 'Invalid token.',
	tokenExpired: 'Token has expired.',
	profile: (user: User, followersCount: number) =>
		`<b>User profile:</b>\n` +
		`Username: @${user.username}\n` +
		`Email: ${user.email}\n` +
		`Followers: ${followersCount}\n` +
		`Bio: ${user.bio || 'N/A'}\n` +
		`Click the button below to view your account settings.`,
	follows: (user: User) =>
		`<a href='https://teastream.ru/${user.id}'>${user.username}</a>`,
	resetPassword: (token: string, metadata: SessionMetadata) =>
		`<b>Password recovery</b>\n` +
		`To reset your password, please click the link below:\n` +
		`<a href='https://teastream.ru/account/recovery/${token}'>Reset Password</a>\n\n` +
		`<b>Date of request:</b> ${new Date().toLocaleString()}\n` +
		`<b>Location:</b> ${metadata.location.country}, ${metadata.location.city}\n` +
		`<b>IP Address:</b> ${metadata.ip}\n\n` +
		// `<b>Device:</b> ${metadata.device.os}\n`
		// `<b>Device:</b> ${metadata.device.browser}\n\n`
		`If you did not request a password reset, please ignore this message.\nBest regards.`,
	deactivateAccount: (token: string, metadata: SessionMetadata) =>
		`<b>Deactivate Account</b>\n` +
		`To deactivate your account, please confirm you request by entering code below:\n` +
		`<b>Code:</b> ${token}\n\n` +
		`<b>Date of request:</b> ${new Date().toLocaleString()}\n` +
		`<b>Location:</b> ${metadata.location.country}, ${metadata.location.city}\n` +
		`<b>IP Address:</b> ${metadata.ip}\n\n` +
		`If you did not request account deactivation, please ignore this message.\nBest regards.`,
	accountDeleted:
		`<b>Your account has been successfully deleted.</b>\n\n` +
		`<i>We're sorry to see you go. If you change your mind, you can always create a new account <a href='https://teastream.ru/account/create'>here</a>.</i>\nBest regards.`,
	streamStart: (channel: User) =>
		`<b>${channel.username} has just started streaming!</b>\n\n` +
		`Join the stream now: <a href='https://teastream.ru/${channel.id}'>Watch Stream</a>`,
	newFollower: (follower: User, followerCount: number) =>
		`<b>New follower alert!</b>\n\n` +
		`You have a new follower: @${follower.displayName}\n` +
		`Your follower count: ${followerCount}\n\n` +
		`Check out their profile: <a href='https://teastream.ru/${follower.username}'>View Profile</a>`,
	newSponsorship: (plan: SponsorshipPlan, sponsor: User) =>
		`<b>New sponsorship alert!</b>\n\n` +
		`You have a new sponsorship from @${sponsor.username} for the plan: <b>${plan.title}</b>\n` +
		`Amount: <b>$${plan.price}</b>\n\n` +
		`Check out their profile: <a href='https://teastream.ru/${sponsor.username}'>View Profile</a>`,
	enableTwoFactor:
		`<b>Make your account more secure!</b>\n\n` +
		`To enable two-factor authentication, please click the <a href='https://teastream.ru/dashboard/settings'>link</a> and follow the instructions.`,
	verifyChannel:
		`<b>Congratulations!</b>\n\n` +
		`Your channel has been successfully verified and you got a verification badge.\n` +
		'A verification badge is a symbol of trust and authenticity, showing that your channel is the official presence of your brand.\n' +
		`Thank you for being a part of our community!`
}
