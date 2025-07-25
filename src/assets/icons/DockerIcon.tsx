import React from 'react';

const DockerIcon: React.FC<{ size?: number }> = ({ size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="14" fill="#1794D4"/>
    <path d="M18 7H16V9H18V7Z" fill="white"/>
    <path d="M10 10H12V12H10V10Z" fill="white"/>
    <path d="M6.00155 16.9414C6.17244 19.8427 7.90027 24 14 24C20.8 24 23.8333 19 24.5 16.5C25.3333 16.5 27.2 16 28 14C27.5 13.5 25.5 13.5 24.5 14C24.5 13.2 24 11.5 23 11C22.3333 11.6667 21.3 13.4 22.5 15C22 16 20.6667 16 20 16H6.9429C6.41342 16 5.97041 16.4128 6.00155 16.9414Z" fill="white"/>
    <path d="M9 13H7V15H9V13Z" fill="white"/>
<path d="M10 13H12V15H10V13Z" fill="white"/>
<path d="M15 13H13V15H15V13Z" fill="white"/>
<path d="M16 13H18V15H16V13Z" fill="white"/>
<path d="M21 13H19V15H21V13Z" fill="white"/>
<path d="M15 10H13V12H15V10Z" fill="white"/>
<path d="M16 10H18V12H16V10Z" fill="white"/>
</svg>
);

export default DockerIcon;