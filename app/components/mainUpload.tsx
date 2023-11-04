'use client';
import { FC, useState } from 'react';
import Table from './table';
import LoadingSpinner from './loadingSpinner';
import XlsxUploader from './xlsxUploader';
import { Transition } from '@headlessui/react';

type AnalysisType = {
    title: string;
    overview: string;
    data: { [key: string]: string | number }[];
};

const MainUpload: FC = () => {
    const [items, setItems] = useState<{ [key: string]: string | number }[]>([]);
    const [query, setQuery] = useState<string>('');
    const [analysis, setAnalysis] = useState<AnalysisType | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleUpload = async () => {
        setIsLoading(true);
        if (items.length === 0 || query === '') return;
        // post the items to the server at /upload
        const url = 'http://localhost:3000/upload';
        const response = await (await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                message: query,
                data: items,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })).json();
        console.log('Response:', response);
        if (response.message && response.message.content) {
            setItems([]);
            console.log('Message:', response.message.content);
            const data = JSON.parse(response.message.content);
            setAnalysis(data);
        }
        setIsLoading(false);
    };

    return (
        <section id="upload" className="flex flex-col items-center justify-center max-w-5xl w-full px-8 py-16 my-4 space-y-8 rounded-lg ">
            <h2 className="text-xl font-semibold text-center">
                Upload and analyze your excel sheet
            </h2>
            <p className="text-md text-center text-neutral-500 dark:text-neutral-400">
                Upload your excel sheet to generate analysis
            </p>

            <Transition
                appear={true}
                show={items.length === 0 && !analysis}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full opacity-0"
                enterTo="translate-x-0 opacity-100"
                leave="transition ease-in-out duration-300 transform po"
                leaveFrom="translate-x-0 opacity-100"
                leaveTo="-translate-x-full opacity-0"
                className="w-full"
            >
                <XlsxUploader onInput={setItems} />
            </Transition>

            <Transition
                show={items.length > 0 && !isLoading}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full opacity-0"
                enterTo="translate-x-0 opacity-100"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0 opacity-100"
                leaveTo="-translate-x-full opacity-0"
                className="w-full"
            >
                <div className="mb-6 w-full">
                    <label htmlFor="query" className="block mb-2 text-gray-900 dark:text-white">Your type of analysis you want to have</label>
                    <input
                        type="text"
                        id="query"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Give me the most important 4 KPIs about the data"
                    />
                </div>
                {query !== '' && (
                    <button
                        onClick={handleUpload}
                        className="inline-flex items-center justify-center px-6 py-3 text-lg font-semibold 
                        rounded-md shadow-md transition-colors
                        bg-gradient-to-br from-sky-500 to-blue-500
                        hover:to-blue-600 text-white"
                    >
                        Start Analysis
                    </button>
                )}
                <Table title="Your data" description="" data={items} />
            </Transition>

            {isLoading && <LoadingSpinner />}
            {analysis && <Table title={analysis.title} description={analysis.overview} data={analysis.data} />}
        </section>
    );
};

export default MainUpload;