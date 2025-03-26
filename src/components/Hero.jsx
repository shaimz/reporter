import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ListIssues from './List/ListIssues.jsx'


const Hero = () => {

    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div className='text-center min-h-[300px] mt-20 merriweather overflow-hidden'>
            
            <motion.h1

                initial={{ x: -1000 }}
                animate={{ x: 0 }}
                transition={{
                    duration: 1,
                    delay: 0.2,
                }}
                className='text-4xl md:text-6xl text-slate-900 font-bold my-10'>
                Raporteaza problemele din orasul tau
            </motion.h1>

            <ListIssues />
            {
                !user ?
                    <motion.div
                        initial={{ x: -1000 }}
                        animate={{ x: 0 }}
                        transition={{
                            duration: 1,
                            delay: 0.2,
                        }} className='flex justify-center gap-8 my-8'>

                        <Link to={'/signup'}>
                            <button className='bg-slate-800 text-white flex gap-3 border-2 border-white
                        py-5 px-3 lg:px-16 shadow-md shadow-slate-500 text-xl md:text-2xl'>
                                Register Now
                            </button>
                        </Link>

                        <Link to={'/login'}>
                            <button className='bg-green-400 text-slate-900 flex gap-3 border-2 border-white
                    py-5 px-3 lg:px-6 shadow-md shadow-slate-500 text-xl md:text-2xl'>Log-In</button>
                        </Link>

                    </motion.div>
                    :

                    ""
            }


        </div>

    )
}

export default Hero