'use client';
import { ChangeEvent, FC, useState } from 'react';
import * as XLSX from 'xlsx';

type AnalysisType = {
    title: string;
    overview: string;
    data: { [key: string]: string | number }[];
};

const XlsxUploader: FC = () => {
    const [items, setItems] = useState<{ [key: string]: string | number }[]>([]);
    const [query, setQuery] = useState<string>('');
    const [analysis, setAnalysis] = useState<AnalysisType | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const readExcel = (e: ChangeEvent<HTMLInputElement>) => {
        setItems([]);
        if (!e.target.files) return;
        const file = e.target.files[0];
        const promise = new Promise<{ [key: string]: string | number }[]>((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);
            fileReader.onload = (e) => {
                if (!e.target) return;
                const bufferArray = e.target.result;
                const wb = XLSX.read(bufferArray, {
                    type: "buffer"
                });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json<{ [key: string]: string | number }>(ws);
                resolve(data);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
        promise.then((d) => {
            setItems(d);
        });
    };

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
        <div className="flex flex-col items-center justify-center w-full max-w-5xl px-8 py-16 my-4 space-y-8 bg-white/20 rounded-lg shadow-lg dark:bg-neutral-800">
            <h2 className="text-3xl font-semibold text-center">
                Upload your excel sheet
            </h2>
            <p className="text-lg text-center text-neutral-500 dark:text-neutral-400">
                Upload your excel sheet to generate analysis
            </p>

            {items.length === 0 && !isLoading && !analysis && (
                <div className="mb-6 w-full">
                    <div className="extraOutline p-4 bg-white w-max bg-whtie m-auto rounded-lg">
                        <div className="file_upload p-5 relative border-4 border-dotted border-gray-300 rounded-lg">
                            <svg className="text-blue-500 w-24 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                            <div className="input_field flex flex-col w-max mx-auto text-center">
                                <label>
                                    <input
                                        className="text-sm cursor-pointer w-36 hidden"
                                        type="file"
                                        onChange={readExcel}
                                        id="file"
                                    />
                                    <div className="text bg-blue-600 text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-blue-500">Select</div>
                                </label>

                                <div className="title text-blue-500 uppercase">or drop files here</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {items.length > 0 && !isLoading && (
                <div className="mb-6 w-full">
                    <label htmlFor="query" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your type of analysis you want to have</label>
                    <input
                        type="text"
                        id="query"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Give me the most important 4 KPIs about the data"
                    />
                </div>
            )}

            {items.length > 0 && !isLoading && query !== '' && (
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

            {isLoading && (
                <div className="flex items-center justify-center">
                    <svg className="w-6 h-6 mr-3 -ml-1 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0
                        12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042
                        1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-lg font-semibold text-blue-500">Loading...</span>
                </div>
            )}

            {items.length > 0 && !isLoading && (
                <div>
                    <table>
                        <thead>
                            <tr>
                                {Object.keys(items[0]).map((key, index) => (
                                    <th key={index}>{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((datas, index) =>
                                <tr key={index}>
                                    {Object.values(datas).map((data, index) => (
                                        <td key={index}>{data}</td>
                                    ))}
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            {analysis && (
                <div className='pt-8'>
                    <h2 className="text-3xl font-semibold text-center">
                        {analysis.title}
                    </h2>
                    <p className="text-lg text-center text-neutral-500 dark:text-neutral-400">
                        {analysis.overview}
                    </p>
                    <div className="relative overflow-x-auto rounded-lg p-8">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    {Object.keys(analysis.data[0]).map((key, index) => (
                                        <th key={index} scope="col" className="px-6 py-3">{key}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {analysis.data.map((datas, index) =>
                                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        {Object.values(datas).map((data, index) => (
                                            <td key={index} className="px-6 py-4">{data}</td>
                                        ))}
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default XlsxUploader;