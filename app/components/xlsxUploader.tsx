'use client';
import { ChangeEvent, FC, useState } from 'react';
import * as XLSX from 'xlsx';

type XlsxUploaderProps = {
    onInput: (data: { [key: string]: string | number }[]) => void;
};

const XlsxUploader: FC<XlsxUploaderProps> = ({ onInput }) => {
    const readExcel = (e: ChangeEvent<HTMLInputElement>) => {
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
            onInput(d);
        });
    };

    return (
        <div className="mb-6 w-full ">
            <div className="extraOutline p-4 m-auto rounded-lg">
                <label>
                    <div className="file_upload p-5 cursor-pointer relative border-4 border-dotted border-gray-300 rounded-lg hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 transition-colors">
                        <svg className="text-blue-500 w-24 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        <div className="input_field flex flex-col w-max mx-auto text-center">
                            <input
                                className="text-sm cursor-pointer w-36 hidden"
                                type="file"
                                onChange={readExcel}
                                id="file"
                            />
                            <div className="text bg-blue-600 text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-blue-500">Select</div>

                            <div className="title text-blue-500">or drop files here</div>
                        </div>
                    </div>
                </label>
            </div>
        </div>
    );
};

export default XlsxUploader;