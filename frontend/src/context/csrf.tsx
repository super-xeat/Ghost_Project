

export default function getcookie(name: string) {
    let cookievalue = null
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';')
        
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim()
            console.log('cookie :', cookie)
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookievalue = decodeURIComponent(cookie.substring(name.length + 1))
                console.log('cookievalue :', cookievalue)
                break
            }
        }
    } 
    return cookievalue
}