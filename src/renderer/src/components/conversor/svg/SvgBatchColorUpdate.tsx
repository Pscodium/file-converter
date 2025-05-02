/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { useSvgColorEditor } from './SvgColorEditorContext';

interface SvgBatchColorUpdateProps {
    onUpdateComplete: () => void;
}

const SvgBatchColorUpdate: React.FC<SvgBatchColorUpdateProps> = ({ onUpdateComplete }) => {
    const { svgElements, selectedElement, editMode, updateMultipleElementColors } = useSvgColorEditor();
    const [isExpanded, setIsExpanded] = useState(false);
    const [applyToAll, setApplyToAll] = useState(false);
    const [similarElements, setSimilarElements] = useState<string[]>([]);
    const [lastAppliedColor, setLastAppliedColor] = useState<string | null>(null);
    const isChangingRef = useRef(false);
    const timeoutRef = useRef<number | null>(null);

    const updateColorHistory = (color: string) => {
        const historyStr = localStorage.getItem('colorHistory') || '[]';
        let history: string[] = [];

        try {
            history = JSON.parse(historyStr);
        } catch (e) {
            console.error('Erro ao analisar histórico de cores:', e);
        }

        history = history.filter((c) => c !== color);
        history.unshift(color);

        history = history.slice(0, 12);

        localStorage.setItem('colorHistory', JSON.stringify(history));

        const event = new CustomEvent('colorHistoryUpdated');
        window.dispatchEvent(event);
    };

    const clearCurrentTimeout = () => {
        if (timeoutRef.current !== null) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    useEffect(() => {
        if (!selectedElement) {
            setSimilarElements([]);
            return;
        }

        const selectedEl = svgElements.find((el) => el.id === selectedElement);
        if (!selectedEl) {
            setSimilarElements([]);
            return;
        }

        const targetColor = editMode === 'fill' ? selectedEl.currentFill : selectedEl.currentStroke;

        const similar = svgElements
            .filter((el) => {
                const elColor = editMode === 'fill' ? el.currentFill : el.currentStroke;
                return elColor === targetColor && el.id !== selectedElement;
            })
            .map((el) => el.id);

        setSimilarElements(similar);
    }, [selectedElement, editMode, svgElements]);

    useEffect(() => {
        if (!applyToAll || !selectedElement || similarElements.length === 0) return;

        const selectedEl = svgElements.find((el) => el.id === selectedElement);
        if (!selectedEl) return;

        const currentColor = editMode === 'fill' ? selectedEl.currentFill : selectedEl.currentStroke;

        if (currentColor !== null && currentColor !== lastAppliedColor) {
            setLastAppliedColor(currentColor);

            updateMultipleElementColors(similarElements, currentColor);
            onUpdateComplete();

            isChangingRef.current = true;
            clearCurrentTimeout();

            timeoutRef.current = window.setTimeout(() => {
                isChangingRef.current = false;

                if (currentColor && currentColor !== 'none' && currentColor !== 'transparent') {
                    updateColorHistory(currentColor);
                }
            }, 1000);

            console.log(`Applied ${editMode} color ${currentColor} to ${similarElements.length} elements`);
        }
    }, [applyToAll, selectedElement, svgElements, editMode, similarElements, updateMultipleElementColors, onUpdateComplete, lastAppliedColor]);

    useEffect(() => {
        if (applyToAll && selectedElement && similarElements.length > 0) {
            const selectedEl = svgElements.find((el) => el.id === selectedElement);
            if (!selectedEl) return;

            const currentColor = editMode === 'fill' ? selectedEl.currentFill : selectedEl.currentStroke;
            if (currentColor !== null) {
                setLastAppliedColor(currentColor);
                updateMultipleElementColors(similarElements, currentColor);
                onUpdateComplete();

                if (currentColor && currentColor !== 'none' && currentColor !== 'transparent') {
                    updateColorHistory(currentColor);
                }

                console.log(`Initially applied ${editMode} color ${currentColor} to ${similarElements.length} elements`);
            }
        }
    }, [applyToAll]);

    useEffect(() => {
        return () => {
            clearCurrentTimeout();
        };
    }, []);

    if (similarElements.length === 0) {
        return null;
    }

    return (
        <div className='mt-1 border-t pt-1'>
            <div className='flex justify-between items-center'>
                <button className='text-xs text-blue-600 hover:text-blue-800 flex items-center' onClick={() => setIsExpanded(!isExpanded)}>
                    <svg className={`h-3 w-3 mr-1 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                    </svg>
                    <span className='mr-1'>{similarElements.length} elem. mesma cor</span>
                    <span className='text-xs text-gray-500'>
                        (
                        {similarElements
                            .slice(0, 2)
                            .map((id) => id.split('-').pop())
                            .join(', ')}
                        {similarElements.length > 2 ? '...' : ''})
                    </span>
                </button>

                <div className='flex items-center'>
                    <input type='checkbox' id='applyToAll' checked={applyToAll} onChange={() => setApplyToAll(!applyToAll)} className='mr-1' />
                    <label htmlFor='applyToAll' className='text-xs cursor-pointer'>
                        Aplicar a todos
                    </label>
                </div>
            </div>

            {isExpanded && (
                <div className='mt-1 pl-2 border-l border-blue-100'>
                    {!applyToAll && (
                        <button
                            onClick={() => {
                                const selectedEl = svgElements.find((el) => el.id === selectedElement);
                                if (!selectedEl) return;

                                const currentColor = editMode === 'fill' ? selectedEl.currentFill : selectedEl.currentStroke;

                                const newColor = window.prompt('Nova cor (ex: #ff0000)', currentColor || '#000000');
                                if (newColor) {
                                    updateMultipleElementColors(similarElements, newColor);
                                    onUpdateComplete();

                                    updateColorHistory(newColor);
                                }
                            }}
                            className='w-full py-0.5 px-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100 transition'
                        >
                            Alterar cor de todos
                        </button>
                    )}

                    <div className='mt-1 max-h-16 overflow-y-auto'>
                        <p className='text-xs text-gray-500'>Elementos similares:</p>
                        <div className='flex flex-wrap gap-1 mt-1'>
                            {similarElements.slice(0, 6).map((id, _index) => (
                                <span key={id} className='text-xs bg-gray-100 px-1 rounded truncate max-w-xs' title={id}>
                                    {id}
                                </span>
                            ))}
                            {similarElements.length > 6 && <span className='text-xs italic'>+{similarElements.length - 6}</span>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SvgBatchColorUpdate;
