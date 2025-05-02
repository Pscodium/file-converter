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
        return <div className='py-1 px-2 text-center text-gray-500 italic bg-gray-50 border rounded-md text-xs'>Nenhum elemento SVG detectado.</div>;
    }

    return (
        <div className='mb-2'>
            <div className='flex justify-between items-center mb-1'>
                <label className='text-xs text-gray-700 font-medium'>Elementos ({svgElements.length}):</label>

                {/* Compact search input */}
                {svgElements.length > 5 && (
                    <input type='text' placeholder='Buscar...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='w-30 p-1 text-xs border rounded-md' />
                )}
            </div>

            <div className='max-h-[250px] overflow-y-auto border rounded-md bg-white'>
                {filteredElements.length === 0 ? (
                    <div className='p-1 text-xs text-gray-500 text-center'>Nenhum elemento encontrado.</div>
                ) : (
                    filteredElements.map((element) => (
                        <div
                            key={element.id}
                            className={`
                                py-2 px-1 cursor-pointer border-b last:border-b-0 flex items-center
                                ${selectedElement === element.id ? 'bg-blue-50' : ''}
                                ${isHovering === element.id ? 'bg-gray-100' : ''}
                            `}
                            onClick={() => handleElementSelect(element.id)}
                            onMouseEnter={() => handleMouseEnter(element.id)}
                            onMouseLeave={() => handleMouseLeave(element.id)}
                        >
                            <div
                                className='w-3 h-3 mr-1 rounded-sm'
                                style={{
                                    backgroundColor: editMode === 'fill' ? element.currentFill || 'transparent' : element.currentStroke || 'transparent',
                                    border: '1px solid #ccc',
                                    backgroundImage:
                                        (!element.currentFill && editMode === 'fill') || (!element.currentStroke && editMode === 'stroke')
                                            ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)'
                                            : 'none',
                                    backgroundSize: '6px 6px',
                                    backgroundPosition: '0 0, 3px 3px',
                                }}
                            />
                            <span className='text-xs truncate flex-1' title={element.id}>
                                {element.id.length > 15 ? element.id.substring(0, 12) + '...' : element.id}
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
                                        backgroundSize: '4px 4px',
                                        backgroundPosition: '0 0, 2px 2px',
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
                                        backgroundSize: '4px 4px',
                                        backgroundPosition: '0 0, 2px 2px',
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
