import React, { useEffect } from 'react';
import { useSvgColorEditor } from './SvgColorEditorContext';

const SvgPathHighlighter: React.FC = () => {
    const { svgElements, selectedElement, setSelectedElement } = useSvgColorEditor();

    useEffect(() => {
        const svgContainer = document.querySelector('svg');
        if (!svgContainer) return;

        svgElements.forEach((el) => {
            const element = (svgContainer.querySelector(`#${el.id}`) as HTMLElement) || (svgContainer.querySelector(`[id="${el.id}"]`) as HTMLElement);

            if (!element) return;

            const originalStyles = {
                outline: element.style.outline,
                outlineOffset: element.style.outlineOffset,
                cursor: element.style.cursor,
                transition: element.style.transition,
            };

            const handleMouseEnter = () => {
                element.style.outline = '2px solid #2196f3';
                element.style.outlineOffset = '1px';
                element.style.cursor = 'pointer';
            };

            const handleMouseLeave = () => {
                if (el.id === selectedElement) {
                    element.style.outline = '2px solid #ff9800';
                    element.style.outlineOffset = '1px';
                } else {
                    element.style.outline = originalStyles.outline;
                    element.style.outlineOffset = originalStyles.outlineOffset;
                }
                element.style.cursor = originalStyles.cursor;
            };

            const handleClick = (e: Event) => {
                e.stopPropagation();
                setSelectedElement(el.id);
            };

            element.addEventListener('mouseenter', handleMouseEnter);
            element.addEventListener('mouseleave', handleMouseLeave);
            element.addEventListener('click', handleClick);

            if (el.id === selectedElement) {
                element.style.outline = '2px solid #ff9800';
                element.style.outlineOffset = '1px';
                element.style.transition = 'all 0.2s ease';
            }

            return () => {
                element.removeEventListener('mouseenter', handleMouseEnter);
                element.removeEventListener('mouseleave', handleMouseLeave);
                element.removeEventListener('click', handleClick);

                element.style.outline = originalStyles.outline;
                element.style.outlineOffset = originalStyles.outlineOffset;
                element.style.cursor = originalStyles.cursor;
                element.style.transition = originalStyles.transition;
            };
        });
    }, [svgElements, selectedElement, setSelectedElement]);

    return null;
};

export default SvgPathHighlighter;
