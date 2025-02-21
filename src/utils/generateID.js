export const generateID = () => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");

  const randomPart = [...Array(6)]
    .map(() => Math.floor(Math.random() * 10).toString())
    .join("");

  const base = `${year}${month}${day}${randomPart}`;

  const checkDigit = calculateEAN13CheckDigit(base);

  return `${base}${checkDigit}`;
};

const calculateEAN13CheckDigit = (code) => {
  const digits = code.split("").map(Number);
  const sum = digits.reduce((acc, digit, index) => {
    return acc + digit * (index % 2 === 0 ? 1 : 3);
  }, 0);

  return (10 - (sum % 10)) % 10;
};
