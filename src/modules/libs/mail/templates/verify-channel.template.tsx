import {
	Body,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	Section,
	Tailwind,
	Text
} from '@react-email/components'
import * as React from 'react'

export function VerifyChannelTemplate() {
  return (
    <Html>
      <Head />
      <Preview>Congratulations! Your channel has been verified</Preview>
      <Tailwind>
        <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
          <Section className='text-center mb-8'>
            <Heading className='text-3xl text-black font-bold'>
              Congratulations!
            </Heading>
            <Text className='text-base text-black mt-2'>
              Your channel has been successfully verified.
            </Text>
          </Section>

          <Section className='bg-white rounded-lg shadow-md p-6 text-center mb-6'>
            <Text className='text-base text-black mt-2'>
              You got a verification badge, which is a symbol of trust and authenticity, showing that your channel is the official presence of your brand.
            </Text>
            <Text className='text-base text-black mt-2'>
              Thank you for being a part of our community!
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  )
}