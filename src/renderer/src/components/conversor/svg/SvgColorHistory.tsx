import React, { useState, useEffect } from 'react';
import { useSvgColorEditor } from './SvgColorEditorContext';

const MAX_HISTORY_COLORS = 8;

interface ColorHistoryProps {
    onSelectColor: (color: string) => void;
}

const SvgColorHistory: React.FC<ColorHistoryProps> = ({ onSelectColor }) => {
    const [colorHistory, setColorHistory] = useState<string[]>([]);
    const { svgElements, editMode } = useSvgColorEditor();

    useEffect(() => {
        const colors = svgElements
            .map((el) => (editMode === 'fill' ? el.currentFill : el.currentStroke))
            .filter((color): color is string => color !== null && color !== undefined && color !== 'none' && color !== 'transparent');

        setColorHistory((prevHistory) => {
            const newHistory = [...prevHistory];

            colors.forEach((color) => {
                if (!newHistory.includes(color)) {
                    newHistory.unshift(color);
                }
            });

            return newHistory.slice(0, MAX_HISTORY_COLORS);
        });
    }, [svgElements, editMode]);

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
                        className='w-4 h-4 rounded border border-gray-300 cursor-pointer'
                        style={{ backgroundColor: color }}
                        onClick={() => onSelectColor(color)}
                        title={color}
                    />
                ))}
            </div>
        </div>
    );
};

export default SvgColorHistory;
