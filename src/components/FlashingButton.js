import React, { useState, useEffect } from 'react';

const FlashingButton = () => {
    const [isFlashing, setIsFlashing] = useState(false);

    // Function to toggle flashing state
    const toggleFlashing = () => {
        setIsFlashing((prevFlashing) => !prevFlashing);
    };

    // Effect to start flashing on mount and stop on unmount
    useEffect(() => {
        const interval = setInterval(toggleFlashing, 1000); // Toggle every 1 second
        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    return (
        <button
            className={`flashing-button ${isFlashing ? 'flash' : ''}`}
            onClick={toggleFlashing}
        >
            Flashing Button
        </button>
    );
};

export default FlashingButton;
