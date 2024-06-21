function isValidPhoneNumber(phoneNumber) {
    // Regular expression to match a typical phone number format
    var phonePattern = /^\d{10}$/;
  
    // Check if the phone number matches the pattern
    return phonePattern.test(phoneNumber);
  }


module.exports = {isValidPhoneNumber};