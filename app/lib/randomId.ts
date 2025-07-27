export const generateRandomId = () => {
  const cricketers = [
    "thala",
    "kohli",
    "vroomrah",
    "lee",
    "starcy",
    "groot",
    "stoke",
    "steyn",
  ];
  const randomIndex = Math.floor(Math.random() * 8);
  const lotteryName = cricketers[randomIndex].toUpperCase();
  const result = getRandomNum();
  return `${lotteryName}_${result}`;
};

export const getStadium = () => {
  const stadium = ["eden", "wankhede", "lords", "perth", "sydney"];
  const randomIndex = Math.floor(Math.random() * 5);
  const lotteryStadium = stadium[randomIndex].toUpperCase();
  const num = getRandomNum();
  return `${lotteryStadium}_${num}`;
};

const getRandomNum = () => {
  const characters = "0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }
  return result;
};
