export default function Heading({ title, description }: { title: string; description?: string }) {
    return (
        <div className="mb-8 space-y-0.5">
            <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">{title}</h2>
            {description && <p className="text-muted-foreground dark:text-gray-400 text-sm">{description}</p>}
        </div>
    );
}
