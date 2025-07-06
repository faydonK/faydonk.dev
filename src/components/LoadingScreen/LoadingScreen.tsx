// import React, { useState, useEffect } from 'react';
// import pfpLogo from '../../assets/images/pfp_faydonk.png';
// import './LoadingScreen.css';

// const LoadingScreen: React.FC = () => {
//   const [showWelcome, setShowWelcome] = useState(false);
//   const [startTransition, setStartTransition] = useState(false);

//   useEffect(() => {
//     const welcomeTimer = setTimeout(() => {
//       setShowWelcome(true);
//     }, 500);

//     const transitionTimer = setTimeout(() => {
//       setStartTransition(true);
//     }, 2500);

//     return () => {
//       clearTimeout(welcomeTimer);
//       clearTimeout(transitionTimer);
//     };
//   }, []);

//   return (
//     <div className={`loading-screen ${startTransition ? 'transitioning' : ''}`}>
//       <div className="loading-content">
//         <div className={`profile-picture-loading ${startTransition ? 'transition-to-hero' : ''}`}>
//           <img src={pfpLogo} alt="faydonK Profile" />
//         </div>
//         {showWelcome && !startTransition && (
//           <div className="welcome-message">
//             <h2>Welcome!</h2>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LoadingScreen;