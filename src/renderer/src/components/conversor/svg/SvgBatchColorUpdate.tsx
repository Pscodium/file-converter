import React, { useState } from 'react';
import { useSvgColorEditor } from './SvgColorEditorContext';

interface SvgBatchColorUpdateProps {
    onUpdateComplete: () => void;
}

const SvgBatchColorUpdate: React.FC<SvgBatchColorUpdateProps> = ({ onUpdateComplete }) => {
    const { svgElements, selectedElement, editMode, updateMultipleElementColors } = useSvgColorEditor();

    const [isExpanded, setIsExpanded] = useState(false);

    const findSimilarElements = () => {
        if (!selectedElement) return [];

        const selectedEl = svgElements.find((el) => el.id === selectedElement);
        if (!selectedEl) return [];

        const targetColor = editMode === 'fill' ? selectedEl.currentFill : selectedEl.currentStroke;

        return svgElements.filter((el) => {
            const elColor = editMode === 'fill' ? el.currentFill : el.currentStroke;
            return elColor === targetColor && el.id !== selectedElement;
        });
    };

    const similarElements = findSimilarElements();

    if (similarElements.length === 0) {
        return null;
    }

    const updateAllSimilarElements = (newColor: string) => {
        const selectedEl = svgElements.find((el) => el.id === selectedElement);
        if (!selectedEl) return;

        const currentColor = editMode === 'fill' ? selectedEl.currentFill : selectedEl.currentStroke;

        const elementsToUpdate = svgElements
            .filter((el) => {
                const elColor = editMode === 'fill' ? el.currentFill : el.currentStroke;
                return elColor === currentColor;
            })
            .map((el) => el.id);

        updateMultipleElementColors(elementsToUpdate, newColor);

        onUpdateComplete();
    };

    return (
        <div className='mt-1 border-t pt-1'>
            <button className='text-xs text-blue-600 hover:text-blue-800 flex items-center' onClick={() => setIsExpanded(!isExpanded)}>
                <svg className={`h-3 w-3 mr-1 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                </svg>
                {similarElements.length} elem. mesma cor
            </button>

            {isExpanded && (
                <div className='mt-1 pl-2 border-l border-blue-100'>
                    <button
                        onClick={() => {
                            const newColor = window.prompt('Nova cor (ex: #ff0000)');
                            if (newColor) {
                                updateAllSimilarElements(newColor);
                            }
                        }}
                        className='w-full py-0.5 px-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100 transition'
                    >
                        Alterar cor de todos
                    </button>
                </div>
            )}
        </div>
    );
};

export default SvgBatchColorUpdate;
