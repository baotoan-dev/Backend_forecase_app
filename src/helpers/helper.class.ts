import { generate } from 'otp-generator';
import isNumeric from 'validator/lib/isNumeric';


class Helper {
  checkEmailFormat(email: string): boolean {

    const emailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    return emailRegex.test(email);
  }

  checkPhoneNumberFormat(phoneNumber: string): boolean {
    // const phoneNumberRegexWith0 = new RegExp(/^(0[2|3|5|7|8|9])+([0-9]{8,9})\b$/)
    // const phoneNumberRegexWith84 = new RegExp(/^(84)+([0-9]{9,11})\b$/)

    // return phoneNumberRegexWith0.test(phoneNumber) || phoneNumberRegexWith84.test(phoneNumber);
    return isNumeric(phoneNumber.replace(/ /g, "").replace(/-/g, "").replace(/\+/g, ""));
  }

  formatPhoneNumber(phoneNumber: string): string | null {
    //Vietnamese phone number
    //+84 123 456 789
    //+84123456789
    //0123456789 -> +84 123 456 789
    //+84 0123456789 -> +84123456789
    if (!phoneNumber) {
      return null;
    }
    // if (phoneNumber.startsWith("0")) {
    //   phoneNumber = phoneNumber.replace(/ /g, "").replace(/-/g, "").replace(/\+/g, "");
    //   //if phone number start with 0 and length is 10
    //   //replace 0 with +84
    //   if (phoneNumber.length === 10 || phoneNumber.length === 11) {
    //     phoneNumber = "84" + phoneNumber.substring(1);
    //   } else {
    //     return "";
    //   }
    // } else {
    //   if (phoneNumber.startsWith("84")) {
    //     if (phoneNumber.length === 12 && phoneNumber.startsWith("840")) {
    //       //+84 0 and length is 13
    //       phoneNumber = "84" + phoneNumber.substring(3);
    //     }
    //     else {
    //       if (phoneNumber.length === 11 || phoneNumber.length === 12) {
    //         phoneNumber = phoneNumber;
    //       } else {
    //         return "";
    //       }
    //     }
    //   } else {
    //     return "";
    //   }
    // }
    phoneNumber = phoneNumber.replace(/ /g, "").replace(/-/g, "").replace(/\+/g, "");
    if (phoneNumber.startsWith("0")) {
      //replace 0 with 84
      phoneNumber = "84" + phoneNumber.substring(1);
      return phoneNumber
    }
    if (phoneNumber.startsWith("840")) {
      // replace 840 with 84
      return phoneNumber = "84" + phoneNumber.substring(3);
    }
    if (phoneNumber.startsWith("8484")) {
      // replace 8484 with 84
      return phoneNumber = "84" + phoneNumber.substring(4);
    }
    return phoneNumber;
}


  // generateOTP(): string {
  //   let OTP: string = "";

  //   for (let i = 0; i < 6; i++) {
  //     OTP += Math.floor(Math.random() * 10);
  //   }

  //   return OTP;
  // }
  generateOTP(): string {
    return generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false, digits: true });
  }
}

export default Helper;