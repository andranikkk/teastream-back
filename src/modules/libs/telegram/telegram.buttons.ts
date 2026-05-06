import { Markup } from 'telegraf'

export const BUTTONS = {
	authSuccess: Markup.inlineKeyboard([
		[
			Markup.button.callback('My follows', 'follows'),
			Markup.button.callback('My profile', 'profile')
		],
		[Markup.button.url('Go to the page', 'https://teastream.app')]
	]),
	profile: Markup.inlineKeyboard([
		Markup.button.url(
			'Account settings',
			'https://teastream.app/dashboard/settings'
		)
	])
}
