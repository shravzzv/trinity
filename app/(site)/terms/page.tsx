'use client'

import { motion } from 'motion/react'
import Link from 'next/link'

const sections = [
  {
    title: '1. About Trinity',
    content: (
      <p>
        Trinity is an intermittent fasting tracker designed to help users
        monitor fasting sessions, track progress, and build healthy habits.
        Trinity is intended for informational and personal productivity purposes
        only.
      </p>
    ),
  },
  {
    title: '2. Eligibility',
    content: (
      <p>
        You must be at least 13 years old, or the minimum age required in your
        country, to use Trinity. By using the application, you represent that
        you meet these requirements.
      </p>
    ),
  },
  {
    title: '3. Your Account',
    content: (
      <p>
        You are responsible for maintaining the security of your account and for
        all activity that occurs under it. You agree to provide accurate
        information when creating your account and to keep your login
        credentials secure.
      </p>
    ),
  },
  {
    title: '4. Acceptable Use',
    content: (
      <>
        <p>You agree not to:</p>

        <ul className='mt-4 list-disc space-y-2 pl-6'>
          <li>Use Trinity for unlawful purposes.</li>
          <li>Attempt to gain unauthorized access to the service.</li>
          <li>Interfere with the operation or security of the application.</li>
          <li>Reverse engineer or misuse the platform.</li>
        </ul>
      </>
    ),
  },
  {
    title: '5. Health Disclaimer',
    content: (
      <p>
        Trinity is not a medical device and does not provide medical advice.
        Always consult a qualified healthcare professional before beginning or
        changing any fasting, nutrition, or exercise program. You use Trinity at
        your own risk.
      </p>
    ),
  },
  {
    title: '6. User Data',
    content: (
      <p>
        You retain ownership of the information you provide to Trinity. We use
        your data only to operate and improve the service in accordance with our
        Privacy Policy.
      </p>
    ),
  },
  {
    title: '7. Availability',
    content: (
      <p>
        We strive to keep Trinity available and reliable but cannot guarantee
        uninterrupted access. Features may change, be updated, or be
        discontinued at any time without prior notice.
      </p>
    ),
  },
  {
    title: '8. Intellectual Property',
    content: (
      <p>
        Trinity, including its design, branding, software, and content, is
        protected by applicable intellectual property laws. You may not copy or
        redistribute any part of the service except as permitted by law.
      </p>
    ),
  },
  {
    title: '9. Limitation of Liability',
    content: (
      <p>
        To the maximum extent permitted by law, Trinity and its developer shall
        not be liable for any indirect, incidental, special, or consequential
        damages arising from your use of the application.
      </p>
    ),
  },
  {
    title: '10. Termination',
    content: (
      <p>
        We may suspend or terminate access to Trinity if these Terms are
        violated or if continued access could harm the service or other users.
      </p>
    ),
  },
  {
    title: '11. Changes to These Terms',
    content: (
      <p>
        We may update these Terms from time to time. Continued use of Trinity
        after changes become effective constitutes acceptance of the revised
        Terms.
      </p>
    ),
  },
  {
    title: '12. Contact',
    content: (
      <p>
        If you have any questions about these Terms, please contact us using the{' '}
        <Link
          href='/support'
          className='font-medium underline underline-offset-4'
        >
          support
        </Link>{' '}
        page.
      </p>
    ),
  },
]

export default function Page() {
  return (
    <article className='mx-auto max-w-3xl px-6 py-12'>
      <motion.header
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
          ease: 'easeOut',
        }}
        className='mb-12 space-y-4'
      >
        <h1 className='text-4xl font-bold tracking-tight'>Terms of Service</h1>
        <p className='text-muted-foreground'>Effective date: July 28, 2026</p>
        <p className='text-muted-foreground'>
          These Terms of Service govern your use of Trinity. By creating an
          account or using the application, you agree to these terms.
        </p>
      </motion.header>

      <div className='space-y-10'>
        {sections.map((section, index) => (
          <motion.section
            key={section.title}
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.35,
              ease: 'easeOut',
              delay: index * 0.03,
            }}
            className='space-y-3'
          >
            <h2 className='text-xl font-semibold'>{section.title}</h2>

            <div className='text-muted-foreground leading-7'>
              {section.content}
            </div>
          </motion.section>
        ))}
      </div>
    </article>
  )
}
