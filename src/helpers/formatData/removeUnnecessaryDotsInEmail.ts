function removeUnnecessaryDots(email: string) {
    var email_s = email.split("@");
    if (!email_s[0]) return "";
    if (!email_s[1]) return "";
    return email_s[0].replace(/\./g, "") + "@" + email_s[1];
}

export default removeUnnecessaryDots;