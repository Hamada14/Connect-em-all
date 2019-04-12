const userManager = require('server/UserManager'); 

describe("Validate password", () => {
    
    it("Validate correct password", () => {
        let password = "ThisiscorrectPassword";
        expect(userManager.validatePassword(password, password).length).toEqual(0); 
    });

    it("Validate missmatch password and confirmed password", () => {
        let password = "ThisIspassword";
        let confirmedPassword = "ThisIsMissmatchedPassword";
        let errors = userManager.validatePassword(password, confirmedPassword); 
        expect(errors.length).toEqual(1);
        expect(errors[0]).toEqual(userManager.NON_MATCHING_PASSWORD_ERROR);
    });

    it("Validate short password", () => {
        let password = "short";
        let errors = userManager.validatePassword(password, password);
        expect(errors.length).toEqual(1);
        expect(errors[0]).toEqual(userManager.SHORT_PASSWORD_ERROR);
    });

})

describe("Validate fullname", () => {
    
    it("Validate correct full name", () => {
        let fullName = "This is correct full name";
        expect(userManager.validateName(fullName).length).toEqual(0);
    });

    it("Validate null full name", () => {
        let fullName = null;
        let errors = userManager.validateName(fullName);
        expect(errors.length).toEqual(1);
        expect(errors[0]).toEqual(userManager.EMPTY_NAME_ERROR);
    });

    it("Validate empty full name", () => {
        let fullName = "";
        let errors = userManager.validateName(fullName);
        expect(errors.length).toEqual(1);
        expect(errors[0]).toEqual(userManager.EMPTY_NAME_ERROR);
    })

})