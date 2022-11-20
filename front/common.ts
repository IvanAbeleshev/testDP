export const getRequestHeader=(token:string|null, multipartFormData: boolean)=>{
    interface iConfig{
        headers?:{
            [key: string]: string
        }
    }

    const config:iConfig = {}
    if(token){
        config.headers = {...config.headers, 'Authorization':'Bearer ' + token}
    }
    
    if(multipartFormData){
        config.headers = {...config.headers, 'Content-Type':'multipart/form-data'}
    }

    return config
}