import { FC } from 'react';

type CardProps = {
    title: string;
    description: string;
    href: string;
};

const Card: FC<CardProps> = ({ title, description, href }) => (
    <a
        href={href}
        className="group rounded-lg border border-transparent px-5 py-4 transition-colors
            hover:border-gray-300 hover:bg-gray-100 hover:dark:border-gray-500 hover:dark:bg-gray-400/20
            "
        target="_blank"
        rel="noopener noreferrer"
    >
        <h2 className="b-3 text-2xl font-semibold  text-gray-800 dark:text-gray-200">
            {title}{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
            </span>
        </h2>
        <p className="m-0 max-w-[30ch] text-sm opacity-50 text-gray-600 dark:text-gray-400">
            {description}
        </p>
    </a>
);

export default Card;