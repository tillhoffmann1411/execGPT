import { FC } from 'react';

type TableProps = {
    title: string;
    description: string;
    data: { [key: string]: string | number }[];
};

const Table: FC<TableProps> = ({ title, description, data }) => (
    <div className='pt-8'>
        <h2 className="text-3xl font-semibold text-center">
            {title}
        </h2>
        <p className="text-lg text-center text-neutral-500 dark:text-neutral-400">
            {description}
        </p>
        <div className="relative overflow-x-auto rounded-lg p-8">
            <table className="w-full text-sm text-left rounded-lg text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-500/30 dark:text-gray-300">
                    <tr>
                        {Object.keys(data[0]).map((key, index) => (
                            <th key={index} scope="col" className="px-6 py-3">{key}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((datas, index) =>
                        <tr key={index} className="bg-white border-b dark:bg-gray-700/20 dark:border-gray-600">
                            {Object.values(datas).map((d, index) => (
                                <td key={index} className="px-6 py-4">{d}</td>
                            ))}
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

export default Table;