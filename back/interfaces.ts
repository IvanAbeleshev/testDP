export enum userRole{
    admin = 'admin',
    user = 'user',
    guest = 'guest'
}
export type user = {
    id: number, 
    login: string,
    role: userRole
}
