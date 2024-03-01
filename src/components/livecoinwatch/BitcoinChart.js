import React, { useEffect } from 'react';

const BitcoinChart = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://www.livecoinwatch.com/static/lcw-widget.js";
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="livecoinwatch-widget-1 m-0" 
         lcw-coin="BTC" 
         lcw-base="INR" 
         lcw-secondary="BTC" 
         lcw-period="d" 
         lcw-color-tx="#000000" 
         lcw-color-pr="#0693e3" 
         lcw-color-bg="#ffffff" 
         lcw-border-w="1">
    </div>
  );
};

export default BitcoinChart;
