import { Router } from "express";

import NodeCache from 'node-cache';
const cache = new NodeCache({ sdTTL: 3600 }); //Una hora de vida

import { UserService } from "./UserService.js";
import { BadRequestException, ForbiddenException, GenericException, NotFoundException } from "../lib/utils/Exceptions.js";
import { signToken } from '../lib/tokens/utils.js';
import { login_required, login_specific_or_higher_required } from "../lib/utils/middlewares.js";

export const loginRouter = Router();

loginRouter.get('/', (req,res) => {
    return res.json('Bieeeeenvenido al login');
});

loginRouter.get('/logout', (req,res) => {
    res.clearCookie('access_token');
    console.log('hola');
    return res.status(200).json({status:true, message: 'Se cerró sesión con éxito'});
});

loginRouter.post('/', async (req,res) => {
    /*
        Body = { empleado:number, password:string }
    */

    try{
        
        if( !req.body ) throw new BadRequestException('Es necesario agregar empleado y password al cuerpo de la petición');
        const loggedUser = await UserService.verifyUser( req.body );
        if( !loggedUser ) throw new NotFoundException('Usuario no encontrado');

        const userToken = {id: loggedUser.id, username: loggedUser.numempleado, roltype: loggedUser.roltype, lvl_roltype: loggedUser.lvl_roltype};
        const token = signToken( userToken );

        res.cookie('access_token', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 24000 * 60 * 60,
        });
        return res.status(200).json({status:true, message: 'Se logeó correctamente el usuario', result:userToken });
    }catch(err){
        
        if( err instanceof BadRequestException ) return res.status(400).json({ status: false, message: err.message });
        if( err instanceof NotFoundException ) return res.status(404).json({status: false, message: 'Credenciales no coinciden'});
        if( err instanceof GenericException ) return res.status(400).json({status: false, message: err.message});

        console.log(err)
        return res.status(500).json({status: false, message: 'Internal Server Error'});
    }

});

loginRouter.post('/create', async (req,res) => {
    /*
        Body = { nombre:string, empleado:number, password:string }
    */

    try{
        if( !req.body ) throw new BadRequestException('Es necesario agregar nombre,empleado y password al cuerpo de la petición');
        let newUser = await UserService.create( req.body );
        
        return res.status(201).json({status: true, message: 'Se creó el usuario', result: newUser});
    }catch(err){
        
        if( err instanceof BadRequestException ) return res.status(400).json({ status: false, message: err.message });
        if( err instanceof NotFoundException ) return res.status(404).json({status: false, message: 'El usuario especificado no existe'});
        
        if( err instanceof GenericException ) return res.status(400).json({status: false, message: err.message});

        console.log(err)
        return res.status(500).json({status: false, message: 'Internal Server Error'});
    }


});

loginRouter.post('/updatePass', async (req,res) => {
    /*
        Body = { empleado:number, old_password:string, new_password:string }
    */

    try{
        if( !req.body ) throw new BadRequestException('Faltan parametros en la petición');
        const {empleado, old_password, new_password} = req.body;

        await UserService.updatePassword({ empleado, old_pass: old_password, new_pass: new_password });

        return res.status(200).json({status: true, message: 'Se actualizó el usuario correctamente'});
    }catch(err){

        if( err instanceof BadRequestException ) return res.status(400).json({ status: false, message: err.message });
        if( err instanceof GenericException ) return res.status(400).json({status: false, message: err.message});

        console.log(err)
        return res.status(500).json({status:false, message: 'Internal Server Error'});
    }


});

loginRouter.get('/users', login_required, async (req,res) => {

    try{

        // if( cache.get('allUsersLogin') ) return res.status(200).json({status:true, message:`Se obtuvieron los usuarios desde cache`, result: cache.get('allUsersLogin')});

        const {count, data} = await UserService.getAllUsers();
        // cache.set('allUsersLogin', data);

        return res.status(200).json({status:true, message:`Se obtuvieron ${count} usuarios`, result: data});
    }catch(err){

        console.log(err);
        return res.status(500).json({status:false, message:'Internal Server Error'});
    }

});

loginRouter.get('/user/me', login_required, (req,res) => {
    const { iat, exp, ...publicToken } = req.access_token;
    return res.status(200).json({status:true, message: 'Se obtuvo la información del usuario', result: publicToken });
});

loginRouter.get('/user/me/details', login_required, async (req,res) => {

    try{
        const userData = await UserService.getUserById({ empleado: req.access_token.id })

        return res.status(200).json({status:true, message:'Se obtuvo la información del usuario', result: userData});
    }catch(err){
        if( err instanceof NotFoundException ) return res.status(404).json({status:false, message: 'Usuario no encontrado'});
        if( err instanceof BadRequestException ) return res.status(400).json({status:false, message: err.message});
        if( err instanceof GenericException ) return res.status(400).json({status:false, message: err.message});

        console.log(err);
        return res.status(500).json({status:false, message:'Internal Server Error'});
    }

})

loginRouter.patch('/user/me/updatePreferences', login_required, async (req,res) => {
    /*
        Body = data : user_preferences
    */

    try{
        const updatedUser = await UserService.updateUserPreferences( req.access_token.id, req.body );

        return res.status(200).json({status: true, message: 'Se actualizaron las preferencias del usuario', result: updatedUser});
    }catch(err){

        console.log(err);
        return res.status(500).json({status: false, message: 'Internal Server Error'});
    }
    
});

loginRouter.get('/user/:userId', login_required, async (req,res) => {
    /*
        Params = { empleado:uuid }
    */

    try{
        const userData = await UserService.getUserById({ empleado: req.params.userId })

        return res.status(200).json({status:true, message:'Se obtuvo la información del usuario', result: userData});
    }catch(err){
        if( err instanceof NotFoundException ) return res.status(404).json({status:false, message: 'Usuario no encontrado'});
        if( err instanceof BadRequestException ) return res.status(400).json({status:false, message: err.message});
        if( err instanceof GenericException ) return res.status(400).json({status:false, message: err.message});

        console.log(err);
        return res.status(500).json({status:false, message:'Internal Server Error'});
    }

});

loginRouter.patch('/user/:userId/update', login_required, async (req,res) => {
    /*
        Params = { userId: uuid }
        Body = { nombre: string, alias: string(2), color: string, avatar?:string|null }
    */

    try{
        const newUser = await UserService.updateUser(req.access_token, { ...req.body, ...req.params });

        return res.status(200).json({status:true, message: 'Se actualizó la información del usuario con éxito', result: newUser});
    }catch(err){

        if( err instanceof BadRequestException ) return res.status(400).json({status: false, message: err.message});
        if( err instanceof NotFoundException ) return res.status(400).json({status: false, message: err.message});
        if( err instanceof ForbiddenException ) return res.status(400).json({status: false, message: err.message});
        if( err instanceof GenericException ) return res.status(400).json({status: false, message: err.message});

        console.log(err)
        return res.status(500).json({status:false, message: 'Internal Server Error'});
    }

});

loginRouter.patch('/user/:userId/updateRole', login_specific_or_higher_required('EJECUTIVO STAFF'), async (req,res) => {
    /*
        Params = { userId: uuid }
        Body = { roltype: string }
    */

    try{
        const { roltype } = req.body
        const newUser = await UserService.updateUser(req.access_token, { ...req.params, roltype });

        return res.status(200).json({status:true, message: 'Se actualizó la información del usuario con éxito', result: newUser});
    }catch(err){

        if( err instanceof BadRequestException ) return res.status(400).json({status: false, message: err.message});
        if( err instanceof NotFoundException ) return res.status(400).json({status: false, message: err.message});
        if( err instanceof ForbiddenException ) return res.status(400).json({status: false, message: err.message});
        if( err instanceof GenericException ) return res.status(400).json({status: false, message: err.message});

        console.log(err)
        return res.status(500).json({status:false, message: 'Internal Server Error'});
    }

});

loginRouter.delete('/user/:userId', login_specific_or_higher_required('EJECUTIVO STAFF'), async (req,res) => {
    /*
        Params = { userId:uuid }
    */

    try{
        const user = await UserService.deleteUser( req.params );
        
        return res.status(200).json({status:true, message: 'Se eliminó el usuario con éxito'});
    }catch(err){

        console.log(err);
        return res.status(500).json({status:false, message: 'Internal Server Error'});
    }

})