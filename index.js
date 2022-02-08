import express from 'express';
import bodyParser from "body-parser";
import ldap from "./controllers/ldapController.js"
import authentication from "./controllers/authenticationController.js"

const app = express();
const port = 9000;

app.use(bodyParser.json());
app.post('/ldap/findUser', (req, res) => {
    ldap.findUser(req, res);
});

app.post('/ldap/createUser', (req, res) => {
    ldap.createUser(req, res);
});

app.put('/ldap/modifyUser', (req, res) => {
    ldap.modifyUser(req, res);
});

app.delete('/ldap/deleteUser', (req, res) => {
    ldap.deleteUser(req, res);
});

app.post('/ldap/createGroup', (req, res) => {
    ldap.createGroup(req, res);
});

app.post('/ldap/createOrganizationalUnit', (req, res) => {
    ldap.createOrganizationalUnit(req, res);
});

app.post('/ldap/verifyAccount', (req, res) => {
    authentication.verifyAccount(req, res);
})

app.get('/ldap', (req, res) => {
    res.send(`El servidor está activo`)
});

app.listen(port, () => {
    console.log(`El servidor está inicializado en el puerto ${port}`)
});