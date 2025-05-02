import React, { useState, useEffect } from 'react';
import { useSvgColorEditor } from './SvgColorEditorContext';

const MAX_HISTORY_COLORS = 12;

interface ColorHistoryProps {
    onSelectColor: (color: string) => void;
}

const SvgColorHistory: React.FC<ColorHistoryProps> = ({ onSelectColor }) => {
    const [colorHistory, setColorHistory] = useState<string[]>([]);
    const { svgElements, editMode, selectedElement, updateElementColor } = useSvgColorEditor();

    useEffect(() => {
        if (!selectedElement) return;

        const selectedEl = svgElements.find((el) => el.id === selectedElement);
        if (!selectedEl) return;

        const currentColor = editMode === 'fill' ? selectedEl.currentFill : selectedEl.currentStroke;

        if (currentColor && currentColor !== 'none' && currentColor !== 'transparent') {
            setColorHistory((prev) => {
                const filtered = prev.filter((c) => c !== currentColor);
                return [currentColor, ...filtered].slice(0, MAX_HISTORY_COLORS);
            });
        }
    }, [selectedElement, svgElements, editMode]);

    useEffect(() => {
        const initialColors = svgElements
            .map((el) => (editMode === 'fill' ? el.currentFill : el.currentStroke))
            .filter((color): color is string => color !== null && color !== undefined && color !== 'none' && color !== 'transparent');

        const uniqueColors = [...new Set(initialColors)];

        if (uniqueColors.length > 0) {
            setColorHistory((prev) => {
                const newColors = uniqueColors.filter((color) => !prev.includes(color));
                return [...prev, ...newColors].slice(0, MAX_HISTORY_COLORS);
            });
        }
    }, [svgElements, editMode]);

    const handleColorSelect = (color: string) => {
        if (selectedElement) {
            updateElementColor(selectedElement, color);

            setColorHistory((prev) => {
                const filtered = prev.filter((c) => c !== color);
                return [color, ...filtered].slice(0, MAX_HISTORY_COLORS);
            });
        }

        onSelectColor(color);
    };

    if (colorHistory.length === 0) {
        return null;
    }

    return (
        <div className='mt-1'>
            <label className='text-xs text-gray-500'>Recentes:</label>
            <div className='flex flex-wrap gap-1 mt-0.5'>
                {colorHistory.map((color, index) => (
                    <button
                        key={`${color}-${index}`}
                        className={`
                            w-4 h-4 rounded border cursor-pointer
                            ${color === '#ffffff' ? 'border-gray-300' : 'border-transparent'}
                        `}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorSelect(color)}
                        title={color}
                    />
                ))}
            </div>
        </div>
    );
};

export default SvgColorHistory;
