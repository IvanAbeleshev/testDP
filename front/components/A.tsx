import Link from 'next/link'

interface TypeProps {
    className: string,
    children: React.ReactNode,
    href: string
}
const A = ({children, href, className}: TypeProps) =>{

    return (
        <Link href= {href} className={className}>
           {children}
        </Link>
    )
}

export default A