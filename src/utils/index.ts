import bcrypt from "bcrypt";

export const emailIsValid = (email: string): boolean => {
  return (
    email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ) !== null
  );
};

export const passwordIsValid = (value: string): boolean => {
  const minimumLength: number = 8;
  const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const checkForSpecialChar = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

  const hasMinimumLength: boolean = value.length >= minimumLength;
  const containsADigit: boolean = digits.some((digit) => value.includes(digit));
  const containsSpecialChar: boolean =
    value.match(checkForSpecialChar) !== null;

  return hasMinimumLength && containsADigit && containsSpecialChar;
};

export const hashAString = (value: string): string => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(value, salt);
};

export const stringEqualsHash = (string: string, hash: string): boolean => {
  return bcrypt.compareSync(string, hash);
};
