export default function LogoHeader({title}:{title:string}) {
    return (
        <div className="flex items-center justify-center gap-10">
            <img className="w-16" src="/images/logos/logo 1.png" alt="Logo" />
            <h1 className="text-2xl font-bold">{title}</h1>
            <img className="w-16" src="/images/logos/logo 2.png" alt="Logo" />
        </div>
    );
}