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
        <div className='mt-3 border-t pt-3'>
            <button className='text-sm text-blue-600 hover:text-blue-800 flex items-center' onClick={() => setIsExpanded(!isExpanded)}>
                <svg className={`h-4 w-4 mr-1 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                </svg>
                Encontrados {similarElements.length} elementos com a mesma cor
            </button>

            {isExpanded && (
                <div className='mt-2 pl-5 border-l-2 border-blue-100'>
                    <p className='text-sm text-gray-600 mb-2'>Atualizar todos os elementos {editMode === 'fill' ? 'preenchidos' : 'contornados'} com a mesma cor que o elemento selecionado:</p>

                    <button
                        onClick={() => {
                            const newColor = window.prompt('Digite a nova cor (ex: #ff0000, rgba(255,0,0,1), etc)');
                            if (newColor) {
                                updateAllSimilarElements(newColor);
                            }
                        }}
                        className='w-full py-1 px-2 mt-1 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100 transition'
                    >
                        Alterar a cor de todos de uma vez
                    </button>

                    <div className='mt-2 max-h-20 overflow-y-auto'>
                        <p className='text-xs text-gray-500'>Elementos similares:</p>
                        <ul className='text-xs text-gray-600 pl-2'>
                            {similarElements.slice(0, 5).map((el) => (
                                <li key={el.id} className='truncate'>
                                    {el.id}
                                </li>
                            ))}
                            {similarElements.length > 5 && <li className='text-xs italic'>...e mais {similarElements.length - 5} elementos</li>}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SvgBatchColorUpdate;
