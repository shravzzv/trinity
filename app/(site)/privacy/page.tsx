'use client'

import { motion } from 'motion/react'
import Link from 'next/link'

const sections = [
  {
    title: '1. Information We Collect',
    content: (
      <>
        <p>
          Trinity collects only the information necessary to provide the
          application and improve your experience.
        </p>

        <ul className='mt-4 list-disc space-y-2 pl-6'>
          <li>Account information such as your email address.</li>
          <li>Your fasting sessions and related progress data.</li>
          <li>Basic technical information required to operate the service.</li>
        </ul>
      </>
    ),
  },
  {
    title: '2. How We Use Your Information',
    content: (
      <>
        <p>Your information is used to:</p>

        <ul className='mt-4 list-disc space-y-2 pl-6'>
          <li>Provide and maintain Trinity.</li>
          <li>Authenticate your account securely.</li>
          <li>Sync your fasting history across devices.</li>
          <li>Improve reliability, security, and performance.</li>
          <li>Respond to support requests.</li>
        </ul>
      </>
    ),
  },
  {
    title: '3. Google Account Information',
    content: (
      <p>
        If you choose to sign in with Google, Trinity only accesses the basic
        profile information that you authorize Google to share, such as your
        name, email address, and profile picture. This information is used
        solely for authentication and account personalization. Trinity does not
        access your Google Drive, Gmail, Calendar, Contacts, or any other Google
        services.
      </p>
    ),
  },
  {
    title: '4. Data Sharing',
    content: (
      <p>
        Trinity does not sell, rent, or trade your personal information. Your
        information is only shared with trusted service providers when necessary
        to operate the application, such as authentication, database hosting,
        and infrastructure providers.
      </p>
    ),
  },
  {
    title: '5. Data Storage',
    content: (
      <p>
        Your data is stored securely using industry-standard cloud
        infrastructure. Reasonable administrative, technical, and organizational
        measures are taken to protect your information from unauthorized access,
        disclosure, or loss.
      </p>
    ),
  },
  {
    title: '6. Cookies and Authentication',
    content: (
      <p>
        Trinity uses secure authentication cookies and similar technologies to
        keep you signed in and protect your account. These technologies are
        essential for the application to function properly.
      </p>
    ),
  },
  {
    title: '7. Data Retention',
    content: (
      <p>
        We retain your information only for as long as your account remains
        active or as necessary to provide the service and comply with applicable
        legal obligations.
      </p>
    ),
  },
  {
    title: '8. Your Rights',
    content: (
      <>
        <p>Depending on your jurisdiction, you may have the right to:</p>

        <ul className='mt-4 list-disc space-y-2 pl-6'>
          <li>Access your personal information.</li>
          <li>Correct inaccurate information.</li>
          <li>Request deletion of your account and associated data.</li>
          <li>Withdraw consent where applicable.</li>
        </ul>
      </>
    ),
  },
  {
    title: `9. Children's Privacy`,
    content: (
      <p>
        Trinity is not intended for children under the age of 13. We do not
        knowingly collect personal information from children. If you believe a
        child has provided personal information, please contact us so that we
        can remove it promptly.
      </p>
    ),
  },
  {
    title: '10. Changes to This Privacy Policy',
    content: (
      <p>
        We may update this Privacy Policy from time to time. When changes are
        made, the effective date at the top of this page will be updated.
        Continued use of Trinity after changes become effective constitutes
        acceptance of the revised policy.
      </p>
    ),
  },
  {
    title: '11. Contact',
    content: (
      <p>
        If you have any questions about this Privacy Policy or your personal
        information, please contact us at using the{' '}
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
        <h1 className='text-4xl font-bold tracking-tight'>Privacy Policy</h1>

        <p className='text-muted-foreground'>Effective date: July 28, 2026</p>

        <p className='text-muted-foreground'>
          Your privacy is important to us. This Privacy Policy explains what
          information Trinity collects, how it is used, and the choices you have
          regarding your information.
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
