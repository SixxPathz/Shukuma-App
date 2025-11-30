import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadAllCards } from '../utils/loadCards';

const DisclaimerContext = createContext({
  hasSeenDisclaimer: false,
  acceptDisclaimer: () => {}
});

export const useDisclaimer = () => useContext(DisclaimerContext);

export const DisclaimerProvider = ({ children }) => {
  const [hasSeenDisclaimer, setHasSeenDisclaimer] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [disclaimerCard, setDisclaimerCard] = useState(null);

  useEffect(() => {
    const accepted = localStorage.getItem('shukumaDisclaimerAccepted') === 'true';
    if (!accepted) {
      setShowDisclaimerModal(true);
    }
    setHasSeenDisclaimer(accepted);

    // Load disclaimer card from cards
    try {
      const allCards = loadAllCards();
      const found = allCards.find(c => c.type === 'disclaimer');
      if (found) {
        setDisclaimerCard(found);
      }
    } catch (err) {
      // ignore for dev environment where loadAllCards might rely on bundler
      console.warn('Could not load disclaimer card:', err);
    }
  }, []);

  const acceptDisclaimer = () => {
    setHasSeenDisclaimer(true);
    setShowDisclaimerModal(false);
    localStorage.setItem('shukumaDisclaimerAccepted', 'true');
  };

  return (
    <DisclaimerContext.Provider value={{ hasSeenDisclaimer, acceptDisclaimer }}>
      {showDisclaimerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full p-6 border-4 border-black">
            {disclaimerCard?.imagePath ? (
              <div className="w-full h-[70vh] mb-4 overflow-hidden flex items-center justify-center">
                <img src={disclaimerCard.imagePath} alt="Disclaimer content" className="max-h-full w-full object-contain" />
              </div>
            ) : (
              <div className="w-full h-48 flex items-center justify-center mb-4">
                <h2 className="text-xl text-black">Disclaimer</h2>
              </div>
            )}
            <div className="flex gap-4">
              <button
                onClick={acceptDisclaimer}
                className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {children}
    </DisclaimerContext.Provider>
  );
};

export default DisclaimerContext;
