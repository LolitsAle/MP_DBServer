const generateActivationCode = () => {
    //tạo code
    const code = Math.random().toString(36).substr(2, 7).toUpperCase()
    
    return code
}

module.exports = generateActivationCode