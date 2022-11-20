export interface iCategory{
    id: number,
    name: string,
    description?: string
}

export interface iBlog{
    id: number,
    title: string,
    cover: string,
    text: string
    user: {
        id: number,
        login: string
    },
    category: iCategory,
    updatedAt: Date
}

export interface iUser{
    id: number,
    login: string
}
export enum userRole{
    admin = 'admin',
    user = 'user',
    guest = 'guest'
}