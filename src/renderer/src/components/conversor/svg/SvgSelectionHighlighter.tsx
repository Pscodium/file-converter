import React, { useEffect } from 'react';
import { useSvgColorEditor } from './SvgColorEditorContext';

/**
 * Component to highlight the currently selected SVG element in the preview
 */
const SvgSelectionHighlighter: React.FC = () => {
    const { selectedElement, svgElements } = useSvgColorEditor();

    useEffect(() => {
        const svgContainer = document.querySelector('svg');
        if (!svgContainer) return;

        svgElements.forEach((el) => {
            const element = svgContainer.querySelector(`#${el.id}`) || svgContainer.querySelector(`[id="${el.id}"]`);

            if (element) {
                (element as SVGElement).style.outline = '';
                (element as SVGElement).style.outlineOffset = '';
            }
        });

        if (selectedElement) {
            const element = svgContainer.querySelector(`#${selectedElement}`) || svgContainer.querySelector(`[id="${selectedElement}"]`);

            if (element) {
                (element as SVGElement).style.outline = '2px solid #ff9800';
                (element as SVGElement).style.outlineOffset = '1px';
                (element as SVGElement).style.transition = 'outline 0.2s ease';
            }
        }

        return () => {
            if (selectedElement) {
                const element = svgContainer.querySelector(`#${selectedElement}`) || svgContainer.querySelector(`[id="${selectedElement}"]`);

                if (element) {
                    (element as SVGElement).style.outline = '';
                    (element as SVGElement).style.outlineOffset = '';
                    (element as SVGElement).style.transition = '';
                }
            }
        };
    }, [selectedElement, svgElements]);

    return null;
};

export default SvgSelectionHighlighter;
