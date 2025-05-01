import React, { useState } from 'react';
import { useSvgColorEditor } from './SvgColorEditorContext';

const SvgElementSelector: React.FC = () => {
    const { svgElements, selectedElement, setSelectedElement, editMode } = useSvgColorEditor();

    const [searchTerm, setSearchTerm] = useState('');
    const [isHovering, setIsHovering] = useState<string | null>(null);

    const handleElementSelect = (id: string) => {
        setSelectedElement(id);

        const svgContainer = document.querySelector('svg');
        if (svgContainer) {
            svgElements.forEach((el) => {
                const element = svgContainer.querySelector(`#${el.id}`);
                if (element) {
                    (element as SVGElement).style.outline = '';
                    (element as SVGElement).style.outlineOffset = '';
                }
            });

            const element = svgContainer.querySelector(`#${id}`);
            if (element) {
                (element as SVGElement).style.outline = '2px solid #ff9800';
                (element as SVGElement).style.outlineOffset = '2px';

                element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    };

    const handleMouseEnter = (id: string) => {
        setIsHovering(id);

        const svgContainer = document.querySelector('svg');
        if (svgContainer) {
            const element = svgContainer.querySelector(`#${id}`) || svgContainer.querySelector(`[id="${id}"]`);
            if (element) {
                (element as SVGElement).style.outline = '2px dashed #2196f3';
                (element as SVGElement).style.outlineOffset = '1px';
            }
        }
    };

    const handleMouseLeave = (id: string) => {
        setIsHovering(null);

        const svgContainer = document.querySelector('svg');
        if (svgContainer) {
            const element = svgContainer.querySelector(`#${id}`) || svgContainer.querySelector(`[id="${id}"]`);
            if (element && id !== selectedElement) {
                (element as SVGElement).style.outline = '';
                (element as SVGElement).style.outlineOffset = '';
            } else if (element && id === selectedElement) {
                (element as SVGElement).style.outline = '2px solid #ff9800';
                (element as SVGElement).style.outlineOffset = '1px';
            }
        }
    };

    const filteredElements = svgElements.filter((el) => el.id.toLowerCase().includes(searchTerm.toLowerCase()));

    if (svgElements.length === 0) {
        return <div className='py-4 px-3 text-center text-gray-500 italic bg-gray-50 border rounded-md'>Nenhum elemento SVG detectado.</div>;
    }

    return (
        <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-medium mb-1'>Selecione um elemento para editar ({svgElements.length} elementos):</label>

            {/* Search input */}
            {svgElements.length > 5 && (
                <div className='mb-2'>
                    <input type='text' placeholder='Buscar elementos...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='w-full p-2 text-sm border rounded-md' />
                </div>
            )}

            <div className='max-h-48 overflow-y-auto border rounded-md bg-white'>
                {filteredElements.length === 0 ? (
                    <div className='p-2 text-sm text-gray-500 text-center'>Nenhum elemento encontrado.</div>
                ) : (
                    filteredElements.map((element) => (
                        <div
                            key={element.id}
                            className={`
                                p-2 cursor-pointer border-b last:border-b-0 flex items-center
                                ${selectedElement === element.id ? 'bg-blue-50' : ''}
                                ${isHovering === element.id ? 'bg-gray-100' : ''}
                            `}
                            onClick={() => handleElementSelect(element.id)}
                            onMouseEnter={() => handleMouseEnter(element.id)}
                            onMouseLeave={() => handleMouseLeave(element.id)}
                        >
                            <div
                                className='w-5 h-5 mr-2 rounded-sm'
                                style={{
                                    backgroundColor: editMode === 'fill' ? element.currentFill || 'transparent' : element.currentStroke || 'transparent',
                                    border: '1px solid #ccc',
                                    backgroundImage:
                                        (!element.currentFill && editMode === 'fill') || (!element.currentStroke && editMode === 'stroke')
                                            ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)'
                                            : 'none',
                                    backgroundSize: '8px 8px',
                                    backgroundPosition: '0 0, 4px 4px',
                                }}
                            />
                            <span className='text-sm truncate flex-1' title={element.id}>
                                {element.id}
                            </span>
                            <div className='flex space-x-1'>
                                <div
                                    className='w-3 h-3 rounded-full'
                                    style={{
                                        backgroundColor: element.currentFill || 'transparent',
                                        border: '1px solid #ddd',
                                        backgroundImage: !element.currentFill
                                            ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)'
                                            : 'none',
                                        backgroundSize: '6px 6px',
                                        backgroundPosition: '0 0, 3px 3px',
                                    }}
                                    title='Cor de preenchimento'
                                />
                                <div
                                    className='w-3 h-3 rounded-full'
                                    style={{
                                        backgroundColor: element.currentStroke || 'transparent',
                                        border: '1px solid #ddd',
                                        backgroundImage: !element.currentStroke
                                            ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)'
                                            : 'none',
                                        backgroundSize: '6px 6px',
                                        backgroundPosition: '0 0, 3px 3px',
                                    }}
                                    title='Cor de contorno'
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SvgElementSelector;
