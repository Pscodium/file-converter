import React, { useState } from 'react';
import { IoDownload, IoChevronDown } from 'react-icons/io5';
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
    const { generateModifiedSvg } = useSvgColorEditor();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedFormat, setSelectedFormat] = useState<ExportFormat>(exportFormats[0]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleFormatSelect = (format: ExportFormat) => {
        setSelectedFormat(format);
        setIsMenuOpen(false);
    };

    const exportSvg = async () => {
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
            const svgViewBox = svgElement.getAttribute('viewBox');

            let width = 800;
            let height = 600;

            if (svgWidth && svgHeight) {
                width = parseInt(svgWidth);
                height = parseInt(svgHeight);
            } else if (svgViewBox) {
                const viewBoxParts = svgViewBox.split(' ');
                if (viewBoxParts.length === 4) {
                    width = parseInt(viewBoxParts[2]);
                    height = parseInt(viewBoxParts[3]);
                }
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
        <div className='relative mt-4'>
            <div className='flex space-x-2'>
                <button onClick={exportSvg} className='flex-1 py-2 h-10 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center'>
                    <IoDownload className='mr-1' />
                    Baixar {selectedFormat.name}
                </button>

                <div className='relative'>
                    <button onClick={toggleMenu} className='py-2 h-10 px-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md flex items-center justify-center'>
                        <IoChevronDown className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isMenuOpen && (
                        <div className='absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10'>
                            <ul>
                                {exportFormats.map((format) => (
                                    <li key={format.id}>
                                        <button
                                            onClick={() => handleFormatSelect(format)}
                                            className={`
                                                w-full text-left px-4 py-2 text-sm
                                                ${selectedFormat.id === format.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}
                                            `}
                                        >
                                            Exportar como {format.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SvgExportOptions;
