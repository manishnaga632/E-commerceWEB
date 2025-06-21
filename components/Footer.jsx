import React from 'react'
import Image from 'next/image'
import logo from '../public/assets/Logo.png'
import {GrFacebookOption, GrYoutube, GrInstagram  } from 'react-icons/gr'

const Footer = () => {
  return (
    <footer>
      <div className='footer'>
        <div className='logo'>
          <Image src={logo} width={180} height={30} alt='logo' />
          <p>Small, artisan label that offers a thoughtfully curated collection of high quality everyday essentials made.</p>
          <div className='icon-container'>
           <div>
                <a href={`https://www.facebook.com/ranveer.kumawat.716`} target="_blank" rel="noopener noreferrer">
                  <GrFacebookOption size={20} />
                </a>
            </div>
            <div>
                <a href={`https://www.youtube.com/@neverseen-2805`} target="_blank" rel="noopener noreferrer">
                  <GrYoutube size={20} />
                </a>
            </div>
            <div>
                <a href={`https://www.instagram.com/neverseen2805`} target="_blank" rel="noopener noreferrer">
                  <GrInstagram size={20} />
                </a>
            </div>
          </div>
        </div>

        <div className='footer-links'>
          <h3>Company</h3>
          <ul>
            <li>About</li>
            <li>Terms of Use</li>
            <li>Privacy Policy</li>
            <li>How it Works</li>
            <li>Contact Us</li>
          </ul>
        </div>

        <div className='footer-links'>
          <h3>Support</h3>
          <ul>
            <li>Support Carrer</li>
            <li>24h Service</li>
            <li>Quick Chat</li>
          </ul>
        </div>

        <div className='footer-links'>
          <h3>Contact</h3>
          <ul>
            <li>Whatsapp</li>
            <li>Support 24h</li>
          </ul>
        </div>
      </div>

      {/* <div className='copyright'>
        <p>Copyright © 2022 Dine Market</p>
        <p>Design by. <span>Gajanand Kumawat</span></p>
        <p>Code by. <span>shabrina12 on github</span></p>
      </div> */}
    </footer>
  )
}

export default Footer