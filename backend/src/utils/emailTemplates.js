exports.setPasswordEmail = (link) => {
    return `
        <h2>Set Your Password</h2>
        <p>Your account has been activated.</p>
        <p>Click the link below to set your password: </p>
        <a href="${link}">${link}</a>
        <p>This link expires in 30 minutes.</p>
    `;
};