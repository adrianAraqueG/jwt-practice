const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();




app.get('/api', (req, res) =>{
    res.json({
        mensaje: "API con NodeJS / JWT / Express"
    });
});




/**
 * 1- La variable 'verify' simula la verificación del usuario.
 * 2- En caso de que pase la verificación, con la función callback respondemos con el token.
 * 3- En caso de que NO pase la verificación, devolvemos un mensaje de error
 */
app.post('/api/login', (req, res) =>{
    const verify = true;

    if(verify){
        const user = {
            id: 1,
            user: 'Henry',
            email: 'henry@henry.com'
        }
    
        jwt.sign({user: user}, 'secretkey', (err, token) =>{
            res.json({
                token: token
            });
        });

    }else{
        res.json({
            msj: "Usuario o contraseña incorrectos"
        });
    }
});



/**
 * 1- Pasamos a la ruta el Middleware 'verifyToken', en caso de pasar tendrémos en la cabecera el token
 * 2- Usamos jwt.verify para verificar el usuario, si nos da un error devolvemos el estatus 403, sino, seguimos la ejecución
 */
app.post('/api/loged', verifyToken , (req, res) =>{
    
    jwt.verify(req.token, 'secretkey', (err, authdata) =>{
        if(err){
            res.sendStatus(403);
        }else{
            res.json({
                mensaje: "Estás logueado...",
                authdata: authdata
            });
        }
    });

});


// Middleware
/**
 * 1- En 'bearerHeader' almacenamos la 'clave' authorization recibida por las cabeceras
 * 2- Verificamos que esa cabecera exista: en caso de existir seteamos una nueva variable en la cabecera
 *    llamada 'token' y ejecutamos el siguiente middleware.
 * 2.1 - El split se utiliza para separar 'Bearer' del token ya que viene con la siguiente sintaxis: 
 *      Authorization: Bearer <token>
 */
function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== undefined){
        const token = bearerHeader.split(" ")[1];
        req.token = token;

        next();
    }else{
        res.sendStatus(403);
    }
}




// Server
app.listen(3000, () =>{
    console.log('nodejsapp running...');
});