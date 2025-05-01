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
                console.log(`Direct DOM update: Setting ${attribute} of ${selectedElement} to ${color}`);
                element.setAttribute(attribute, color);
            }
        }
    };

    if (!selectedElement) {
        return (
            <div className='mb-4 p-4 border rounded-md bg-gray-50'>
                <p className='text-gray-500 text-center'>Selecione um elemento SVG para editar sua cor.</p>
            </div>
        );
    }

    const selectedElName = svgElements.find((el) => el.id === selectedElement)?.id || 'element';

    return (
        <div className='mb-4'>
            <div className='flex justify-between items-center mb-2'>
                <label className='block text-gray-700 text-sm font-medium'>
                    Cor de {editMode === 'fill' ? 'preenchimento' : 'contorno'} para {selectedElName}:
                </label>
            </div>

            <div className='flex items-center space-x-2 mb-3'>
                <input type='color' className='h-10 w-14 cursor-pointer' value={colorValue} onChange={(e) => handleColorChange(e.target.value)} />
                <input
                    type='text'
                    className='flex-1 p-2 border rounded-md'
                    value={colorValue}
                    onChange={(e) => handleColorChange(e.target.value)}
                    placeholder={editMode === 'fill' ? 'Cor de preenchimento' : 'Cor do contorno'}
                />
            </div>

            <div>
                <label className='block text-gray-700 text-sm font-medium mb-2'>Cores predefinidas:</label>
                <div className='flex flex-wrap gap-2'>
                    {commonColors.map((color) => (
                        <button
                            key={color}
                            className={`
                                w-8 h-8 rounded-md cursor-pointer
                                ${color === colorValue ? 'ring-2 ring-blue-500' : 'border border-gray-300'}
                                ${color === '#ffffff' ? 'border border-gray-300' : ''}
                            `}
                            style={{ backgroundColor: color }}
                            onClick={() => handleColorChange(color)}
                            title={color}
                        />
                    ))}
                </div>
            </div>

            <div className='mt-3'>
                <button onClick={() => handleColorChange('transparent')} className='px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition'>
                    Transparente
                </button>
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
