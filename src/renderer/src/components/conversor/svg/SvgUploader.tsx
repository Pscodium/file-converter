import React, { useRef } from 'react';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { useSvgColorEditor } from './SvgColorEditorContext';

const SvgUploader: React.FC = () => {
    const { setSvgContent, setSvgElements, setSelectedElement } = useSvgColorEditor();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.includes('svg')) {
            alert('Por favor, selecione um arquivo SVG válido.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            setSvgContent(content);

            setTimeout(() => {
                parseSvgElements(content);
            }, 100);
        };
        reader.readAsText(file);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const parseSvgElements = (svgContent: string) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = svgContent;

        const svgEl = tempDiv.querySelector('svg');
        if (!svgEl) return;

        const paths = Array.from(tempDiv.querySelectorAll('path, circle, rect, ellipse, polygon, polyline'));

        paths.forEach((element, index) => {
            if (!element.id || element.id.trim() === '') {
                element.id = `svg-element-${index}`;
            }
        });

        const pathElements = paths.map((element) => {
            const fill = element.getAttribute('fill');
            const stroke = element.getAttribute('stroke');

            return {
                id: element.id,
                element: element as SVGElement,
                originalFill: fill,
                originalStroke: stroke,
                currentFill: fill,
                currentStroke: stroke,
            };
        });

        const updatedSvgContent = tempDiv.innerHTML;
        console.log('Updated SVG content:', updatedSvgContent);
        setSvgContent(updatedSvgContent);
        setSvgElements(pathElements);

        if (pathElements.length > 0) {
            setSelectedElement(pathElements[0].id);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];

            if (!file.type.includes('svg')) {
                alert('Por favor, selecione um arquivo SVG válido.');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                setSvgContent(content);

                setTimeout(() => {
                    parseSvgElements(content);
                }, 100);
            };
            reader.readAsText(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div
            className='flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-white hover:bg-gray-50 cursor-pointer transition'
            onClick={triggerFileInput}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <IoCloudUploadOutline className='text-5xl text-blue-500 mb-4' />
            <p className='text-gray-600 font-medium mb-2'>Arraste e solte um arquivo SVG aqui ou clique para selecionar</p>
            <p className='text-gray-400 text-sm'>Apenas arquivos SVG são suportados</p>
            <input ref={fileInputRef} type='file' accept='.svg' onChange={handleFileUpload} className='hidden' />
        </div>
    );
};

export default SvgUploader;
