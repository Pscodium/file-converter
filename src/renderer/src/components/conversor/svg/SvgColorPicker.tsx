import React, { useState, useEffect } from 'react';
import { useSvgColorEditor } from './SvgColorEditorContext';
import SvgColorHistory from './SvgColorHistory';
import SvgBatchColorUpdate from './SvgBatchColorUpdate';

const commonColors = [
    '#f44336',
    '#e91e63',
    '#9c27b0',
    '#673ab7',
    '#3f51b5',
    '#2196f3',
    '#03a9f4',
    '#00bcd4',
    '#009688',
    '#4caf50',
    '#8bc34a',
    '#cddc39',
    '#ffeb3b',
    '#ffc107',
    '#ff9800',
    '#ff5722',
    '#795548',
    '#607d8b',
    '#000000',
    '#ffffff',
];

const SvgColorPicker: React.FC = () => {
    const { svgElements, selectedElement, editMode, updateElementColor } = useSvgColorEditor();
    const [colorValue, setColorValue] = useState<string>('#000000');

    useEffect(() => {
        if (!selectedElement) return;

        const selectedEl = svgElements.find((el) => el.id === selectedElement);
        if (!selectedEl) return;

        const currentColor = editMode === 'fill' ? selectedEl.currentFill : selectedEl.currentStroke;
        setColorValue(currentColor || '#000000');
    }, [selectedElement, editMode, svgElements]);

    const handleColorChange = (color: string) => {
        if (!selectedElement) return;

        setColorValue(color);
        updateElementColor(selectedElement, color);

        const svgContainer = document.querySelector('svg');
        if (svgContainer) {
            const element = svgContainer.querySelector(`#${selectedElement}`);
            if (element) {
                const attribute = editMode === 'fill' ? 'fill' : 'stroke';
                element.setAttribute(attribute, color);
            }
        }
    };

    if (!selectedElement) {
        return (
            <div className='mb-2 p-2 border rounded-md bg-gray-50'>
                <p className='text-gray-500 text-center text-xs'>Selecione um elemento SVG para editar sua cor.</p>
            </div>
        );
    }

    const selectedElName = svgElements.find((el) => el.id === selectedElement)?.id || 'element';

    const displayName = selectedElName.length > 15 ? selectedElName.substring(0, 12) + '...' : selectedElName;

    return (
        <div className='mb-2'>
            <div className='flex justify-between items-center mb-1'>
                <label className='text-xs text-gray-700 font-medium'>
                    {editMode === 'fill' ? 'Preenchimento' : 'Contorno'}: <span title={selectedElName}>{displayName}</span>
                </label>
                <button onClick={() => handleColorChange('transparent')} className='px-1 py-0.5 text-xs border border-gray-300 rounded hover:bg-gray-50 transition'>
                    Transparente
                </button>
            </div>

            <div className='flex items-center space-x-2 mb-2'>
                <input type='color' className='h-6 w-8 cursor-pointer' value={colorValue} onChange={(e) => handleColorChange(e.target.value)} />
                <input type='text' className='flex-1 p-1 border rounded text-xs' value={colorValue} onChange={(e) => handleColorChange(e.target.value)} placeholder='#000000' />
            </div>

            <div>
                <div className='grid grid-cols-10 gap-1'>
                    {commonColors.map((color) => (
                        <button
                            key={color}
                            className={`
                                w-5 h-5 rounded cursor-pointer
                                ${color === colorValue ? 'ring-1 ring-blue-500' : 'border border-gray-300'}
                                ${color === '#ffffff' ? 'border border-gray-300' : ''}
                            `}
                            style={{ backgroundColor: color }}
                            onClick={() => handleColorChange(color)}
                            title={color}
                        />
                    ))}
                </div>
            </div>

            <SvgColorHistory onSelectColor={handleColorChange} />

            <SvgBatchColorUpdate
                onUpdateComplete={() => {
                    const selectedEl = svgElements.find((el) => el.id === selectedElement);
                    if (selectedEl) {
                        const currentColor = editMode === 'fill' ? selectedEl.currentFill : selectedEl.currentStroke;
                        setColorValue(currentColor || '#000000');
                    }
                }}
            />
        </div>
    );
};

export default SvgColorPicker;
