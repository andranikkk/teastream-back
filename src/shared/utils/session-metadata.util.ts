/* eslint-disable @typescript-eslint/no-require-imports */
import type { Request } from 'express'
import { lookup } from 'geoip-lite'

import { IS_DEV_ENV } from '../is-dev.util'
import type { SessionMetadata } from '../types/session-metadata.types'

import DeviceDetector = require('device-detector-js')

export function getSessionMetadata(
	req: Request,
	userAgent: string
): SessionMetadata {
	const ip = IS_DEV_ENV
		? '212.58.120.49' // Example IP for development
		: Array.isArray(req.headers['cf-connecting-ip'])
			? req.headers['cf-connecting-ip'][0]
			: req.headers['cf-connecting-ip'] ||
				(typeof req.headers['x-forwarded-for'] === 'string'
					? req.headers['x-forwarded-for'].split(',')[0]
					: req.ip)

	const location = lookup(ip)
	const device = new DeviceDetector().parse(userAgent)

	return {
		location: {
			country: location.country || 'Unknown',
			city: location.city || 'Unknown',
			latitude: location.ll[0] || 0,
			longitude: location.ll[1] || 0
		},
		device: {
			browser: device.client.name || 'Unknown',
			os: device.os.name || 'Unknown',
			type: device.device.type || 'Unknown'
		},
		ip: ip || 'Unknown'
	}
}
