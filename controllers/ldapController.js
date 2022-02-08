import { searchUserLDAP, createUserLDAP, createGroupLDAP, createOrganizationalUnitLDAP, modifyUserLDAP, deleteUserLDAP } from  '../services/ldapService.js'

const ldap = {
    findUser: async (req, res) => {
        let userName = req.body.userName;
        const response = await searchUserLDAP(userName);

        if(response === null)
            res.status('404');
        
        res.send(response);
    },
    createUser: async (req, res) => {
        let userName = req.body.userName;
        let password = req.body.password;

        try{
            const response = await createUserLDAP(userName, password);
            res.send(response);
        }
        catch(e){
            res.status('400');
            res.send(e);
        }
    },
    modifyUser: async (req, res) => {
        let userName = req.body.userName;
        let password = req.body.password;

        try{
            const response = await modifyUserLDAP(userName, password);
            res.send(response);
        }
        catch(e){
            res.status('400');
            res.send(e);
        }
    },
    deleteUser: async (req, res) => {
        let userName = req.body.userName;

        try{
            const response = await deleteUserLDAP(userName);
            res.send(response);
        }
        catch(e){
            res.status('400');
            res.send(e);
        }
    },
    createGroup: async (req, res) => {
        let groupId = req.body.groupId;
        let groupName = req.body.groupName;

        try{
            const response = await createGroupLDAP(groupId, groupName);
            res.send(response);
        }
        catch(e){
            res.status('400');
            res.send(e);
        }
    },
    createOrganizationalUnit: async (req, res) => {
        let ouName = req.body.ouName;

        try{
            const response = await createOrganizationalUnitLDAP(ouName);
            res.send(response);
        }
        catch(e){
            res.status('400');
            res.send(e);
        }
    }
};

export default ldap;