import { connection } from '../commons/interfaces.js';
import ldap from 'ldapjs';

const createClient = () => {
    let client = ldap.createClient({
        url: connection.LDAP
    });
    return client;
}

const createEntry = entry => {
    return new Promise((resolve, reject) => {
        const baseDN = 'dc=iris,dc=com'
    
        let client = createClient();
        client.bind(`cn=admin,${baseDN}`, 'admin', error => {
            if(error)
                reject(error);
    
            client.add(`${entry.dn},${baseDN}`, entry.data, error => {
                if(error)
                    reject(error);
    
                resolve();
            });
        });
    });
}

const modifyEntryField = (userId, key, value) => {
    return new Promise((resolve, reject) => {
        let client = createClient();
        let cn = (userId.includes('+')) ? userId.split('+')[1]: userId;
        let dn = `cn=${cn},ou=sa,dc=iris,dc=com`;

        let modification = {};
        modification[key] = value;

        const change = new ldap.Change({
            operation: 'replace',
            modification: modification
        });

        client.bind('cn=admin,dc=iris,dc=com', 'admin', err => {
            if(err)
                reject(err);

            client.modify(dn, change, err => {
                if(err) 
                    reject(err);
                
                resolve();
            });
        });
    });
}

export function searchUserLDAP(userId){
    return new Promise((resolve, reject) => {
        let user = null;
        let opts = {
            filter: `(&(objectClass=inetOrgPerson)(uid=${userId}))`,
            scope: 'sub',
            attributes: []
        }

        let client = createClient();

        client.bind('cn=admin,dc=iris,dc=com', 'admin', (error)=>{
            if(error)
                reject(error);

            client.search('dc=iris,dc=com', opts, (error, res) => {
                res.on('searchEntry', entry => { user = entry.object });
                res.on('error', err => { reject(err) });
                res.on('end', () => { resolve(user) });
            })
        });
    });
}

export function createUserLDAP(userId, name){
    return new Promise( async (resolve, reject) => {
        try {

            let uidNumber = (userId.includes('+')) ? userId.split('+')[1]: userId;
            let fullName = name.split(' ');

            let dn = `cn=${uidNumber},ou=sa`;
            let user = { 
                givenname: fullName[0],
                sn: (fullName.length > 1) ?  fullName[1] : firstName,
                uid: userId,
                userPassword: name,
                uidNumber: uidNumber,
                gidNumber: '500',
                homeDirectory: `/home/users/${userId}`,
                objectClass: [ 'inetOrgPerson', 'posixAccount', 'top' ]
            };

            let entry = { dn: dn, data: user };
            await createEntry(entry);

            let createdUser = await searchUserLDAP(userId);
            resolve(createdUser);
        }
        catch(e){
            reject(e);
        }
    });
}

export function modifyUserLDAP(userId, name){
    return new Promise( async (resolve, reject) => {
        
        let fullName = name.split(' ');
        let firstName = fullName[0];
        let lastName = (fullName.length > 1) ?  fullName[1] : firstName;

        try{
            await modifyEntryField(userId, 'givenname', firstName);
            await modifyEntryField(userId, 'sn', lastName);
            await modifyEntryField(userId, 'userPassword', name);
            let user = await searchUserLDAP(userId);
            resolve(user);
        }
        catch(e){
            reject(e);
        }
        
    });
}

export function deleteUserLDAP(userId){
    return new Promise((resolve, reject) => {

        let cn = (userId.includes('+')) ? userId.split('+')[1]: userId;
        let dn = `cn=${cn},ou=sa,dc=iris,dc=com`;
        
        let client = createClient();

        client.bind('cn=admin,dc=iris,dc=com', 'admin', err => {
            if(err)
                reject(err);

            client.del(dn, err => {
                if(err)
                    reject(err);

                resolve();
            });
        });
    });
}

export const createGroupLDAP = (groupId, groupName) => {
    return new Promise( async (resolve, reject) => {
        try{
            let dn = `cn=${groupName}`;
            let group = {
                cn: groupName,
                gidNumber: groupId,
                objectclass: ['posixGroup', 'top']
            };
    
            let entry = { dn: dn, data: group };
    
            await createEntry(entry);
            resolve();
        }
        catch(e){
            reject(e);
        }
        
    });
}

export const createOrganizationalUnitLDAP = ouName => {
    return new Promise( async (resolve, reject) => {
        try{
            let dn = `ou=${ouName}`;
            let ou = {
                objectclass: ['organizationalUnit', 'top']
            };
    
            let entry = { dn: dn, data: ou };
    
            await createEntry(entry);
            resolve();
        }
        catch(e){
            reject(e);
        }
        
    });
}