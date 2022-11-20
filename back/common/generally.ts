import { userRole } from '../interfaces'
import { users } from '../model'
import bcrypt from 'bcrypt'

export const createUser=async(login: string, passwordBeforeBCrypt: string, role: userRole = userRole.guest)=>{
    const password = bcrypt.hashSync(passwordBeforeBCrypt, 10)
    return await users.create({login, password, role})
}

export const checkCreateFirstAdminUser=async()=>{
    const [user, created] = await users.findOrCreate({
        where: { role: userRole.admin, login: 'admin@gmail.com' },
        defaults: {
          password: bcrypt.hashSync('super_admin_password', 10)
        }
      });
}