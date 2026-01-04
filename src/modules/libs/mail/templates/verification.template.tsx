/* eslint-disable prettier/prettier */
import { Html } from '@react-email/html'
import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components'

interface VerificationTemplateProps {
  domain: string
  token: string
}

export function VerificationTemplate({domain, token}: VerificationTemplateProps) {
  const verificationLink = `${domain}/account/verify?token=${token}`
  
  return (
    <Html>
      <Head />
      <Preview>Верификация аккаунта</Preview>
      <Tailwind>
        <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
          <Section className='text-center mb-8'>
            <Heading className='text-3xl font-bold text-black'>Подтверждение вашей почты</Heading>
            <Text className='text-base text-black'>Спасибо за регистрацию! Пожалуйста, нажмите на ссылку ниже, чтобы подтвердить свой адрес электронной почты.</Text>
            <Link href={verificationLink} className='inline-flex justify-center items-center rounded-full text-sm font-medium text-white bg-[#18B9AE] px-5 py-2'>Подтвердить</Link>
          </Section>

          <Section className='text-center mt-8'>
            <Text className='text-gray-600'>
              Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.
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