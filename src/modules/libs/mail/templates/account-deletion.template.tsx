/* eslint-disable prettier/prettier */

import { Html } from '@react-email/html'
import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components'

interface AccountDeletionTemplateProps {
  domain: string
}

export function AccountDeletionTemplate({ domain }: AccountDeletionTemplateProps) {
  const registerUrl = `${domain}/account/create`

  return (
    <Html>
      <Head />
      <Preview>Аккаунт удален</Preview>
      <Tailwind>
        <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
          <Section className='text-center'>
            <Heading className='text-3xl font-bold text-black'>
              Ваш аккаунт был полностью удален
            </Heading>
            <Text className='text-base text-black mt-2'>
              Ваш аккаунт и все связанные с ним данные были успешно удалены из нашей системы. Спасибо, что были с нами.
            </Text>
          </Section>

          <Section className='bg-white text-black text-center rounded-lg shadow-md p-6 mb-4'>
            <Text>
              Вы больше не будете получать от нас электронные письма.
            </Text>
            <Text>
              Если вы задумали вернуться, мы всегда будем рады видеть вас снова! Регистрируйтесь по ссылке ниже:
            </Text>
            <Link 
              href={registerUrl}
              className='inline-flex justify-center items-center rounded-md pt-2 text-sm font-medium text-white bg-[#18B9AE] px-5 py-2 rounded-full'
            >
              Создать новый аккаунт
            </Link>
          </Section>

          <Section className='text-center text-black'>
            <Text>
              Если у вас есть вопросы, свяжитесь с нашей службой поддержки
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  )
}