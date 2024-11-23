import ScrollToTopButton from '@/components/footer/scroll-to-top'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { Link, useRouterState } from '@tanstack/react-router'

export default function Footer() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const pathIsTasks = pathname.includes('/tasks')

  return (
    !pathIsTasks && (
      <footer className='mt-auto flex w-full flex-col pt-4'>
        <ScrollToTopButton />
        <div className='grid select-none grid-cols-1 gap-1 px-2 text-xs text-muted-foreground md:grid-cols-3'>
          <p className='text-center md:text-left'>
            © {new Date().getFullYear()}{' '}
            <a target='_blank' rel='noreferrer' href='https://spweb.dev'>
              SP Web Development
            </a>
          </p>{' '}
          <div className='text-center'>
            <a
              target='_blank'
              rel='noreferrer'
              className='flex items-center justify-center'
              href='https://github.com/s-petr/longhabit'>
              <GitHubLogoIcon className='mr-2' /> Source Code
            </a>
          </div>
          <p className='text-center md:text-right'>
            <Link to='/privacy-policy'>Privacy Policy</Link>
          </p>
        </div>
      </footer>
    )
  )
}