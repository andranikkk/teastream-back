/* eslint-disable prettier/prettier */
import { SessionMetadata } from "@/src/shared/types/session-metadata.types"

import { Html } from '@react-email/html'
import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components'
interface DeactivateTemplateProps {
  token: string
  metadata: SessionMetadata
}

export function DeactivateTemplate({ token, metadata }: DeactivateTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>Деактивация аккаунта</Preview>
      <Tailwind>
        <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
          <Section className='text-center mb-8'>
            <Heading className='text-3xl font-bold text-black'>
              Запрос деактивации аккаунта
            </Heading>
            <Text className='text-base text-black'>
              Вы запросили деактивацию вашего аккаунта. Пожалуйста, нажмите на ссылку ниже, чтобы подтвердить деактивацию.
            </Text>
          </Section>

          <Section className="bg-gray-100 rounded-lg p-6 text-center mb-6">
            <Heading className="text-2xl text-black font-semibold">
              Код подтверждения:
            </Heading>
            <Heading className="text-3xl text-black font-semibold">
              {token}
            </Heading>
            <Text className="text-black">
              Этот код действителен в течение 5 минут.
            </Text>
          </Section>

          <Section className='bg-g-100 rounded-lg p-6 mb-6'>
            <Heading className='text-xl font-semibold text-[#18B9AE]'>
              Информация о запросе деактивации:
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
              Если у вас есть вопросы, свяжитесь с нашей службой поддержки 
                <Link href='mailto:help@teastream.ru' className='text-[#18B9AE] underline'>
                  mailto:help@teastream.ru
                </Link> Спасибо!
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  )
}