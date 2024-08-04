"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import { UserAuth } from '../context/AuthContext';

const NavBar: React.FC = () => {
  // const authContext = UserAuth();

  // if (!authContext) {
  //   return null;
  // }

  const { user, GoogleSignIn, logOut } = UserAuth();
  const [loading, setLoading] = useState(true);
  
  
  const handleSignIn = async () => {
    try {
      await GoogleSignIn();
    } catch (error) {
      console.log(error);
    }
  }

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user])

  return (
    <section>
      <div className="flex justify-between items-center p-4 border-b-2 h-14">
        <ul className="flex flex-row">
          <li className='mx-2'><Link href='/'>Home</Link></li>
          <li className='mx-2'><Link href='/'>Home</Link></li>
        </ul>
        <ul>
        {loading ? null : !user ? (<div className="flex flex-row"><li className='mx-2' onClick={handleSignIn}><Link href='/'>Login</Link></li>
          <li className='mx-2' onClick={handleSignIn}><Link href='/'>Signup</Link></li></div>) : (<li className='mx-2 cursor-pointer' onClick={handleSignOut}><Link href='/'>Logout</Link></li>)}
        </ul>
      </div>
    </section>
  )
}

export default NavBar;