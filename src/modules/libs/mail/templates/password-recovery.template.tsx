/* eslint-disable prettier/prettier */
import * as React from 'react'

import { Html } from '@react-email/html'
import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components'

import type { SessionMetadata } from '@/src/shared/types/session-metadata.types'

interface PasswordRecoveryTemplateProps {
	domain: string
	token: string
	metadata: SessionMetadata
}

export function PasswordRecoveryTemplate({
	domain,
	token,
	metadata
}: PasswordRecoveryTemplateProps) {
	const resetLink = `${domain}/account/recovery/${token}`

  return (
    <Html>
      <Head />
      <Preview>Восстановление пароля</Preview>
      <Tailwind>
        <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
          <Section className='text-center mb-8'>
            <Heading className='text-3xl font-bold text-black'>Восстановление пароля</Heading>
            <Text className='text-base text-black'>
              Пожалуйста, нажмите на ссылку ниже, чтобы восстановить пароль.
            </Text>
            <Link href={resetLink} className='inline-flex justify-center items-center rounded-full text-sm font-medium text-white bg-[#18B9AE] px-5 py-2'>
              Сбросить пароль
            </Link>
          </Section>

          <Section className='bg-g-100 rounded-lg p-6 mb-6'>
            <Heading className='text-xl font-semibold text-[#18B9AE]'>
              Информация о сбросе пароля:
            </Heading>
            <ul className='list-disc list-inside mt-2 text-black'>
              <li>Расположение: {metadata.location.country}, {metadata.location.city}</li>
              <li>Устройство: {metadata.device.os}</li>
              <li>Браузер: {metadata.device.browser}</li>
              <li>IP-адрес: {metadata.ip}</li>
            </ul>
            <Text className='text-gray-600 mt-2'>
              Если это были не вы, просто проигнорируйте это письмо.
            </Text>
          </Section>

          <Section className='text-center mt-8'>
            <Text className='text-gray-600'>
              Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.
              Если у вас есть вопросы, свяжитесь с нашей службой поддержки <Link href='mailto:help@teastream.ru' className='text-[#18B9AE] underline'>mailto:help@teastream.ru.</Link> Спасибо!
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  )
}
