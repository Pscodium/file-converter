import React, { useState, useEffect, useRef } from 'react';
import { useSvgColorEditor } from './SvgColorEditorContext';

const MAX_HISTORY_COLORS = 12;

interface ColorHistoryProps {
    onSelectColor: (color: string) => void;
}

const SvgColorHistory: React.FC<ColorHistoryProps> = ({ onSelectColor }) => {
    const [colorHistory, setColorHistory] = useState<string[]>([]);
    const { svgElements, editMode, selectedElement, updateElementColor } = useSvgColorEditor();
    const lastColorRef = useRef<string | null>(null);
    const isChangingRef = useRef(false);
    const timeoutRef = useRef<number | null>(null);

    const loadColorHistory = () => {
        const historyStr = localStorage.getItem('colorHistory') || '[]';
        try {
            return JSON.parse(historyStr);
        } catch (e) {
            console.error('Erro ao analisar histórico de cores:', e);
            return [];
        }
    };

    useEffect(() => {
        const handleHistoryUpdate = () => {
            setColorHistory(loadColorHistory());
        };

        window.addEventListener('colorHistoryUpdated', handleHistoryUpdate);

        setColorHistory(loadColorHistory());

        return () => {
            window.removeEventListener('colorHistoryUpdated', handleHistoryUpdate);
        };
    }, []);

    useEffect(() => {
        if (!selectedElement) return;

        const selectedEl = svgElements.find((el) => el.id === selectedElement);
        if (!selectedEl) return;

        const currentColor = editMode === 'fill' ? selectedEl.currentFill : selectedEl.currentStroke;

        if (currentColor && currentColor !== 'none' && currentColor !== 'transparent' && currentColor !== lastColorRef.current) {
            lastColorRef.current = currentColor;

            if (isChangingRef.current) {
                if (timeoutRef.current !== null) {
                    window.clearTimeout(timeoutRef.current);
                }

                timeoutRef.current = window.setTimeout(() => {
                    isChangingRef.current = false;

                    const history = loadColorHistory();

                    const filtered = history.filter((c: string) => c !== currentColor);
                    const newHistory = [currentColor, ...filtered].slice(0, MAX_HISTORY_COLORS);

                    localStorage.setItem('colorHistory', JSON.stringify(newHistory));

                    setColorHistory(newHistory);
                }, 1000);
            } else {
                isChangingRef.current = true;
                timeoutRef.current = window.setTimeout(() => {
                    isChangingRef.current = false;

                    const history = loadColorHistory();

                    const filtered = history.filter((c: string) => c !== currentColor);
                    const newHistory = [currentColor, ...filtered].slice(0, MAX_HISTORY_COLORS);

                    localStorage.setItem('colorHistory', JSON.stringify(newHistory));

                    setColorHistory(newHistory);
                }, 1000);
            }
        }

        return () => {
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
            }
        };
    }, [selectedElement, svgElements, editMode]);

    const handleColorSelect = (color: string) => {
        if (selectedElement) {
            updateElementColor(selectedElement, color);

            const history = loadColorHistory();
            const filtered = history.filter((c: string) => c !== color);
            const newHistory = [color, ...filtered];

            localStorage.setItem('colorHistory', JSON.stringify(newHistory));

            setColorHistory(newHistory);

            lastColorRef.current = color;
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
