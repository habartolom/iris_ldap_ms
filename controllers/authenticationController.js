import { searchUserLDAP, createUserLDAP, modifyUserLDAP, deleteUserLDAP } from  '../services/ldapService.js'

const authentication = {
    verifyAccount: async (req, res) => {
        let userName = req.body.userName;
        let password = req.body.password;
        let response = await searchUserLDAP(userName);
        if(response?.userPassword === password)
            res.send({ success: true, message: "Acceso concedido" });
        else{
            res.status('400');
            res.send({ success: false, message: "Credenciales no válidas" });
        }
    }
};

export default authentication;