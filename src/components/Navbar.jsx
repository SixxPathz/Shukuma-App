import { Link, useLocation } from 'react-router-dom';
import backLogo from '../../Shukuma Cards_Full Deck/back of card image.jpg';
import { useAuth } from '../context/AuthContext';
import homeIcon from '../assets/home.png';
import exercisesIcon from '../assets/navbar-exercise.png';
import randomIcon from '../assets/navbar-random.png';
import profileIcon from '../assets/profile.png';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', iconSrc: homeIcon },
    { path: '/exercises', label: 'Exercises', iconSrc: exercisesIcon },
    { path: '/random', label: 'Random Workout', iconSrc: randomIcon },
    { path: '/profile', label: 'Profile', iconSrc: profileIcon }
  ];

  const { user, logout } = useAuth();
  
  // Only show navbar if user is authenticated
  if (!user) {
    return null;
  }
  
  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:block bg-black shadow-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src={backLogo} alt="Shukuma Logo" className="h-10 w-10 object-contain rounded" />
              <h1 className="text-2xl font-bold text-white">Shukuma</h1>
            </div>
            <div className="flex space-x-4 items-center">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors group ${
                    isActive(item.path)
                      ? 'bg-white text-black'
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <img
                    src={item.iconSrc}
                    alt={`${item.label} icon`}
                    className={`h-5 w-5 transition-all ${item.path === '/profile' ? 'rounded-full object-cover inline-block mr-2' : 'object-contain inline-block mr-2'} ${isActive(item.path) ? 'filter invert' : 'group-hover:brightness-90'}`}
                  />
                  {item.label}
                </Link>
              ))}
              {/* Profile item already included as a nav item; keep sign out button */}
              <button onClick={logout} className="px-4 py-2 rounded-lg font-medium border-2 border-white text-white hover:bg-white hover:text-black transition-colors">Sign Out</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black shadow-lg border-t border-gray-800 z-50">
        {/* Use equal-width items so all icons fit regardless of label text */}
        <div className="flex justify-around items-center h-16 px-1">
          {/* Use equally-spaced icons and hide mobile labels for more room */}
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`w-1/5 flex flex-col items-center justify-center h-full transition-colors ${
                isActive(item.path)
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:bg-white/10'
              }`}
            >
              <img src={item.iconSrc} alt={`${item.label} icon`} className={`h-6 w-6 mb-0 rounded-full object-cover transition-all ${isActive(item.path) ? 'filter invert' : 'hover:brightness-90'}`} />
              <span className="sr-only">{item.label}</span>
            </Link>
          ))}
          {/* Sign Out button for mobile */}
          <button
            onClick={logout}
            aria-label="Sign Out"
            className="w-1/5 flex flex-col items-center justify-center h-full text-gray-400 hover:bg-white/10"
          >
            {/* Inline logout SVG to avoid adding a new asset */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 17l5-5m0 0l-5-5m5 5H9" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19H5a2 2 0 01-2-2V7a2 2 0 012-2h4" />
            </svg>
            <span className="sr-only">Sign Out</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
