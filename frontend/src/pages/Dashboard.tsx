import React from 'react'
import Calendar from '@/components/ui/calendar';

function Dashboard() {
  return (
    <div className='w-full min-h-screen flex flex-col items-center'>
        
        <h1>welcome to the dashboard</h1>

        <div className='flex flex-col items-center'>
        <h2>your status</h2>
        <Calendar/>
        </div>

        <div></div>
        </div>

  )
}

export default Dashboard;