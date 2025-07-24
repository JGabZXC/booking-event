export const validateWord = (name) => {
  const arrayName = name.split(" ");
  const validatedName = arrayName.every((name) => {
    const nameRegex = /^[A-Za-z]+$/;
    return nameRegex.test(name);
  });
  return validatedName;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validatePasswordConfirm = (password, passwordConfirm) => {
  return password === passwordConfirm;
};

export const validateFullName = (name) => {
  return name
    .trim()
    .split(/\s+/)
    .every((part) => validateWord(part));
};
