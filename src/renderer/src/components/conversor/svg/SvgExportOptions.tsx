import React, { useState } from 'react';
import { IoDownload } from 'react-icons/io5';
import { useSvgColorEditor } from './SvgColorEditorContext';

interface ExportFormat {
    id: string;
    name: string;
    extension: string;
    mimeType: string;
}

const exportFormats: ExportFormat[] = [
    { id: 'svg', name: 'SVG', extension: 'svg', mimeType: 'image/svg+xml' },
    { id: 'png', name: 'PNG', extension: 'png', mimeType: 'image/png' },
    { id: 'jpeg', name: 'JPEG', extension: 'jpg', mimeType: 'image/jpeg' },
];

const SvgExportOptions: React.FC = () => {
    const { generateModifiedSvg, exportSize, setExportSize } = useSvgColorEditor();
    const [selectedFormat, setSelectedFormat] = useState<ExportFormat>(exportFormats[0]);

    const exportFile = async () => {
        const modifiedSvg = generateModifiedSvg();
        if (!modifiedSvg) return;

        if (selectedFormat.id === 'svg') {
            const blob = new Blob([modifiedSvg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `modified-svg.${selectedFormat.extension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = modifiedSvg;
            const svgElement = tempDiv.querySelector('svg');
            if (!svgElement) return;

            const svgWidth = svgElement.getAttribute('width');
            const svgHeight = svgElement.getAttribute('height');
            // const svgViewBox = svgElement.getAttribute('viewBox');

            let width = exportSize.width;
            let height = exportSize.height;

            if (svgWidth && svgHeight) {
                width = parseInt(svgWidth);
                height = parseInt(svgHeight);
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            if (!ctx) return;

            const img = new Image();
            const svgBlob = new Blob([modifiedSvg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(svgBlob);

            img.onload = () => {
                ctx.clearRect(0, 0, width, height);
                ctx.drawImage(img, 0, 0, width, height);

                const dataUrl = canvas.toDataURL(selectedFormat.mimeType);

                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = `modified-svg.${selectedFormat.extension}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                URL.revokeObjectURL(url);
            };

            img.src = url;
        }
    };

    return (
        <div className='mb-2'>
            <div className='flex space-x-1 items-center h-12'>
                <div className='h-full flex flex-col justify-end'>
                    <div className='flex justify-between items-center mb-1'>
                        <label className='text-xs text-gray-700 font-medium'>Formato:</label>
                    </div>

                    <div className='relative'>
                        <select
                            value={selectedFormat.id}
                            onChange={(e) => {
                                const format = exportFormats.find((f) => f.id === e.target.value);
                                if (format) setSelectedFormat(format);
                            }}
                            className='w-24 py-1 px-2 border border-gray-300 rounded-md text-xs'
                        >
                            {exportFormats.map((format) => (
                                <option key={format.id} value={format.id}>
                                    {format.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='h-full justify-end flex flex-col'>
                    <div className='flex justify-between items-center mb-1'>
                        <label className='text-xs text-gray-700 font-medium'>Resolução:</label>
                    </div>
                    <div className='flex gap-[1px]'>
                        <input
                            type='text'
                            value={exportSize.height}
                            onChange={(e) => setExportSize({ ...exportSize, height: parseInt(e.target.value, 10) })}
                            placeholder='800'
                            className='w-14 border border-gray-300 p-1 py-[5px] text-xs rounded-md'
                        />
                        <p className='text-gray-400'>X</p>
                        <input
                            type='text'
                            value={exportSize.width}
                            onChange={(e) => setExportSize({ ...exportSize, width: parseInt(e.target.value, 10) })}
                            placeholder='800'
                            className='w-14 border border-gray-300 p-1 text-xs rounded-md'
                        />
                    </div>
                </div>
                <div className='flex flex-1 h-full items-end'>
                    <button onClick={exportFile} className='py-1 flex-1 h-7 px-2 flex items-center justify-center bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs'>
                        <IoDownload className='mr-1' />
                        Baixar {selectedFormat.name}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SvgExportOptions;
