/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
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

                console.log(`Initially applied ${editMode} color ${currentColor} to ${similarElements.length} elements`);
            }
        }
    }, [applyToAll]);

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
                        <button onClick={() => setApplyToAll(true)} className='w-full py-0.5 px-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100 transition'>
                            Alterar cor de todos
                        </button>
                    )}

                    <div className='mt-1 max-h-16 overflow-y-auto'>
                        <p className='text-xs text-gray-500'>Elementos similares:</p>
                        <div className='flex flex-wrap gap-1 mt-1'>
                            {similarElements.slice(0, 6).map((id, _index) => (
                                <span key={id} className='text-xs bg-gray-100 px-1 rounded truncate max-w-xs' title={id}>
                                    {id.length > 8 ? `${id.substring(0, 8)}...` : id}
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
