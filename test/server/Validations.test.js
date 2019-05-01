const userManager = require('server/UserManager');
const bcrypt = require('bcryptjs');

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
    });

})

describe("Validate birth date", () => {

    it("Validate correct birth date", () => {
        let birthDate = "1996-01-06";
        let errors = userManager.validateBirthdate(birthDate);
        expect(errors.length).toEqual(0);
    });

    it("Validate wrong birth date format", () => {
        let birthDate = "01-996";
        let errors = userManager.validateBirthdate(birthDate);
        expect(errors.length).toEqual(1);
        expect(errors[0]).toEqual(userManager.INVALID_BIRTHDATE_ERROR);
    });

    it("Validate null birth date", () => {
        let birthDate = null;
        let errors = userManager.validateBirthdate(birthDate);
        expect(errors.length).toEqual(1);
        expect(errors[0]).toEqual(userManager.INVALID_BIRTHDATE_ERROR);
    });

    it("Validate future birth date", () => {
        let birthDate = "2019-10-10";
        let errors = userManager.validateBirthdate(birthDate);
        expect(errors.length).toEqual(1);
        expect(errors[0]).toEqual(userManager.BIRTHDATE_IN_FUTURE_ERROR);
    });

})

describe("Validate email", () => {

    const dbHandler = require('server/database_handler');

    beforeAll(() => {
        jest.unmock('server/database_handler.js');
        dbHandler.hasUserByEmail = jest.fn();
    });

    it('Test correct email format', async() => {
        dbHandler.hasUserByEmail.mockReturnValue(false);
        let email = "moamenelbaroudy.me@gmail.com";
        let errors = await userManager.validateEmail(email);
        expect(errors.length).toEqual(0);
    });

    it('Test incorrect email format', async() => {
        dbHandler.hasUserByEmail.mockReturnValue(false);
        let email = "this is wrong email format";
        let errors = await userManager.validateEmail(email);
        expect(errors.length).toEqual(1);
        expect(errors[0]).toEqual(userManager.INVALID_EMAIL_ERROR);
    });

    it('test duplicate email format', async() => {
        dbHandler.hasUserByEmail.mockReturnValue(true);
        let email = "moamenelbaroudy.me@gmail.com";
        let errors = await userManager.validateEmail(email);
        expect(errors.length).toEqual(1);
        expect(errors[0]).toEqual(userManager.DUPLICATE_EMAIL_ERROR);
    })

})

describe("Validate new password", () => {

    it("Validate correct old password", async() => {
        let newInfo = {
            oldPassword: "ThisisoldPassword",
            password: "ThisisnewPassword",
            confirmPassword: "ThisisnewPassword",
            fullName: "test",
            birthdate: "1996-01-06"
        };
        let passwordSalt = bcrypt.genSaltSync(3);
        let session = {
            user: {
                passwordSalt: passwordSalt,
			    hashedPassword: bcrypt.hashSync(newInfo.oldPassword, passwordSalt)
            }
        };
        let errors = await userManager.validateNewInfo(session, newInfo);
        console.log(errors)
        expect(errors.length).toEqual(0);
    });

    it("Validate incorrect old password", async() => {
        let newInfo = {
            oldPassword: "ThisisoldPassword",
            password: "ThisisnewPassword",
            confirmPassword: "ThisisnewPassword",
            fullName: "test",
            birthdate: "1996-01-06"
        };
        let passwordSalt = bcrypt.genSaltSync(3);
        let session = {
            user: {
                passwordSalt: passwordSalt,
			    hashedPassword: "13245"
            }
        };
        let errors = await userManager.validateNewInfo(session, newInfo);
        
        expect(errors.length).toEqual(1);
        expect(errors[0]).toEqual(userManager.WRONG_PASSWORD);
    });

    it("Validate mismatch newpassword and confirm password", async() => {
        let newInfo = {
            oldPassword: "ThisisoldPassword",
            password: "ThisisnewPassword",
            confirmPassword: "ThisisnotnewPassword",
            fullName: "test",
            birthdate: "1996-01-06"
        };
        let passwordSalt = bcrypt.genSaltSync(3);
        let session = {
            user: {
                passwordSalt: passwordSalt,
			    hashedPassword: bcrypt.hashSync(newInfo.oldPassword, passwordSalt)
            }
        };
        let errors = await userManager.validateNewInfo(session, newInfo);
        expect(errors.length).toEqual(1);
        expect(errors[0]).toEqual(userManager.NON_MATCHING_PASSWORD_ERROR);
    });

    it("Validate short new password", async() => {
        let newInfo = {
            oldPassword: "ThisisoldPassword",
            password: "short",
            confirmPassword: "short",
            fullName: "test",
            birthdate: "1996-01-06"
        };
        let passwordSalt = bcrypt.genSaltSync(3);
        let session = {
            user: {
                passwordSalt: passwordSalt,
			    hashedPassword: bcrypt.hashSync(newInfo.oldPassword, passwordSalt)
            }
        };
        let errors = await userManager.validateNewInfo(session, newInfo);
        expect(errors.length).toEqual(1);
        expect(errors[0]).toEqual(userManager.SHORT_PASSWORD_ERROR);
    });
})
