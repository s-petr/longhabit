import { Link } from '@tanstack/react-router'
import { BrainCircuitIcon, CircleHelpIcon, ListTodoIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <main className='mx-auto flex max-w-3xl flex-col items-center gap-y-12 px-4'>
      <section className='w-full space-y-3 text-center'>
        <h1 className='my-6 text-5xl font-bold'>
          Long<span className='text-primary'> Habit</span>
        </h1>
        <h2 className='text-2xl font-semibold'>
          Effective tracking for long-term habits
        </h2>
        <p className='text-muted-foreground text-xl font-light'>
          Inspired by research from James Clear&apos;s bestseller{' '}
          <a
            target='_blank'
            rel='noreferrer'
            className='hover:underline'
            href='https://jamesclear.com/atomic-habits'>
            Atomic Habits
          </a>
          , Long Habit makes managing recurring tasks straightforward and
          enjoyable, helping you build lasting routines with ease.
        </p>
      </section>

      <section className='flex w-full flex-col justify-center gap-4 sm:flex-row'>
        <Button asChild size='lg' className='w-full sm:w-40'>
          <Link to='/register'>Get Started</Link>
        </Button>
        <Button asChild variant='outline' size='lg' className='w-full sm:w-40'>
          <Link to='/login'>Log in</Link>
        </Button>
      </section>

      <section className='bg-popover w-full space-y-2 rounded-lg p-4'>
        <h2 className='flex items-center gap-x-2 text-2xl font-semibold'>
          <ListTodoIcon className='text-primary/80 size-6' /> How it Works
        </h2>
        <ol className='text-muted-foreground list-decimal space-y-2 pl-4 text-sm'>
          <li>Add tasks you want to track to the list</li>
          <li>Set a goal. How often do you want to repeat the task?</li>
          <li>Mark tasks as completed on the days you do them</li>
          <li>
            Get reminders when you miss your goal and tasks become overdue
          </li>
        </ol>
      </section>

      <section className='bg-popover w-full space-y-4 rounded-lg p-4'>
        <h2 className='flex items-center gap-x-2 text-2xl font-semibold'>
          <BrainCircuitIcon className='text-primary/80 size-6' /> Smart Features
        </h2>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div className='space-y-1'>
            <h4 className='font-semibold'>Simple Tracking</h4>
            <p className='text-muted-foreground text-sm'>
              See when you last completed each task and how many days have
              passed since
            </p>
          </div>
          <div className='space-y-1'>
            <h4 className='font-semibold'>Flexible Goals</h4>
            <p className='text-muted-foreground text-sm'>
              Set up intervals for each recurring task
            </p>
          </div>
          <div className='space-y-1'>
            <h4 className='font-semibold'>Smart Reminders</h4>
            <p className='text-muted-foreground text-sm'>
              Receive customizable notifications by email
            </p>
          </div>
          <div className='space-y-1'>
            <h4 className='font-semibold'>Easy Navigation</h4>
            <p className='text-muted-foreground text-sm'>
              Sort, search, filter and group tasks by category
            </p>
          </div>
        </div>
      </section>

      <section className='bg-popover mb-16 w-full space-y-4 rounded-lg p-4'>
        <h2 className='flex items-center gap-x-2 text-2xl font-semibold'>
          <CircleHelpIcon className='text-primary/80 size-6' /> Why Use Long
          Habit?
        </h2>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div className='space-y-1'>
            <h4 className='font-semibold'>Minimalist Design</h4>
            <p className='text-muted-foreground text-sm'>
              Light, fast and focused on the essential
            </p>
          </div>
          <div className='space-y-1'>
            <h4 className='font-semibold'>Completely Free</h4>
            <p className='text-muted-foreground text-sm'>
              No ads, no spam, no e-begging
            </p>
          </div>
          <div className='space-y-1'>
            <h4 className='font-semibold'>Privacy First</h4>
            <p className='text-muted-foreground text-sm'>
              Open source and self-hostable
            </p>
          </div>
          <div className='space-y-1'>
            <h4 className='font-semibold'>Access Anywhere</h4>
            <p className='text-muted-foreground text-sm'>
              Web-based, use from any device, anytime
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
