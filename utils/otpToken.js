const otpToken = () => {
    const generateRandom4DigitNumber = () => {
        const min = 1000; 
        const max = 9999; 
      
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomNum;
      };
      
      
      const randomNum = generateRandom4DigitNumber();
      return String(randomNum);
};

module.exports = otpToken;